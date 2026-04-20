const express = require('express');
const router = express.Router();
const { startSmsVerification, verifySmsCode } = require('../controllers/smsController');

router.post('/start', startSmsVerification);
router.post('/verify', verifySmsCode);

module.exports = router;

