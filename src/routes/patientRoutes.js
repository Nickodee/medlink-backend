const express = require('express');
const router = express.Router();
const {
  getPatients,
  getPatientById,
  updatePatientProfile,
  deletePatientProfile,
  getPatientByUserId,
} = require('../controllers/patientController');
const { protect, authorize } = require('../middleware/auth');
const {
  updatePatientValidation,
  getPatientsValidation,
  idValidation,
} = require('../validators/patientValidator');

router.get('/', protect, authorize('admin', 'doctor'), getPatientsValidation, getPatients);
router.get('/user/:userId', protect, idValidation, getPatientByUserId);
router.get('/:id', protect, idValidation, getPatientById);
router.put('/:id', protect, updatePatientValidation, updatePatientProfile);
router.delete('/:id', protect, authorize('admin'), idValidation, deletePatientProfile);

module.exports = router;
