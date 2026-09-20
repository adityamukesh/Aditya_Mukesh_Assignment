require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const { User, Inventory, BloodRequest } = require('./models');
const { requireAuth, requireAdmin } = require('./middleware');

const app = express();
const port = process.env.PORT || 3000;
const groups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET || 'development-secret-change-me',
    resave: false,
    saveUninitialized: false,
    store: process.env.MONGODB_URI ? MongoStore.create({ mongoUrl: process.env.MONGODB_URI }) : undefined,
    cookie: { maxAge: 1000 * 60 * 60 * 8, httpOnly: true, sameSite: 'lax' }
}));
app.use((req, res, next) => {
    res.locals.currentUser = req.session.user;
    res.locals.path = req.path;
    next();
});

function daysSince(date) { return date ? Math.floor((Date.now() - new Date(date).getTime()) / 86400000) : null; }
function isEligible(date) { return !date || daysSince(date) >= 90; }
function flashRedirect(res, destination, key, message) { return res.redirect(`${destination}?${key}=${encodeURIComponent(message)}`); }
function wantsJson(req) { return req.get('Accept')?.includes('application/json') || req.query.format === 'json'; }
function dbRequired(req, res, next) {
    if (mongoose.connection.readyState !== 1) return res.status(503).render('error', { title: 'Database unavailable', message: 'Add your MongoDB Atlas connection string to .env and restart the app.' });
    next();
}

app.get('/', async (req, res) => {
    const inventory = mongoose.connection.readyState === 1 ? await Inventory.find().sort({ units: -1 }).lean() : [];
    res.render('landing', { title: 'Give blood. Give tomorrow.', inventory });
});
app.get('/login', (req, res) => res.render('login', { title: 'Welcome back', error: req.query.error }));
app.post('/login', dbRequired, async (req, res) => {
    const user = await User.findOne({ email: req.body.email.toLowerCase().trim() });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        if (wantsJson(req)) return res.status(401).json({ error: 'Email or password is incorrect.' });
        return flashRedirect(res, '/login', 'error', 'Email or password is incorrect.');
    }
    req.session.user = { id: user._id.toString(), name: user.name, role: user.role, bloodGroup: user.bloodGroup };
    if (wantsJson(req)) return res.json({ message: 'Login successful', user: req.session.user });
    res.redirect(user.role === 'admin' ? '/admin' : '/dashboard');
});
app.get('/register', (req, res) => res.render('register', { title: 'Become a donor', error: req.query.error }));
app.post('/register', dbRequired, async (req, res) => {
    try {
        const password = await bcrypt.hash(req.body.password, 10);
        const user = await User.create({ name: req.body.name, email: req.body.email, password, phone: req.body.phone, bloodGroup: req.body.bloodGroup, city: req.body.city, lastDonation: req.body.lastDonation || undefined });
        req.session.user = { id: user._id.toString(), name: user.name, role: user.role, bloodGroup: user.bloodGroup };
        if (wantsJson(req)) return res.status(201).json({ message: 'Registration successful', user: { id: user._id, name: user.name, email: user.email, phone: user.phone, bloodGroup: user.bloodGroup, city: user.city, lastDonation: user.lastDonation || null, role: user.role } });
        res.redirect('/dashboard');
    } catch (error) {
        if (wantsJson(req)) return res.status(error.code === 11000 ? 409 : 400).json({ error: error.code === 11000 ? 'An account with that email already exists.' : 'Please check the submitted details.', details: error.message });
        flashRedirect(res, '/register', 'error', error.code === 11000 ? 'An account with that email already exists.' : 'Please check your details and try again.');
    }
});
app.post('/logout', (req, res) => req.session.destroy(() => res.redirect('/')));

app.get('/dashboard', requireAuth, dbRequired, async (req, res) => {
    const [inventory, requests, donor] = await Promise.all([
        Inventory.find().sort({ bloodGroup: 1 }).lean(),
        BloodRequest.find({ requester: req.session.user.id }).sort({ createdAt: -1 }).lean(),
        User.findById(req.session.user.id).lean()
    ]);
    res.render('dashboard', { title: 'Your dashboard', inventory, requests, donor, eligible: isEligible(donor.lastDonation), days: daysSince(donor.lastDonation), success: req.query.success });
});
app.get('/search', requireAuth, dbRequired, async (req, res) => {
    const selected = req.query.group || '';
    const inventory = await Inventory.find(selected ? { bloodGroup: selected } : {}).sort({ bloodGroup: 1 }).lean();
    res.render('search', { title: 'Find blood', inventory, groups, selected });
});
app.get('/request', requireAuth, (req, res) => res.render('request', { title: 'Request blood', groups, error: req.query.error, success: req.query.success }));
app.post('/request', requireAuth, dbRequired, async (req, res) => {
    const request = await BloodRequest.create({ ...req.body, requester: req.session.user.id, units: Number(req.body.units) });
    if (wantsJson(req)) return res.status(201).json({ message: 'Blood request submitted', request });
    flashRedirect(res, '/dashboard', 'success', 'Your request has been sent to the blood bank.');
});

app.get('/admin', requireAuth, requireAdmin, dbRequired, async (req, res) => {
    const [inventory, requests, donors] = await Promise.all([
        Inventory.find().sort({ units: 1 }).lean(),
        BloodRequest.find().populate('requester', 'name email').sort({ createdAt: -1 }).lean(),
        User.find({ role: 'donor' }).sort({ createdAt: -1 }).lean()
    ]);
    res.render('admin', { title: 'Operations overview', inventory, requests, donors, activeRequests: requests.filter((item) => item.status !== 'Fulfilled'), lowStock: inventory.filter((item) => item.units < item.target), success: req.query.success });
});
app.post('/admin/inventory', requireAuth, requireAdmin, dbRequired, async (req, res) => {
    const inventory = await Inventory.findOneAndUpdate(
        { bloodGroup: req.body.bloodGroup },
        { $set: { units: Number(req.body.units), target: Number(req.body.target || 25), updatedAt: new Date() }, $setOnInsert: { bloodGroup: req.body.bloodGroup } },
        { upsert: true, new: true, runValidators: true }
    );
    if (wantsJson(req)) return res.status(200).json({ message: 'Inventory saved', inventory });
    flashRedirect(res, '/admin', 'success', 'Inventory saved.');
});
app.post('/admin/inventory/:id', requireAuth, requireAdmin, dbRequired, async (req, res) => { await Inventory.findByIdAndUpdate(req.params.id, { units: Number(req.body.units), updatedAt: new Date() }); flashRedirect(res, '/admin', 'success', 'Inventory updated.'); });
app.post('/admin/requests/:id/status', requireAuth, requireAdmin, dbRequired, async (req, res) => { await BloodRequest.findByIdAndUpdate(req.params.id, { status: req.body.status }); flashRedirect(res, '/admin', 'success', 'Request status updated.'); });
app.get('/admin/donors', requireAuth, requireAdmin, dbRequired, async (req, res) => { const donors = await User.find({ role: 'donor' }).sort({ createdAt: -1 }).lean(); res.render('donors', { title: 'Donor directory', donors }); });
app.use((req, res) => res.status(404).render('error', { title: 'Page not found', message: 'The page you are looking for does not exist.' }));

async function start() {
    if (process.env.MONGODB_URI) {
        try { await mongoose.connect(process.env.MONGODB_URI); console.log('Connected to MongoDB Atlas'); }
        catch (error) { console.error('MongoDB connection failed:', error.message); }
    } else console.warn('MONGODB_URI is missing. Public pages work; database features are disabled.');
    app.listen(port, () => console.log(`LifeLink running at http://localhost:${port}`));
}
start();
