const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { dbRequired } = require('../middleware/request');
const { dashboard, search, requestPage, createRequest } = require('../controllers/donorController');

const router = express.Router();
router.get('/dashboard', requireAuth, dbRequired, dashboard);
router.get('/search', requireAuth, dbRequired, search);
router.get('/request', requireAuth, requestPage);
router.post('/request', requireAuth, dbRequired, createRequest);

module.exports = router;
