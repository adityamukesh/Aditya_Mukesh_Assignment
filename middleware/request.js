const mongoose = require('mongoose');

function dbRequired(req, res, next) {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).render('error', {
            title: 'Database unavailable',
            message: 'Add your MongoDB Atlas connection string to .env and restart the app.'
        });
    }
    next();
}

function wantsJson(req) {
    return req.get('Accept')?.includes('application/json') || req.query.format === 'json';
}

module.exports = { dbRequired, wantsJson };
