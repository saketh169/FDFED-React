const express = require('express');
const router = express.Router();
const labReportController = require('../controllers/labReportController');
const { authenticateJWT } = require('../middlewares/authMiddleware');
const { uploadLabReports } = require('../middlewares/uploadMiddleware');

// ----------------------------------------------------------------------
// PUBLIC ROUTES
// ----------------------------------------------------------------------

// Get lab report categories
router.get('/categories', labReportController.getLabReportCategories);

// ----------------------------------------------------------------------
// CLIENT ROUTES (Authentication required)
// ----------------------------------------------------------------------

// Submit lab report (clients only)
router.post(
    '/',
    authenticateJWT,
    uploadLabReports.array('files', 10), // Allow up to 10 files
    labReportController.submitLabReport
);

// Get client's own lab reports
router.get('/my-reports', authenticateJWT, labReportController.getClientLabReports);

// Get single lab report by ID (clients can only view their own)
router.get('/:id', authenticateJWT, labReportController.getLabReportById);

// ----------------------------------------------------------------------
// DIETITIAN ROUTES (Authentication required)
// ----------------------------------------------------------------------

// Get all client lab reports (dietitians only)
router.get('/dietitian/all', authenticateJWT, labReportController.getAllClientLabReports);

// Update lab report status (dietitians only)
router.put('/:id/status', authenticateJWT, labReportController.updateLabReportStatus);

module.exports = router;