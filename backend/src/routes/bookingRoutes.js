const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

/**
 * BOOKING ROUTES
 * Base path: /api/bookings
 */

// --- CREATE BOOKING ---
// POST /api/bookings/create
router.post("/create", bookingController.createBooking);

// --- GET BOOKINGS ---
// GET /api/bookings/user/:userId
router.get("/user/:userId", bookingController.getUserBookings);

// GET /api/bookings/user/:userId/booked-slots
router.get("/user/:userId/booked-slots", bookingController.getUserBookedSlots);

// GET /api/bookings/dietitian/:dietitianId
router.get("/dietitian/:dietitianId", bookingController.getDietitianBookings);

// GET /api/bookings/dietitian/:dietitianId/booked-slots
router.get(
  "/dietitian/:dietitianId/booked-slots",
  bookingController.getBookedSlots
);

// GET /api/bookings/:bookingId
router.get("/:bookingId", bookingController.getBookingById);

// --- UPDATE BOOKING STATUS ---
// PATCH /api/bookings/:bookingId/status
router.patch("/:bookingId/status", bookingController.updateBookingStatus);

// --- CANCEL BOOKING ---
// DELETE /api/bookings/:bookingId
router.delete("/:bookingId", bookingController.cancelBooking);

module.exports = router;
