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
const {
  createPrescriptionValidation,
  updatePrescriptionValidation,
  fulfillPrescriptionValidation,
  getPrescriptionsValidation,
  idValidation,
} = require('../validators/prescriptionValidator');

router.post('/', protect, authorize('doctor'), createPrescriptionValidation, createPrescription);
router.get('/', protect, getPrescriptionsValidation, getPrescriptions);
router.get('/:id', protect, idValidation, getPrescriptionById);
router.put('/:id', protect, authorize('doctor'), updatePrescriptionValidation, updatePrescription);
router.put('/:id/fulfill', protect, fulfillPrescriptionValidation, fulfillPrescription);
router.delete('/:id', protect, authorize('doctor', 'admin'), idValidation, deletePrescription);

module.exports = router;
