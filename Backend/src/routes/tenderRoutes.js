const express = require('express');
const router = express.Router();
const {
  createTender,
  getAllTenders,
  getTenderById,
  updateTender,
  deleteTender
} = require('../controllers/tenderController');
const { authenticateGovernment } = require('../middlewares/governmentAuth');

// Public routes
router.get('/', getAllTenders);
router.get('/:id', getTenderById);

// Protected government routes
router.post('/', authenticateGovernment, createTender);
router.put('/:id', authenticateGovernment, updateTender);
router.delete('/:id', authenticateGovernment, deleteTender);

module.exports = router;
