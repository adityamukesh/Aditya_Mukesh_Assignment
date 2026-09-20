const { wantsJson } = require('./request');

function requireAuth(req, res, next) {
    if (!req.session.user) {
        if (wantsJson(req)) return res.status(401).json({ error: 'Login required. Authenticate first and keep the connect.sid cookie.' });
        return res.redirect('/login?next=' + encodeURIComponent(req.originalUrl));
    }
    next();
}

function requireAdmin(req, res, next) {
    if (!req.session.user || req.session.user.role !== 'admin') {
        if (wantsJson(req)) return res.status(403).json({ error: 'Admin role required.', currentRole: req.session.user?.role || null });
        return res.status(403).render('error', {
            title: 'Access denied',
            message: 'This view is reserved for blood bank administrators.'
        });
    }
    next();
}

module.exports = { requireAuth, requireAdmin };
