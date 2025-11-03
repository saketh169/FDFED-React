const express = require('express');
const router = express.Router();
const {
    getUserDetails,
    getProfileImage
} = require('../controllers/userDetailsController');

/**
 * Unified User Details Routes
 * These routes work for all user roles (User, Dietitian, Admin, Organization, CorporatePartner)
 * The role is detected from the JWT token
 */

// Get full user details (name, email, phone, profileImage, and role-specific fields)
router.get('/userdetails', getUserDetails);

// Get only the profile image (lightweight endpoint)
router.get('/profileimage', getProfileImage);

module.exports = router;
