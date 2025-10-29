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

// Create doctor profile validation rules
const createDoctorValidation = [
  body('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isMongoId()
    .withMessage('Invalid user ID'),
  body('specialization')
    .trim()
    .notEmpty()
    .withMessage('Specialization is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Specialization must be between 3 and 100 characters'),
  body('licenseNumber')
    .trim()
    .notEmpty()
    .withMessage('License number is required')
    .isLength({ min: 5, max: 50 })
    .withMessage('License number must be between 5 and 50 characters'),
  body('experience')
    .optional()
    .isInt({ min: 0, max: 70 })
    .withMessage('Experience must be between 0 and 70 years'),
  body('consultationFee')
    .notEmpty()
    .withMessage('Consultation fee is required')
    .isFloat({ min: 0 })
    .withMessage('Consultation fee must be a positive number'),
  body('qualifications')
    .optional()
    .isArray()
    .withMessage('Qualifications must be an array'),
  body('bio')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Bio must not exceed 1000 characters'),
  validate,
];

// Update doctor validation rules
const updateDoctorValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid doctor ID'),
  body('specialization')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Specialization must be between 3 and 100 characters'),
  body('experience')
    .optional()
    .isInt({ min: 0, max: 70 })
    .withMessage('Experience must be between 0 and 70 years'),
  body('consultationFee')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Consultation fee must be a positive number'),
  body('bio')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Bio must not exceed 1000 characters'),
  body('isAvailable')
    .optional()
    .isBoolean()
    .withMessage('isAvailable must be a boolean'),
  validate,
];

// Get doctors validation rules
const getDoctorsValidation = [
  query('specialization')
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage('Specialization must be at least 3 characters'),
  query('isAvailable')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('isAvailable must be true or false'),
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
  createDoctorValidation,
  updateDoctorValidation,
  getDoctorsValidation,
  idValidation,
};
