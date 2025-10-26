const mongoose = require("mongoose");
const Booking = require("../models/bookingModel");
const { BlockedSlot } = require("../models/bookingModel");
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
    // Parse date as UTC to avoid timezone issues
    const [year, month, day] = date.split("-").map(Number);
    const bookingDate = new Date(Date.UTC(year, month - 1, day)); // Create UTC date at midnight
    const now = new Date();
    const today = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    );

    if (bookingDate < today) {
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
