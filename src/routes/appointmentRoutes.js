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
const {
  createAppointmentValidation,
  updateAppointmentValidation,
  getAppointmentsValidation,
  idValidation,
} = require('../validators/appointmentValidator');

router.post('/', protect, createAppointmentValidation, createAppointment);
router.get('/', protect, getAppointmentsValidation, getAppointments);
router.get('/:id', protect, idValidation, getAppointmentById);
router.put('/:id', protect, updateAppointmentValidation, updateAppointment);
router.put('/:id/cancel', protect, idValidation, cancelAppointment);
router.delete('/:id', protect, authorize('admin'), idValidation, deleteAppointment);

module.exports = router;
