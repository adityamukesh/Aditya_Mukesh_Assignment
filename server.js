require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const { connectDatabase } = require('./config/database');
const publicRoutes = require('./routes/publicRoutes');
const authRoutes = require('./routes/authRoutes');
const donorRoutes = require('./routes/donorRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const port = process.env.PORT || 3000;

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

app.use(authRoutes);
app.use(donorRoutes);
app.use('/admin', adminRoutes);
app.use(publicRoutes);

async function start() {
    await connectDatabase();
    app.listen(port, () => console.log(`LifeLink running at http://localhost:${port}`));
}

if (require.main === module) start();

module.exports = app;
