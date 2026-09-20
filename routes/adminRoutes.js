const express = require('express');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { dbRequired } = require('../middleware/request');
const { overview, assignParcel, createAgent, createZone, updateParcelStatus } = require('../controllers/adminController');

const router = express.Router();
const adminOnly = [requireAuth, requireAdmin, dbRequired];

router.get('/', ...adminOnly, overview);
router.post('/parcels/:id/assign', ...adminOnly, assignParcel);
router.post('/parcels/:id/status', ...adminOnly, updateParcelStatus);
router.post('/agents', ...adminOnly, createAgent);
router.post('/zones', ...adminOnly, createZone);

module.exports = router;
