const express = require('express');
const router = express.Router();
const { register, login ,getMe } = require('../controllers/authController');
const auth = require('../middleware/auth');

// signIn
router.post('/register', register);
// Login
router.post('/login', login);
//me
router.get('/me', auth, getMe);
module.exports = router;