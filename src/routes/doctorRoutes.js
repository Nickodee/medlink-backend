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

router.post('/', protect, authorize('admin', 'doctor'), createDoctorProfile);
router.get('/', getDoctors);
router.get('/:id', getDoctorById);
router.put('/:id', protect, authorize('admin', 'doctor'), updateDoctorProfile);
router.delete('/:id', protect, authorize('admin'), deleteDoctorProfile);

module.exports = router;
