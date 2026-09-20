const mongoose = require('mongoose');
const { Inventory } = require('../models');

async function landingPage(req, res) {
    const inventory = mongoose.connection.readyState === 1
        ? await Inventory.find().sort({ units: -1 }).lean()
        : [];
    res.render('landing', { title: 'Give blood. Give tomorrow.', inventory });
}

function loginPage(req, res) {
    res.render('login', { title: 'Welcome back', error: req.query.error });
}

function registerPage(req, res) {
    res.render('register', { title: 'Become a donor', error: req.query.error });
}

function notFound(req, res) {
    res.status(404).render('error', { title: 'Page not found', message: 'The page you are looking for does not exist.' });
}

module.exports = { landingPage, loginPage, registerPage, notFound };
