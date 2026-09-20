const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { wantsJson } = require('../middleware/request');
const { flashRedirect } = require('../utils/response');

function sessionUser(user) {
    return { id: user._id.toString(), name: user.name, role: user.role, city: user.city };
}

async function login(req, res) {
    const user = await User.findOne({ email: req.body.email.toLowerCase().trim() });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        if (wantsJson(req)) return res.status(401).json({ error: 'Email or password is incorrect.' });
        return flashRedirect(res, '/login', 'error', 'Email or password is incorrect.');
    }

    req.session.user = sessionUser(user);
    if (wantsJson(req)) return res.json({ message: 'Login successful', user: req.session.user });
    res.redirect(user.role === 'admin' ? '/admin' : user.role === 'agent' ? '/agent' : '/dashboard');
}

async function register(req, res) {
    try {
        const password = await bcrypt.hash(req.body.password, 10);
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password,
            phone: req.body.phone,
            city: req.body.city,
            role: req.body.role === 'agent' ? 'agent' : 'customer'
        });

        req.session.user = sessionUser(user);
        if (wantsJson(req)) {
            return res.status(201).json({
                message: 'Registration successful',
                user: { id: user._id, name: user.name, email: user.email, phone: user.phone, city: user.city, role: user.role }
            });
        }
        res.redirect('/dashboard');
    } catch (error) {
        const duplicate = error.code === 11000;
        const message = duplicate ? 'An account with that email already exists.' : 'Please check your details and try again.';
        if (wantsJson(req)) return res.status(duplicate ? 409 : 400).json({ error: message, details: error.message });
        flashRedirect(res, '/register', 'error', message);
    }
}

function logout(req, res) {
    req.session.destroy(() => res.redirect('/'));
}

module.exports = { login, register, logout };
