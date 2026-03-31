const router = require('express').Router();
const { authenticateUser, requireRole } = require('../middlewares/auth');
const {
  registerCompany,
  getCompanyProfile
} = require('../controllers/companyController');

router.post('/register', authenticateUser, requireRole('company'), registerCompany);
router.get('/profile', authenticateUser, requireRole('company'), getCompanyProfile);

module.exports = router;

