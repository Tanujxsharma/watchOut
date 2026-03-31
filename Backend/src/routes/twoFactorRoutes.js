const express = require('express');
const router = express.Router();
const { setupTwoFactor, verifyTwoFactorSetup, disableTwoFactor } = require('../controllers/twoFactorController');
const { verifyToken } = require('../controllers/authController');

router.post('/setup', verifyToken, setupTwoFactor);
router.post('/verify', verifyToken, verifyTwoFactorSetup);
router.post('/disable', verifyToken, disableTwoFactor);

module.exports = router;
