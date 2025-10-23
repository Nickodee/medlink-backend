const express = require('express');
const router = express.Router();
const {
  createPrescription,
  getPrescriptions,
  getPrescriptionById,
  updatePrescription,
  fulfillPrescription,
  deletePrescription,
} = require('../controllers/prescriptionController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('doctor'), createPrescription);
router.get('/', protect, getPrescriptions);
router.get('/:id', protect, getPrescriptionById);
router.put('/:id', protect, authorize('doctor'), updatePrescription);
router.put('/:id/fulfill', protect, fulfillPrescription);
router.delete('/:id', protect, authorize('doctor', 'admin'), deletePrescription);

module.exports = router;
