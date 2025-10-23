const express = require('express');
const router = express.Router();
const {
  createPharmacy,
  getPharmacies,
  getPharmacyById,
  updatePharmacy,
  deletePharmacy,
  getNearbyPharmacies,
} = require('../controllers/pharmacyController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('admin'), createPharmacy);
router.get('/', getPharmacies);
router.get('/nearby', getNearbyPharmacies);
router.get('/:id', getPharmacyById);
router.put('/:id', protect, authorize('admin'), updatePharmacy);
router.delete('/:id', protect, authorize('admin'), deletePharmacy);

module.exports = router;
