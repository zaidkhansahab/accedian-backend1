const express = require('express');
const { register, login, createReferral } = require('../controllers/authController');

const router = express.Router();

// Auth Routes
router.post('/register', register);
router.post('/login', login);

// Referral Route
router.post('/referrals', createReferral);

module.exports = router;
