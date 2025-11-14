const express = require('express');
const router = express.Router();
const { Dietitian } = require('../models/userModel');
const Booking = require('../models/bookingModel');

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

// Get dietitian profile by ID (for editing - includes all fields)
router.get('/dietitians/profile/:id', async (req, res) => {
  try {
    const dietitian = await Dietitian.findOne({
      _id: req.params.id,
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
    console.error('Error fetching dietitian profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dietitian profile'
    });
  }
});

// Get clients for a dietitian
router.get('/dietitians/:id/clients', async (req, res) => {
  try {
    const { id } = req.params;

    // Get all bookings for this dietitian
    const bookings = await Booking.find({ dietitianId: id }).sort({ createdAt: -1 });

    // Group by userId to get unique clients with aggregated data
    const clientMap = new Map();

    bookings.forEach(booking => {
      const clientId = booking.userId.toString();
      const bookingDateTime = new Date(`${booking.date}T${booking.time}`);
      const now = new Date();
      const hoursSinceAppointment = (now - bookingDateTime) / (1000 * 60 * 60);
      const isRelevant = bookingDateTime > now || (hoursSinceAppointment < 24 && booking.status !== 'completed');

      if (clientMap.has(clientId)) {
        const existing = clientMap.get(clientId);
        existing.totalSessions += 1;
        
        // Update next appointment if this booking is in the future and earlier
        if (bookingDateTime > now && (!existing.nextAppointment || bookingDateTime < new Date(existing.nextAppointment))) {
          existing.nextAppointment = `${booking.date} ${booking.time}`;
        }
        
        // Update last consultation if this is more recent
        if (new Date(booking.date) > new Date(existing.lastConsultation)) {
          existing.lastConsultation = booking.date;
        }
      } else {
        const isUpcoming = bookingDateTime > now;
        
        clientMap.set(clientId, {
          id: clientId,
          name: booking.username,
          email: booking.email,
          phone: booking.userPhone || 'N/A',
          age: 'N/A', // Not available in booking
          location: booking.userAddress || 'N/A',
          consultationType: booking.consultationType || 'General Consultation',
          nextAppointment: isUpcoming ? `${booking.date} ${booking.time}` : null,
          status: booking.status === 'confirmed' ? 'Active' : booking.status === 'cancelled' ? 'Completed' : 'Pending',
          profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(booking.username)}&background=28B463&color=fff&size=128`,
          lastConsultation: booking.date,
          totalSessions: 1,
          goals: [booking.dietitianSpecialization || 'General Health']
        });
      }
    });

    // Filter to show only relevant clients (with upcoming appointments or recent past)
    const clients = Array.from(clientMap.values()); // Show all clients with bookings

    res.json({
      success: true,
      data: clients
    });
  } catch (error) {
    console.error('Error fetching dietitian clients:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching clients'
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