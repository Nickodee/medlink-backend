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
const {
  createPharmacyValidation,
  updatePharmacyValidation,
  getNearbyPharmaciesValidation,
  getPharmaciesValidation,
  idValidation,
} = require('../validators/pharmacyValidator');

router.post('/', protect, authorize('admin'), createPharmacyValidation, createPharmacy);
router.get('/', getPharmaciesValidation, getPharmacies);
router.get('/nearby', getNearbyPharmaciesValidation, getNearbyPharmacies);
router.get('/:id', idValidation, getPharmacyById);
router.put('/:id', protect, authorize('admin'), updatePharmacyValidation, updatePharmacy);
router.delete('/:id', protect, authorize('admin'), idValidation, deletePharmacy);

module.exports = router;
