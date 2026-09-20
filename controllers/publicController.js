const { Parcel } = require('../models');

async function landingPage(req, res) {
    const recentParcels = await Parcel.find().sort({ createdAt: -1 }).limit(3).lean().catch(() => []);
    res.render('landing', { title: 'Move what matters.', recentParcels });
}

function loginPage(req, res) { res.render('login', { title: 'Welcome back', error: req.query.error }); }
function registerPage(req, res) { res.render('register', { title: 'Create your account', error: req.query.error }); }
function notFound(req, res) { res.status(404).render('error', { title: 'Page not found', message: 'The page you are looking for does not exist.' }); }

module.exports = { landingPage, loginPage, registerPage, notFound };
