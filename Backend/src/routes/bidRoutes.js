const express = require('express');
const router = express.Router();
const {
  submitBid,
  getBidsByTender,
  getCompanyBids,
  updateBidStatus
} = require('../controllers/bidController');
const { verifyToken } = require('../controllers/authController');
const { authenticateGovernment } = require('../middlewares/governmentAuth');

// Company routes
router.post('/', verifyToken, submitBid);
router.get('/my-bids', verifyToken, getCompanyBids);

// Government routes
router.get('/tender/:tenderId', authenticateGovernment, getBidsByTender);
router.put('/:id/status', authenticateGovernment, updateBidStatus);

module.exports = router;
