const Patient = require('../models/Patient');

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private (Doctor or Admin)
const getPatients = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const patients = await Patient.find()
      .populate('userId', 'firstName lastName email phone')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Patient.countDocuments();

    res.status(200).json({
      success: true,
      data: patients,
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
      message: error.message || 'Error fetching patients',
    });
  }
};

// @desc    Get patient by ID
// @route   GET /api/patients/:id
// @access  Private (Patient themselves, Doctor, or Admin)
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate(
      'userId',
      'firstName lastName email phone'
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching patient',
    });
  }
};

// @desc    Update patient profile
// @route   PUT /api/patients/:id
// @access  Private (Patient themselves or Admin)
const updatePatientProfile = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Patient profile updated successfully',
      data: patient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating patient profile',
    });
  }
};

// @desc    Delete patient profile
// @route   DELETE /api/patients/:id
// @access  Private (Admin)
const deletePatientProfile = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Patient profile deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting patient profile',
    });
  }
};

// @desc    Get patient by user ID
// @route   GET /api/patients/user/:userId
// @access  Private
const getPatientByUserId = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.params.userId }).populate(
      'userId',
      'firstName lastName email phone'
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching patient',
    });
  }
};

module.exports = {
  getPatients,
  getPatientById,
  updatePatientProfile,
  deletePatientProfile,
  getPatientByUserId,
};
