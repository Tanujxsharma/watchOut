const { authenticator } = require('otplib');
const qrcode = require('qrcode');
const { firestore } = require('../config/firebase');
const createError = require('http-errors');

// Generate a secret and QR code for setup
async function setupTwoFactor(req, res, next) {
  try {
    const userRef = firestore.collection('users').doc(req.user.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw createError(404, 'User not found');
    }

    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(req.user.email, 'WatchOut Government Portal', secret);
    const imageUrl = await qrcode.toDataURL(otpauth);

    // Store secret temporarily or mark as pending setup
    // In a real app, you might encrypt this secret before storing
    await userRef.update({
      twoFactorSecret: secret,
      twoFactorEnabled: false // Not enabled until verified
    });

    res.json({
      secret,
      qrCode: imageUrl
    });
  } catch (error) {
    next(error);
  }
}

// Verify the token to enable 2FA
async function verifyTwoFactorSetup(req, res, next) {
  try {
    const { token } = req.body;
    const userRef = firestore.collection('users').doc(req.user.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw createError(404, 'User not found');
    }

    const { twoFactorSecret } = userDoc.data();

    if (!twoFactorSecret) {
      throw createError(400, '2FA setup not initiated');
    }

    const isValid = authenticator.check(token, twoFactorSecret);

    if (!isValid) {
      throw createError(400, 'Invalid token');
    }

    await userRef.update({
      twoFactorEnabled: true
    });

    res.json({ message: '2FA enabled successfully' });
  } catch (error) {
    next(error);
  }
}

// Disable 2FA
async function disableTwoFactor(req, res, next) {
  try {
    const { token } = req.body; // Require token to disable for security
    const userRef = firestore.collection('users').doc(req.user.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw createError(404, 'User not found');
    }

    const { twoFactorSecret, twoFactorEnabled } = userDoc.data();

    if (!twoFactorEnabled) {
      return res.json({ message: '2FA is already disabled' });
    }

    const isValid = authenticator.check(token, twoFactorSecret);

    if (!isValid) {
      throw createError(400, 'Invalid token');
    }

    await userRef.update({
      twoFactorEnabled: false,
      twoFactorSecret: null
    });

    res.json({ message: '2FA disabled successfully' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  setupTwoFactor,
  verifyTwoFactorSetup,
  disableTwoFactor
};
