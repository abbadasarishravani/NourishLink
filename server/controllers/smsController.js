const { startVerification, checkVerification } = require('../services/smsService');

const startSmsVerification = async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ message: 'phone is required' });
  try {
    const result = await startVerification(phone);
    res.json({ ok: true, ...result });
  } catch (e) {
    res.status(500).json({ message: e.message || 'SMS verification failed' });
  }
};

const verifySmsCode = async (req, res) => {
  const { phone, code } = req.body;
  if (!phone || !code) return res.status(400).json({ message: 'phone and code are required' });
  try {
    const result = await checkVerification(phone, String(code));
    res.json({ ok: true, ...result });
  } catch (e) {
    res.status(500).json({ message: e.message || 'Verification failed' });
  }
};

module.exports = { startSmsVerification, verifySmsCode };

