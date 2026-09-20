const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { dbRequired } = require('../middleware/request');
const { dashboard, bookingPage, bookParcel, trackParcel } = require('../controllers/customerController');

const router = express.Router();
router.get('/dashboard', requireAuth, dbRequired, dashboard);
router.get('/parcels/book', requireAuth, bookingPage);
router.post('/parcels', requireAuth, dbRequired, bookParcel);
router.get('/track', dbRequired, trackParcel);
router.get('/track/:trackingId', dbRequired, trackParcel);

module.exports = router;