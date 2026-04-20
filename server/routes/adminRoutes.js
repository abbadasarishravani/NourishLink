const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/authMiddleware');
const { listPendingNgos, approveNgo, rejectNgo, listUsers, listDonations } = require('../controllers/adminController');

router.use(protect, requireRole('Admin'));

router.get('/ngos/pending', listPendingNgos);
router.post('/ngos/:id/approve', approveNgo);
router.post('/ngos/:id/reject', rejectNgo);

router.get('/users', listUsers);
router.get('/donations', listDonations);

module.exports = router;

