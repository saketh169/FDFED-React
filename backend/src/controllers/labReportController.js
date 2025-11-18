const { LabReport } = require('../models/labReportModel');
const { User, Dietitian } = require('../models/userModel');
const fs = require('fs');
const path = require('path');

// ----------------------------------------------------------------------
// SUBMIT LAB REPORT
// ----------------------------------------------------------------------
exports.submitLabReport = async (req, res) => {
    try {
        const { roleId } = req.user;

        // Get client name from User model
        const client = await User.findById(roleId).select('name');
        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Client profile not found'
            });
        }
        const {
            submittedCategories,
            hormonalIssues,
            fitnessMetrics,
            generalReports,
            bloodSugarFocus,
            thyroid,
            cardiovascular
        } = req.body;

        // Validate that user is a client
        if (req.user.role !== 'user') {
            return res.status(403).json({
                success: false,
                message: 'Only clients can submit lab reports'
            });
        }

        // Handle file uploads
        let uploadedFiles = [];
        if (req.files && req.files.length > 0) {
            const uploadDir = path.join(__dirname, '../../uploads/lab-reports');
            
            for (const file of req.files) {
                // Generate unique filename
                const uniqueName = `${Date.now()}-${file.originalname}`;
                const filePath = path.join(uploadDir, uniqueName);
                
                // Write file to disk
                fs.writeFileSync(filePath, file.buffer);
                
                uploadedFiles.push({
                    fieldName: file.fieldname,
                    originalName: file.originalname,
                    filename: uniqueName,
                    path: filePath,
                    size: file.size,
                    mimetype: file.mimetype
                });
            }
        }

        // Create new lab report
        const newLabReport = new LabReport({
            clientId: roleId,
            clientName: client.name,
            submittedCategories: submittedCategories ? JSON.parse(submittedCategories) : [],
            hormonalIssues: hormonalIssues ? JSON.parse(hormonalIssues) : {},
            fitnessMetrics: fitnessMetrics ? JSON.parse(fitnessMetrics) : {},
            generalReports: generalReports ? JSON.parse(generalReports) : {},
            bloodSugarFocus: bloodSugarFocus ? JSON.parse(bloodSugarFocus) : {},
            thyroid: thyroid ? JSON.parse(thyroid) : {},
            cardiovascular: cardiovascular ? JSON.parse(cardiovascular) : {},
            uploadedFiles
        });

        await newLabReport.save();

        res.status(201).json({
            success: true,
            message: 'Lab report submitted successfully',
            labReport: newLabReport
        });
    } catch (error) {
        console.error('Submit lab report error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit lab report',
            error: error.message
        });
    }
};

// ----------------------------------------------------------------------
// GET CLIENT'S OWN LAB REPORTS
// ----------------------------------------------------------------------
exports.getClientLabReports = async (req, res) => {
    try {
        const { roleId } = req.user;
        const { page = 1, limit = 10, status } = req.query;

        // Validate that user is a client
        if (req.user.role !== 'user') {
            return res.status(403).json({
                success: false,
                message: 'Only clients can view their own lab reports'
            });
        }

        // Build filter
        const filter = { clientId: roleId };
        if (status) {
            filter.status = status;
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const labReports = await LabReport.find(filter)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(skip)
            .lean();

        const total = await LabReport.countDocuments(filter);

        res.status(200).json({
            success: true,
            labReports,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Get client lab reports error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch lab reports',
            error: error.message
        });
    }
};

// ----------------------------------------------------------------------
// GET SINGLE LAB REPORT BY ID (Client only their own)
// ----------------------------------------------------------------------
exports.getLabReportById = async (req, res) => {
    try {
        const { roleId, role } = req.user;
        const { id } = req.params;

        const labReport = await LabReport.findById(id);

        if (!labReport) {
            return res.status(404).json({
                success: false,
                message: 'Lab report not found'
            });
        }

        // Check permissions
        if (role === 'user' && labReport.clientId.toString() !== roleId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only view your own lab reports'
            });
        }

        // For dietitians, they can view any client's reports
        // (assuming dietitians have access to all client reports)

        res.status(200).json({
            success: true,
            labReport
        });
    } catch (error) {
        console.error('Get lab report error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch lab report',
            error: error.message
        });
    }
};

// ----------------------------------------------------------------------
// GET ALL CLIENT LAB REPORTS (For Dietitians)
// ----------------------------------------------------------------------
exports.getAllClientLabReports = async (req, res) => {
    try {
        const { userRole } = req.user;
        const {
            page = 1,
            limit = 10,
            status,
            clientId,
            category,
            dateFrom,
            dateTo
        } = req.query;

        // Validate that user is a dietitian
        if (req.user.role !== 'dietitian') {
            return res.status(403).json({
                success: false,
                message: 'Only dietitians can view all client lab reports'
            });
        }

        // Build filter
        const filter = {};
        if (status) {
            filter.status = status;
        }
        if (clientId) {
            filter.clientId = clientId;
        }
        if (category) {
            filter.submittedCategories = category;
        }
        if (dateFrom || dateTo) {
            filter.createdAt = {};
            if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
            if (dateTo) filter.createdAt.$lte = new Date(dateTo);
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const labReports = await LabReport.find(filter)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(skip)
            .populate('clientId', 'name email phone')
            .lean();

        const total = await LabReport.countDocuments(filter);

        res.status(200).json({
            success: true,
            labReports,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Get all client lab reports error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch lab reports',
            error: error.message
        });
    }
};

// ----------------------------------------------------------------------
// UPDATE LAB REPORT STATUS (Dietitian only)
// ----------------------------------------------------------------------
exports.updateLabReportStatus = async (req, res) => {
    try {
        const { roleId } = req.user;
        const { id } = req.params;
        const { status, notes } = req.body;

        // Get dietitian name from Dietitian model
        const dietitian = await Dietitian.findById(roleId).select('name');
        if (!dietitian) {
            return res.status(404).json({
                success: false,
                message: 'Dietitian profile not found'
            });
        }

        // Validate that user is a dietitian
        if (req.user.role !== 'dietitian') {
            return res.status(403).json({
                success: false,
                message: 'Only dietitians can update lab report status'
            });
        }

        const labReport = await LabReport.findById(id);

        if (!labReport) {
            return res.status(404).json({
                success: false,
                message: 'Lab report not found'
            });
        }

        // Update status and review info
        labReport.status = status;
        if (status === 'reviewed') {
            labReport.reviewedBy = {
                dietitianId: roleId,
                dietitianName: dietitian.name,
                reviewedAt: new Date()
            };
        }
        if (notes !== undefined) {
            labReport.notes = notes;
        }

        await labReport.save();

        res.status(200).json({
            success: true,
            message: 'Lab report status updated successfully',
            labReport
        });
    } catch (error) {
        console.error('Update lab report status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update lab report status',
            error: error.message
        });
    }
};

// ----------------------------------------------------------------------
// GET LAB REPORT CATEGORIES
// ----------------------------------------------------------------------
exports.getLabReportCategories = async (req, res) => {
    try {
        const categories = [
            { id: 'Hormonal_Issues', label: 'Hormonal Issues', description: 'Enter specific metrics for endocrine and reproductive health.' },
            { id: 'Fitness_Metrics', label: 'Fitness & Body Metrics', description: 'Key body composition and lifestyle data for weight goals.' },
            { id: 'General_Reports', label: 'General Checkup', description: 'Upload your primary health screening report and fill in key metrics.' },
            { id: 'Blood_Sugar_Focus', label: 'Blood & Sugar Focus', description: 'Detailed reports and values for glucose and lipids.' },
            { id: 'Thyroid', label: 'Thyroid', description: 'Detailed thyroid panel results (TSH, Free T4, Antibodies) and related reports.' },
            { id: 'Cardiovascular', label: 'Heart & Cardiac', description: 'Cardiovascular health, blood pressure, and ECG details.' }
        ];

        res.status(200).json({
            success: true,
            categories
        });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch categories',
            error: error.message
        });
    }
};