const router = require('express').Router();
const {
  signup,
  login,
  googleLogin,
  governmentLogin,
  verifyToken
} = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.post('/government-login', governmentLogin);
router.get('/verify-token', verifyToken);

module.exports = router;

