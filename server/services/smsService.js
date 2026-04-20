const crypto = require('node:crypto');

const memoryOtps = new Map(); // phone -> { code, expiresAt }

function hasTwilioVerifyEnv() {
  return Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_VERIFY_SERVICE_SID);
}

async function startVerification(phone) {
  if (hasTwilioVerifyEnv()) {
    let twilio;
    try {
      twilio = require('twilio');
    } catch {
      throw new Error('Twilio SDK not installed. Run: npm i twilio');
    }
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    await client.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID).verifications.create({ to: phone, channel: 'sms' });
    return { mode: 'twilio' };
  }

  // Dev fallback (no SMS sent): returns a code so you can test flows.
  const code = String(crypto.randomInt(100000, 999999));
  memoryOtps.set(phone, { code, expiresAt: Date.now() + 5 * 60 * 1000 });
  return { mode: 'dev', code };
}

async function checkVerification(phone, code) {
  if (hasTwilioVerifyEnv()) {
    let twilio;
    try {
      twilio = require('twilio');
    } catch {
      throw new Error('Twilio SDK not installed. Run: npm i twilio');
    }
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    const res = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({ to: phone, code });
    return { mode: 'twilio', valid: res.status === 'approved' };
  }

  const rec = memoryOtps.get(phone);
  if (!rec) return { mode: 'dev', valid: false };
  if (Date.now() > rec.expiresAt) {
    memoryOtps.delete(phone);
    return { mode: 'dev', valid: false };
  }
  const valid = rec.code === code;
  if (valid) memoryOtps.delete(phone);
  return { mode: 'dev', valid };
}

module.exports = { startVerification, checkVerification };

