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

router.get('/', protect, authorize('admin', 'doctor'), getPatients);
router.get('/user/:userId', protect, getPatientByUserId);
router.get('/:id', protect, getPatientById);
router.put('/:id', protect, updatePatientProfile);
router.delete('/:id', protect, authorize('admin'), deletePatientProfile);

module.exports = router;
