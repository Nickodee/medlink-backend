const express = require('express');
const router = express.Router();
const {
  createDoctorProfile,
  getDoctors,
  getDoctorById,
  updateDoctorProfile,
  deleteDoctorProfile,
} = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/auth');
const {
  createDoctorValidation,
  updateDoctorValidation,
  getDoctorsValidation,
  idValidation,
} = require('../validators/doctorValidator');

router.post('/', protect, authorize('admin', 'doctor'), createDoctorValidation, createDoctorProfile);
router.get('/', getDoctorsValidation, getDoctors);
router.get('/:id', idValidation, getDoctorById);
router.put('/:id', protect, authorize('admin', 'doctor'), updateDoctorValidation, updateDoctorProfile);
router.delete('/:id', protect, authorize('admin'), idValidation, deleteDoctorProfile);

module.exports = router;
