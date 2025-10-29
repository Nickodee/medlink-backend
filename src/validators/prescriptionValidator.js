const { body, param, query, validationResult } = require('express-validator');

// Middleware to handle validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

// Create prescription validation rules
const createPrescriptionValidation = [
  body('patientId')
    .notEmpty()
    .withMessage('Patient ID is required')
    .isMongoId()
    .withMessage('Invalid patient ID'),
  body('doctorId')
    .notEmpty()
    .withMessage('Doctor ID is required')
    .isMongoId()
    .withMessage('Invalid doctor ID'),
  body('appointmentId')
    .optional()
    .isMongoId()
    .withMessage('Invalid appointment ID'),
  body('medications')
    .isArray({ min: 1 })
    .withMessage('At least one medication is required'),
  body('medications.*.name')
    .notEmpty()
    .withMessage('Medication name is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Medication name must be between 2 and 200 characters'),
  body('medications.*.dosage')
    .notEmpty()
    .withMessage('Dosage is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Dosage must be between 2 and 100 characters'),
  body('medications.*.frequency')
    .notEmpty()
    .withMessage('Frequency is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Frequency must be between 2 and 100 characters'),
  body('medications.*.duration')
    .notEmpty()
    .withMessage('Duration is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Duration must be between 2 and 100 characters'),
  body('diagnosis')
    .notEmpty()
    .withMessage('Diagnosis is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Diagnosis must be between 10 and 1000 characters'),
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notes must not exceed 1000 characters'),
  validate,
];

// Update prescription validation rules
const updatePrescriptionValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid prescription ID'),
  body('status')
    .optional()
    .isIn(['active', 'completed', 'cancelled'])
    .withMessage('Status must be active, completed, or cancelled'),
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notes must not exceed 1000 characters'),
  validate,
];

// Fulfill prescription validation rules
const fulfillPrescriptionValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid prescription ID'),
  body('pharmacyId')
    .notEmpty()
    .withMessage('Pharmacy ID is required')
    .isMongoId()
    .withMessage('Invalid pharmacy ID'),
  validate,
];

// Get prescriptions validation rules
const getPrescriptionsValidation = [
  query('patientId')
    .optional()
    .isMongoId()
    .withMessage('Invalid patient ID'),
  query('doctorId')
    .optional()
    .isMongoId()
    .withMessage('Invalid doctor ID'),
  query('status')
    .optional()
    .isIn(['active', 'completed', 'cancelled'])
    .withMessage('Invalid status value'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  validate,
];

// ID parameter validation
const idValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
  validate,
];

module.exports = {
  createPrescriptionValidation,
  updatePrescriptionValidation,
  fulfillPrescriptionValidation,
  getPrescriptionsValidation,
  idValidation,
};
