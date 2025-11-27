const express = require('express');
const router = express.Router();
const { Dietitian, UserAuth } = require('../models/userModel');
const Booking = require('../models/bookingModel');
const { authenticateJWT } = require('../middlewares/authMiddleware');

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
      
      // Skip only if appointment was more than 12 hours ago
      if (hoursSinceAppointment > 12 && bookingDateTime < now) {
        return; // Skip old past appointments (more than 12 hours ago)
      }

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
        const isPast = bookingDateTime < now;
        
        // Determine status: Active for upcoming/current, Completed for past
        let clientStatus = 'Active';
        if (isPast && booking.status === 'completed') {
          clientStatus = 'Completed';
        } else if (isPast) {
          clientStatus = 'Completed';
        } else if (booking.status === 'cancelled') {
          clientStatus = 'Completed';
        }
        
        clientMap.set(clientId, {
          id: clientId,
          name: booking.username,
          email: booking.email,
          phone: booking.userPhone || 'N/A',
          age: 'N/A', // Not available in booking
          location: booking.userAddress || 'N/A',
          consultationType: booking.consultationType || 'General Consultation',
          nextAppointment: isUpcoming ? `${booking.date} ${booking.time}` : null,
          status: clientStatus,
          profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(booking.username)}&background=28B463&color=fff&size=128`,
          lastConsultation: booking.date,
          totalSessions: 1,
          goals: [booking.dietitianSpecialization || 'General Health'],
          isPast: isPast
        });
      }
    });

    // Return all clients that have relevant bookings
    const clients = Array.from(clientMap.values());

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
/*
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
}); */

// Dietitian profile setup route
router.post('/dietitian-profile-setup/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const setupData = req.body;

    // Validate required fields for setup
    const requiredFields = ['name', 'email', 'phone', 'age', 'specialization', 'experience', 'fees', 'languages', 'location', 'education'];
    const missingFields = requiredFields.filter(field => !setupData[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    const dietitian = await Dietitian.findByIdAndUpdate(id, setupData, { new: true });

    if (!dietitian) {
      return res.status(404).json({
        success: false,
        message: 'Dietitian not found'
      });
    }

    res.json({
      success: true,
      data: dietitian,
      message: 'Profile setup completed successfully'
    });
  } catch (error) {
    console.error('Error setting up dietitian profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error setting up dietitian profile'
    });
  }
});

// Get available slots for a dietitian on a specific date
router.get('/dietitians/:id/slots', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const { date, userId } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date parameter is required'
      });
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Use YYYY-MM-DD'
      });
    }

    const dietitian = await Dietitian.findById(id);
    if (!dietitian) {
      return res.status(404).json({
        success: false,
        message: 'Dietitian not found'
      });
    }

    // For now, assume standard working hours: 9:00 AM to 8:00 PM (20:00)
    // In a real implementation, this would come from dietitian's availability settings
    const startHour = 9;
    const endHour = 20; // 8:00 PM
    const slotDuration = 30; // minutes

    let availableSlots = [];
    let currentHour = startHour;
    let currentMinute = 0;

    // Generate 30-minute slots from start to end time
    while (currentHour < endHour || (currentHour === endHour && currentMinute === 0)) {
      const slot = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      availableSlots.push(slot);

      currentMinute += slotDuration;
      if (currentMinute >= 60) {
        currentHour += 1;
        currentMinute = 0;
      }
    }

    // Parse and normalize the query date
    const queryDate = new Date(date);
    queryDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(queryDate);
    nextDay.setDate(nextDay.getDate() + 1);

    // Fetch slots booked by the current user for ANY dietitian on this date
    const userBookedSlots = await Booking.find({
      userId,
      date: { $gte: queryDate, $lt: nextDay },
      status: { $in: ['confirmed', 'completed'] }
    }).select('time dietitianName');

    // Fetch slots booked for this specific dietitian by ANY user on this date
    const dietitianBookedSlots = await Booking.find({
      dietitianId: id,
      date: { $gte: queryDate, $lt: nextDay },
      status: { $in: ['confirmed', 'completed'] }
    }).select('time userId');

    // Create maps for quick lookup
    const userBookedMap = new Map();
    userBookedSlots.forEach(booking => {
      userBookedMap.set(booking.time, booking.dietitianName);
    });

    const dietitianBookedMap = new Map();
    dietitianBookedSlots.forEach(booking => {
      dietitianBookedMap.set(booking.time, booking.userId);
    });

    // Categorize each slot
    const slotsWithStatus = availableSlots.map(slot => {
      let status = 'available';
      let dietitianName = null;
      let isUserBooking = false;

      if (userBookedMap.has(slot)) {
        if (dietitianBookedMap.has(slot) && dietitianBookedMap.get(slot).toString() === userId.toString()) {
          // User has booked with this dietitian
          status = 'booked_with_this_dietitian';
          isUserBooking = true;
        } else {
          // User has booked with another dietitian
          status = 'you_are_booked';
          dietitianName = userBookedMap.get(slot);
        }
      } else if (dietitianBookedMap.has(slot)) {
        // Slot booked with this dietitian by someone else
        status = 'booked';
      }

      return {
        time: slot,
        status,
        dietitianName,
        isUserBooking
      };
    });

    // Filter to only show slots associated with this user and dietitian
    const filteredSlots = slotsWithStatus.filter(slot => {
      return slot.status === 'available' || 
             slot.status === 'booked_with_this_dietitian' || 
             slot.status === 'you_are_booked';
    });

    res.json({
      success: true,
      slots: filteredSlots,
      date: queryDate
    });
  } catch (error) {
    console.error('Error fetching available slots:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching available slots'
    });
  }
});

module.exports = router;