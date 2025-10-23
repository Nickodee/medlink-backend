const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  cancelAppointment,
  deleteAppointment,
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, createAppointment);
router.get('/', protect, getAppointments);
router.get('/:id', protect, getAppointmentById);
router.put('/:id', protect, updateAppointment);
router.put('/:id/cancel', protect, cancelAppointment);
router.delete('/:id', protect, authorize('admin'), deleteAppointment);

module.exports = router;
