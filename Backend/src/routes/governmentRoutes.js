const router = require('express').Router();
const { authenticateGovernment } = require('../middlewares/governmentAuth');
const {
  getPendingCompanies,
  getCompanyById,
  approveCompany,
  rejectCompany,
  getAnalytics,
  getCompaniesByStatus
} = require('../controllers/governmentController');

router.use(authenticateGovernment);

router.get('/pending-companies', getPendingCompanies);
router.get('/company/:id', getCompanyById);
router.put('/approve/:id', approveCompany);
router.put('/reject/:id', rejectCompany);
router.get('/analytics', getAnalytics);
router.get('/status/:status', getCompaniesByStatus);

module.exports = router;

