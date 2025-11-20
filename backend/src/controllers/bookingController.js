const mongoose = require("mongoose");
const Booking = require("../models/bookingModel");
const {
  sendBookingConfirmationToUser,
  sendBookingNotificationToDietitian,
} = require("../services/bookingService");

/**
 * Create a new booking
 * POST /api/bookings/create
 */
exports.createBooking = async (req, res) => {
  try {
    const {
      userId,
      username,
      email,
      userPhone,
      userAddress,
      dietitianId,
      dietitianName,
      dietitianEmail,
      dietitianPhone,
      dietitianSpecialization,
      date,
      time,
      consultationType,
      amount,
      paymentMethod,
      paymentId,
    } = req.body;

    // Validate required fields
    if (
      !userId ||
      !username ||
      !email ||
      !dietitianId ||
      !dietitianName ||
      !dietitianEmail ||
      !date ||
      !time ||
      !consultationType ||
      !amount ||
      !paymentMethod ||
      !paymentId
    ) {
      // Log which fields are missing
      const missingFields = [];
      if (!userId) missingFields.push("userId");
      if (!username) missingFields.push("username");
      if (!email) missingFields.push("email");
      if (!dietitianId) missingFields.push("dietitianId");
      if (!dietitianName) missingFields.push("dietitianName");
      if (!dietitianEmail) missingFields.push("dietitianEmail");
      if (!date) missingFields.push("date");
      if (!time) missingFields.push("time");
      if (!consultationType) missingFields.push("consultationType");
      if (!amount) missingFields.push("amount");
      if (!paymentMethod) missingFields.push("paymentMethod");
      if (!paymentId) missingFields.push("paymentId");

      console.error("Missing required fields:", missingFields);
      console.error("Received data:", req.body);

      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Validate date is in the future
    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (bookingDate < now) {
      return res.status(400).json({
        success: false,
        message: "Booking date must be today or in the future",
      });
    }

    const dayStart = new Date(bookingDate);
    const dayEnd = new Date(bookingDate);
    dayEnd.setDate(dayEnd.getDate() + 1);

    // **NEW: Check if the user already has a booking at this time (with any dietitian)**
    const userConflictingBooking = await Booking.findOne({
      userId,
      date: { $gte: dayStart, $lt: dayEnd },
      time,
      status: { $in: ["confirmed", "completed"] },
    });

    if (userConflictingBooking) {
      return res.status(409).json({
        success: false,
        message: `You already have an appointment with ${userConflictingBooking.dietitianName} at ${time} on this date. Please select a different time slot.`,
        conflictingBooking: {
          dietitianName: userConflictingBooking.dietitianName,
          time: userConflictingBooking.time,
          date: userConflictingBooking.date,
        },
      });
    }

    // Check if the slot is already booked with this specific dietitian
    const dietitianSlotBooked = await Booking.findOne({
      dietitianId,
      date: { $gte: dayStart, $lt: dayEnd },
      time,
      status: { $in: ["confirmed", "completed"] },
    });

    if (dietitianSlotBooked) {
      return res.status(409).json({
        success: false,
        message:
          "This time slot is already booked with this dietitian. Please select another slot.",
      });
    }

    // Check if payment ID is unique
    const existingPayment = await Booking.findOne({ paymentId });
    if (existingPayment) {
      return res.status(400).json({
        success: false,
        message: "This payment ID has already been used",
      });
    }

    // Create new booking
    const booking = new Booking({
      userId,
      username,
      email,
      userPhone,
      userAddress,
      dietitianId,
      dietitianName,
      dietitianEmail,
      dietitianPhone,
      dietitianSpecialization,
      date: bookingDate, // Use normalized date
      time,
      consultationType,
      amount,
      paymentMethod,
      paymentId,
      paymentStatus: "completed",
      status: "confirmed",
    });

    // Save to database
    const savedBooking = await booking.save();

    // Send confirmation emails
    try {
      // Prepare email data
      const emailData = {
        username,
        email,
        userPhone,
        userAddress,
        dietitianName,
        dietitianEmail,
        dietitianSpecialization,
        date: bookingDate,
        time,
        consultationType,
        amount,
        paymentId,
        bookingId: savedBooking._id,
      };

      // Send to user
      await sendBookingConfirmationToUser(emailData);

      // Send to dietitian
      await sendBookingNotificationToDietitian(emailData);

      console.log("Confirmation emails sent successfully");
    } catch (emailErr) {
      console.error("Error sending confirmation emails:", emailErr);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: savedBooking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create booking",
    });
  }
};

/**
 * Get all bookings for a user
 * GET /api/bookings/user/:userId
 */
exports.getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, sort = "-createdAt" } = req.query;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    let query = { userId };

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query).sort(sort).exec();

    res.status(200).json({
      success: true,
      data: bookings,
      count: bookings.length,
    });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch bookings",
    });
  }
};

/**
 * Get all bookings for a dietitian
 * GET /api/bookings/dietitian/:dietitianId
 */
exports.getDietitianBookings = async (req, res) => {
  try {
    const { dietitianId } = req.params;
    const { status, sort = "-createdAt" } = req.query;

    // Validate dietitianId
    if (!mongoose.Types.ObjectId.isValid(dietitianId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid dietitian ID",
      });
    }

    let query = { dietitianId };

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query).sort(sort).exec();

    res.status(200).json({
      success: true,
      data: bookings,
      count: bookings.length,
    });
  } catch (error) {
    console.error("Error fetching dietitian bookings:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch bookings",
    });
  }
};

/**
 * Get a specific booking by ID
 * GET /api/bookings/:bookingId
 */
exports.getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Validate booking ID
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch booking",
    });
  }
};

/**
 * Update booking status
 * PATCH /api/bookings/:bookingId/status
 */
exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    // Validate booking ID
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    // Validate status value
    const validStatuses = ["confirmed", "cancelled", "completed", "no-show"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update booking",
    });
  }
};

/**
 * Cancel a booking
 * DELETE /api/bookings/:bookingId
 */
exports.cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Validate booking ID
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if booking can be cancelled
    if (booking.status === "completed" || booking.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a ${booking.status} booking`,
      });
    }

    // Update booking status
    booking.status = "cancelled";
    booking.updatedAt = Date.now();
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to cancel booking",
    });
  }
};

/**
 * Get booked slots for a dietitian on a specific date
 * GET /api/bookings/dietitian/:dietitianId/booked-slots?date=YYYY-MM-DD&userId=xxx
 */
exports.getBookedSlots = async (req, res) => {
  try {
    const { dietitianId } = req.params;
    const { date, userId } = req.query; // Add userId to query params

    if (!dietitianId || !date) {
      return res.status(400).json({
        success: false,
        message: "Dietitian ID and date are required",
      });
    }

    // Parse and normalize the date
    const queryDate = new Date(date);
    queryDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(queryDate);
    nextDay.setDate(nextDay.getDate() + 1);

    // Find all confirmed/completed bookings for this dietitian on this date
    const bookings = await Booking.find({
      dietitianId,
      date: { $gte: queryDate, $lt: nextDay },
      status: { $in: ["confirmed", "completed"] },
    }).select("time userId");

    // Separate user's bookings from others' bookings
    const bookedSlots = [];
    const userBookings = [];

    bookings.forEach((booking) => {
      if (userId && booking.userId === userId) {
        userBookings.push(booking.time);
      } else {
        bookedSlots.push(booking.time);
      }
    });

    console.log(`Booked slots for dietitian ${dietitianId} on ${date}:`);
    console.log("- Other users:", bookedSlots);
    console.log("- Current user:", userBookings);

    res.status(200).json({
      success: true,
      bookedSlots, // Slots booked by other users
      userBookings, // Slots booked by current user
      date: queryDate,
    });
  } catch (error) {
    console.error("Error fetching booked slots:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch booked slots",
    });
  }
};

/**
 * Get user's booked slots for a specific date (to check conflicts)
 * GET /api/bookings/user/:userId/booked-slots?date=YYYY-MM-DD
 */
exports.getUserBookedSlots = async (req, res) => {
  try {
    const { userId } = req.params;
    const { date } = req.query;

    if (!userId || !date) {
      return res.status(400).json({
        success: false,
        message: "User ID and date are required",
      });
    }

    // Parse and normalize the date
    const queryDate = new Date(date);
    queryDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(queryDate);
    nextDay.setDate(nextDay.getDate() + 1);

    // Find all confirmed/completed bookings for this user on this date
    const bookings = await Booking.find({
      userId,
      date: { $gte: queryDate, $lt: nextDay },
      status: { $in: ["confirmed", "completed"] },
    }).select("time dietitianName");

    // Extract time slots with dietitian info
    const bookedSlots = bookings.map((booking) => ({
      time: booking.time,
      dietitianName: booking.dietitianName,
    }));

    console.log(`User ${userId} booked slots on ${date}:`, bookedSlots);

    res.status(200).json({
      success: true,
      bookedSlots,
      date: queryDate,
    });
  } catch (error) {
    console.error("Error fetching user booked slots:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch booked slots",
    });
  }
};

module.exports = exports;