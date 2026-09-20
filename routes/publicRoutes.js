const express = require('express');
const { landingPage, loginPage, registerPage, notFound } = require('../controllers/publicController');

const router = express.Router();
router.get('/', landingPage);
router.get('/login', loginPage);
router.get('/register', registerPage);
router.use(notFound);

module.exports = router;
