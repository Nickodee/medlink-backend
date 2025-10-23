const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
  },
  medications: [{
    name: {
      type: String,
      required: true,
    },
    dosage: {
      type: String,
      required: true,
    },
    frequency: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    instructions: String,
  }],
  diagnosis: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
  issuedDate: {
    type: Date,
    default: Date.now,
  },
  expiryDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active',
  },
  isFulfilled: {
    type: Boolean,
    default: false,
  },
  pharmacyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pharmacy',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);

module.exports = Prescription;
