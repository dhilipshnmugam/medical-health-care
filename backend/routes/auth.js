const express = require('express');
const router = express.Router();
const { register, login, getUser } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

// @route POST /api/auth/register
router.post('/register', register);

// @route POST /api/auth/login
router.post('/login', login);

// @route GET /api/auth/user - Get current user
router.get('/user', verifyToken, getUser);

module.exports = router;
