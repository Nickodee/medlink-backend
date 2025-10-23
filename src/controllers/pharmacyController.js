const Pharmacy = require('../models/Pharmacy');

// @desc    Create pharmacy
// @route   POST /api/pharmacies
// @access  Private (Admin)
const createPharmacy = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Pharmacy created successfully',
      data: pharmacy,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating pharmacy',
    });
  }
};

// @desc    Get all pharmacies
// @route   GET /api/pharmacies
// @access  Public
const getPharmacies = async (req, res) => {
  try {
    const { city, isActive, page = 1, limit = 10 } = req.query;

    const query = {};
    if (city) query['address.city'] = new RegExp(city, 'i');
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const pharmacies = await Pharmacy.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ rating: -1 });

    const count = await Pharmacy.countDocuments(query);

    res.status(200).json({
      success: true,
      data: pharmacies,
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
      message: error.message || 'Error fetching pharmacies',
    });
  }
};

// @desc    Get pharmacy by ID
// @route   GET /api/pharmacies/:id
// @access  Public
const getPharmacyById = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.id);

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: 'Pharmacy not found',
      });
    }

    res.status(200).json({
      success: true,
      data: pharmacy,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching pharmacy',
    });
  }
};

// @desc    Update pharmacy
// @route   PUT /api/pharmacies/:id
// @access  Private (Pharmacy owner or Admin)
const updatePharmacy = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: 'Pharmacy not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Pharmacy updated successfully',
      data: pharmacy,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating pharmacy',
    });
  }
};

// @desc    Delete pharmacy
// @route   DELETE /api/pharmacies/:id
// @access  Private (Admin)
const deletePharmacy = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findByIdAndDelete(req.params.id);

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: 'Pharmacy not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Pharmacy deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting pharmacy',
    });
  }
};

// @desc    Get nearby pharmacies
// @route   GET /api/pharmacies/nearby
// @access  Public
const getNearbyPharmacies = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 10000 } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: 'Please provide longitude and latitude',
      });
    }

    const pharmacies = await Pharmacy.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: parseInt(maxDistance),
        },
      },
      isActive: true,
    });

    res.status(200).json({
      success: true,
      data: pharmacies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching nearby pharmacies',
    });
  }
};

module.exports = {
  createPharmacy,
  getPharmacies,
  getPharmacyById,
  updatePharmacy,
  deletePharmacy,
  getNearbyPharmacies,
};
