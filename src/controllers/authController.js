const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const { generateToken } = require('../utils/jwt');
const { generateOTP, sendOTP, verifyOTP } = require('../services/otpService');

/**
 * @desc    Register a new user (patient or doctor)
 * @route   POST /api/auth/register
 * @access  Public
 * @param   {Object} req.body - User registration data
 * @param   {string} req.body.phone - User's phone number in E.164 format
 * @param   {string} req.body.email - User's email address (optional)
 * @param   {string} req.body.firstName - User's first name
 * @param   {string} req.body.lastName - User's last name
 * @param   {string} req.body.password - User's password (min 8 characters)
 * @param   {string} req.body.role - User role: 'patient' | 'doctor' | 'admin' (default: 'patient')
 * @returns {Object} Success response with user ID and OTP (in development mode)
 */
const register = async (req, res) => {
  try {
    const { phone, email, firstName, lastName, role, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this phone number already exists',
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user
    const user = await User.create({
      phone,
      email,
      firstName,
      lastName,
      role: role || 'patient',
      password,
      otp,
      otpExpires,
    });

    // Create role-specific profile
    if (role === 'patient') {
      await Patient.create({ userId: user._id });
    }

    // Send OTP
    const otpResult = await sendOTP(phone, otp);

    res.status(201).json({
      success: true,
      message: 'User registered successfully. OTP sent to phone.',
      data: {
        userId: user._id,
        phone: user.phone,
        role: user.role,
      },
      ...(process.env.NODE_ENV === 'development' && { otp: otpResult.otp }),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error registering user',
    });
  }
};

/**
 * @desc    Verify OTP sent to user's phone
 * @route   POST /api/auth/verify-otp
 * @access  Public
 * @param   {Object} req.body - OTP verification data
 * @param   {string} req.body.phone - User's phone number
 * @param   {string} req.body.otp - 6-digit OTP code
 * @returns {Object} Success response with JWT token and user data
 */
const verifyOTPController = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const user = await User.findOne({ phone }).select('+otp +otpExpires');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const verification = verifyOTP(otp, user.otp, user.otpExpires);

    if (!verification.valid) {
      return res.status(400).json({
        success: false,
        message: verification.message,
      });
    }

    // Mark phone as verified
    user.isPhoneVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Phone verified successfully',
      data: {
        token,
        user: {
          id: user._id,
          phone: user.phone,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error verifying OTP',
    });
  }
};

/**
 * @desc    Login user with phone and password
 * @route   POST /api/auth/login
 * @access  Public
 * @param   {Object} req.body - Login credentials
 * @param   {string} req.body.phone - User's phone number
 * @param   {string} req.body.password - User's password
 * @returns {Object} Success response with JWT token and user data
 */
const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ phone }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if phone is verified
    if (!user.isPhoneVerified) {
      return res.status(401).json({
        success: false,
        message: 'Phone not verified. Please verify your phone number.',
      });
    }

    // Generate JWT token
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          phone: user.phone,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error logging in',
    });
  }
};

/**
 * @desc    Resend OTP to user's phone
 * @route   POST /api/auth/resend-otp
 * @access  Public
 * @param   {Object} req.body - Resend OTP data
 * @param   {string} req.body.phone - User's phone number
 * @returns {Object} Success response with new OTP (in development mode)
 */
const resendOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    const user = await User.findOne({ phone });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.isPhoneVerified) {
      return res.status(400).json({
        success: false,
        message: 'Phone already verified',
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send OTP
    const otpResult = await sendOTP(phone, otp);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      ...(process.env.NODE_ENV === 'development' && { otp: otpResult.otp }),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error resending OTP',
    });
  }
};

/**
 * @desc    Get currently authenticated user
 * @route   GET /api/auth/me
 * @access  Private (requires authentication)
 * @returns {Object} Success response with current user data
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching user',
    });
  }
};

module.exports = {
  register,
  verifyOTPController,
  login,
  resendOTP,
  getMe,
};
