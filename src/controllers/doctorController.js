const Doctor = require('../models/Doctor');
const User = require('../models/User');

// @desc    Create doctor profile
// @route   POST /api/doctors
// @access  Private (Admin or Doctor)
const createDoctorProfile = async (req, res) => {
  try {
    const {
      userId,
      specialization,
      licenseNumber,
      qualifications,
      experience,
      consultationFee,
      availableHours,
      bio,
    } = req.body;

    // Check if doctor profile already exists
    const existingDoctor = await Doctor.findOne({ userId });
    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: 'Doctor profile already exists',
      });
    }

    // Create doctor profile
    const doctor = await Doctor.create({
      userId,
      specialization,
      licenseNumber,
      qualifications,
      experience,
      consultationFee,
      availableHours,
      bio,
    });

    // Update user role to doctor
    await User.findByIdAndUpdate(userId, { role: 'doctor' });

    res.status(201).json({
      success: true,
      message: 'Doctor profile created successfully',
      data: doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating doctor profile',
    });
  }
};

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
const getDoctors = async (req, res) => {
  try {
    const { specialization, isAvailable, page = 1, limit = 10 } = req.query;

    const query = {};
    if (specialization) query.specialization = specialization;
    if (isAvailable !== undefined) query.isAvailable = isAvailable === 'true';

    const doctors = await Doctor.find(query)
      .populate('userId', 'firstName lastName email phone')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ rating: -1 });

    const count = await Doctor.countDocuments(query);

    res.status(200).json({
      success: true,
      data: doctors,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching doctors',
    });
  }
};

// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate(
      'userId',
      'firstName lastName email phone'
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching doctor',
    });
  }
};

// @desc    Update doctor profile
// @route   PUT /api/doctors/:id
// @access  Private (Doctor or Admin)
const updateDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Doctor profile updated successfully',
      data: doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating doctor profile',
    });
  }
};

// @desc    Delete doctor profile
// @route   DELETE /api/doctors/:id
// @access  Private (Admin)
const deleteDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Doctor profile deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting doctor profile',
    });
  }
};

module.exports = {
  createDoctorProfile,
  getDoctors,
  getDoctorById,
  updateDoctorProfile,
  deleteDoctorProfile,
};
