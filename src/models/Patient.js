const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  dateOfBirth: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  },
  allergies: [{
    type: String,
  }],
  medicalHistory: [{
    condition: String,
    diagnosedDate: Date,
    notes: String,
  }],
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String,
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
  },
  insuranceInfo: {
    provider: String,
    policyNumber: String,
    expiryDate: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
