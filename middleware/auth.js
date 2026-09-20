function requireAuth(req, res, next) {
    if (!req.session.user) return res.redirect('/login?next=' + encodeURIComponent(req.originalUrl));
    next();
}

function requireAdmin(req, res, next) {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(403).render('error', {
            title: 'Access denied',
            message: 'This view is reserved for blood bank administrators.'
        });
    }
    next();
}

module.exports = { requireAuth, requireAdmin };
