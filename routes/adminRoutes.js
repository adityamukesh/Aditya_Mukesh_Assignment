const express = require('express');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { dbRequired } = require('../middleware/request');
const { overview, saveInventory, updateInventory, updateRequestStatus, donors } = require('../controllers/adminController');

const router = express.Router();
const adminOnly = [requireAuth, requireAdmin, dbRequired];

router.get('/', ...adminOnly, overview);
router.get('/donors', ...adminOnly, donors);
router.post('/inventory', ...adminOnly, saveInventory);
router.post('/inventory/:id', ...adminOnly, updateInventory);
router.post('/requests/:id/status', ...adminOnly, updateRequestStatus);

module.exports = router;
