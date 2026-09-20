const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { dbRequired } = require('../middleware/request');
const { dashboard, updateStatus } = require('../controllers/agentController');

const router = express.Router();
function requireAgent(req, res, next) {
    if (!req.session.user || req.session.user.role !== 'agent') {
        if (req.query.format === 'json' || req.get('Accept')?.includes('application/json')) return res.status(403).json({ error: 'Agent role required.', currentRole: req.session.user?.role || null });
        return res.status(403).render('error', { title: 'Agent access required', message: 'This view is reserved for delivery agents.' });
    }
    next();
}

router.get('/agent', requireAuth, requireAgent, dbRequired, dashboard);
router.post('/agent/parcels/:id/status', requireAuth, requireAgent, dbRequired, updateStatus);

module.exports = router;