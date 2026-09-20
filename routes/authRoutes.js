const express = require('express');
const { login, register, logout } = require('../controllers/authController');
const { dbRequired } = require('../middleware/request');

const router = express.Router();
router.post('/login', dbRequired, login);
router.post('/register', dbRequired, register);
router.post('/logout', logout);

module.exports = router;
