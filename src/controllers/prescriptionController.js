const Prescription = require('../models/Prescription');

// @desc    Create prescription
// @route   POST /api/prescriptions
// @access  Private (Doctor)
const createPrescription = async (req, res) => {
  try {
    const {
      patientId,
      doctorId,
      appointmentId,
      medications,
      diagnosis,
      notes,
      expiryDate,
    } = req.body;

    const prescription = await Prescription.create({
      patientId,
      doctorId,
      appointmentId,
      medications,
      diagnosis,
      notes,
      expiryDate,
    });

    res.status(201).json({
      success: true,
      message: 'Prescription created successfully',
      data: prescription,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating prescription',
    });
  }
};

// @desc    Get all prescriptions
// @route   GET /api/prescriptions
// @access  Private
const getPrescriptions = async (req, res) => {
  try {
    const { patientId, doctorId, status, page = 1, limit = 10 } = req.query;

    const query = {};
    if (patientId) query.patientId = patientId;
    if (doctorId) query.doctorId = doctorId;
    if (status) query.status = status;

    const prescriptions = await Prescription.find(query)
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'firstName lastName phone' },
      })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'firstName lastName phone' },
      })
      .populate('appointmentId')
      .populate('pharmacyId')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ issuedDate: -1 });

    const count = await Prescription.countDocuments(query);

    res.status(200).json({
      success: true,
      data: prescriptions,
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
      message: error.message || 'Error fetching prescriptions',
    });
  }
};

// @desc    Get prescription by ID
// @route   GET /api/prescriptions/:id
// @access  Private
const getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'firstName lastName phone email' },
      })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'firstName lastName phone email' },
      })
      .populate('appointmentId')
      .populate('pharmacyId');

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found',
      });
    }

    res.status(200).json({
      success: true,
      data: prescription,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching prescription',
    });
  }
};

// @desc    Update prescription
// @route   PUT /api/prescriptions/:id
// @access  Private (Doctor)
const updatePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Prescription updated successfully',
      data: prescription,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating prescription',
    });
  }
};

// @desc    Mark prescription as fulfilled
// @route   PUT /api/prescriptions/:id/fulfill
// @access  Private (Pharmacy)
const fulfillPrescription = async (req, res) => {
  try {
    const { pharmacyId } = req.body;

    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found',
      });
    }

    prescription.isFulfilled = true;
    prescription.pharmacyId = pharmacyId;
    prescription.status = 'completed';
    await prescription.save();

    res.status(200).json({
      success: true,
      message: 'Prescription marked as fulfilled',
      data: prescription,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fulfilling prescription',
    });
  }
};

// @desc    Delete prescription
// @route   DELETE /api/prescriptions/:id
// @access  Private (Doctor or Admin)
const deletePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndDelete(req.params.id);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Prescription deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting prescription',
    });
  }
};

module.exports = {
  createPrescription,
  getPrescriptions,
  getPrescriptionById,
  updatePrescription,
  fulfillPrescription,
  deletePrescription,
};
