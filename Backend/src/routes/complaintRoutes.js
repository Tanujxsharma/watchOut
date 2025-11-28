const express = require('express');
const router = express.Router();
const {
  submitComplaint,
  getComplaintsByTender,
  getUserComplaints,
  updateComplaintStatus
} = require('../controllers/complaintController');
const { verifyToken } = require('../controllers/authController');
const { authenticateGovernment } = require('../middlewares/governmentAuth');

// User routes
router.post('/', verifyToken, submitComplaint);
router.get('/my-complaints', verifyToken, getUserComplaints);

// Government routes
router.get('/tender/:tenderId', authenticateGovernment, getComplaintsByTender);
router.put('/:id/resolve', authenticateGovernment, updateComplaintStatus);

module.exports = router;
