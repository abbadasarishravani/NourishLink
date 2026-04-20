const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const {
    getMe,
    getLeaderboard,
    updateUserProfile,
    redeemPoints
} = require('../controllers/userController');

// Get logged-in user
router.get('/me', protect, getMe);

// Leaderboard
router.get('/leaderboard', getLeaderboard);

// Update profile
router.put('/update', protect, updateUserProfile);
router.post('/redeem', protect, redeemPoints);

module.exports = router;
