const express = require('express');
const router = express.Router();
const { Dietitian } = require('../models/userModel');

// Get all verified dietitians
router.get('/dietitians', async (req, res) => {
  try {
    const dietitians = await Dietitian.find({
      'verificationStatus.finalReport': 'Verified',
      isDeleted: false
    }).select('-password -files -documents -verificationStatus'); // Exclude sensitive data

    // Convert profileImage buffers to base64 data URLs
    const dietitiansWithImages = dietitians.map(dietitian => {
      const dietitianObj = dietitian.toObject();
      if (dietitianObj.profileImage) {
        dietitianObj.photo = `data:image/jpeg;base64,${dietitianObj.profileImage.toString('base64')}`;
      } else {
        dietitianObj.photo = null;
      }
      delete dietitianObj.profileImage; // Remove the buffer field
      return dietitianObj;
    });

    res.json({
      success: true,
      data: dietitiansWithImages,
      count: dietitiansWithImages.length
    });
  } catch (error) {
    console.error('Error fetching dietitians:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dietitians'
    });
  }
});

// Get dietitian by ID
router.get('/dietitians/:id', async (req, res) => {
  try {
    const dietitian = await Dietitian.findOne({
      _id: req.params.id,
      'verificationStatus.finalReport': 'Verified',
      isDeleted: false
    }).select('-password -files -documents -verificationStatus');

    if (!dietitian) {
      return res.status(404).json({
        success: false,
        message: 'Dietitian not found'
      });
    }

    // Convert profileImage buffer to base64 data URL
    const dietitianObj = dietitian.toObject();
    if (dietitianObj.profileImage) {
      dietitianObj.photo = `data:image/jpeg;base64,${dietitianObj.profileImage.toString('base64')}`;
    } else {
      dietitianObj.photo = null;
    }
    delete dietitianObj.profileImage; // Remove the buffer field

    res.json({
      success: true,
      data: dietitianObj
    });
  } catch (error) {
    console.error('Error fetching dietitian:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dietitian'
    });
  }
});

// Update dietitian profile
router.post('/dietitians/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const dietitian = await Dietitian.findByIdAndUpdate(id, updateData, { new: true });

    if (!dietitian) {
      return res.status(404).json({
        success: false,
        message: 'Dietitian not found'
      });
    }

    res.json({
      success: true,
      data: dietitian,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Error updating dietitian:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating dietitian'
    });
  }
});

module.exports = router;