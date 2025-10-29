const express = require('express');
const router = express.Router();
const {
  register,
  verifyOTPController,
  login,
  resendOTP,
  getMe,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const {
  registerValidation,
  verifyOTPValidation,
  loginValidation,
  resendOTPValidation,
} = require('../validators/authValidator');

router.post('/register', registerValidation, register);
router.post('/verify-otp', verifyOTPValidation, verifyOTPController);
router.post('/login', loginValidation, login);
router.post('/resend-otp', resendOTPValidation, resendOTP);
router.get('/me', protect, getMe);

module.exports = router;
