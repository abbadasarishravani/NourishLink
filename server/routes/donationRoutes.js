const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    createDonation,
    getDonations,
    updateDonationStatus,
    getAnalytics,
    getMyDonations,
    getNgoDonations
} = require('../controllers/donationController');

// ✅ Specific routes MUST come BEFORE generic routes
router.route('/analytics')
    .get(protect, getAnalytics);

router.get('/my', protect, getMyDonations);
router.get('/ngo', protect, getNgoDonations);

// ✅ Generic routes come AFTER specific ones
router.route('/')
    .post(protect, createDonation)
    .get(protect, getDonations);

router.route('/status/:id')
    .put(protect, updateDonationStatus);

router.route('/:id')
    .put(protect, updateDonationStatus);

module.exports = router;
