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

// Update patient validation rules
const updatePatientValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid patient ID'),
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format')
    .custom((value) => {
      const dob = new Date(value);
      const today = new Date();
      if (dob >= today) {
        throw new Error('Date of birth must be in the past');
      }
      return true;
    }),
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),
  body('bloodGroup')
    .optional()
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .withMessage('Invalid blood group'),
  body('allergies')
    .optional()
    .isArray()
    .withMessage('Allergies must be an array'),
  body('medicalHistory')
    .optional()
    .isArray()
    .withMessage('Medical history must be an array'),
  body('emergencyContact.phone')
    .optional()
    .matches(/^\+[1-9]\d{1,14}$/)
    .withMessage('Emergency contact phone must be in E.164 format'),
  validate,
];

// Get patients validation rules
const getPatientsValidation = [
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
  updatePatientValidation,
  getPatientsValidation,
  idValidation,
};
