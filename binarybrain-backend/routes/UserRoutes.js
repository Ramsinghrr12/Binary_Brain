// routes/userRoutes.js
const express = require('express');
const { registerUser, loginUser, getUserProfile, getUserStats, addAdminUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

console.log('✅ User Routes Loaded');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.get('/stats/:id', getUserStats);
router.post('/add-admin', protect, addAdminUser);

module.exports = router;