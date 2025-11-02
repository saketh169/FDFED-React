const { User, Admin, Dietitian, Organization, CorporatePartner } = require('../models/userModel');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-development';

// Helper function to extract user ID from JWT token
const getUserIdFromToken = (req) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) return null;
        
        const token = authHeader.split(' ')[1]; // Bearer TOKEN
        if (!token) return null;
        
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded.roleId; // roleId is the actual document ID in the specific collection
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

// Upload profile image for User
async function uploadUserProfileImage(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        // Get userId from JWT token or request body
        let userId = getUserIdFromToken(req);
        if (!userId) {
            userId = req.body.userId || req.query.userId || req.params.userId;
        }
        
        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required. Please provide a valid token or user ID.' });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { 
                profileImage: req.file.buffer
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Profile photo uploaded successfully'
        });
    } catch (error) {
        console.error('Error uploading user profile photo:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to upload profile photo'
        });
    }
}

// Upload profile image for Admin
async function uploadAdminProfileImage(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        let adminId = getUserIdFromToken(req);
        if (!adminId) {
            adminId = req.body.adminId || req.query.adminId || req.params.adminId;
        }
        
        if (!adminId) {
            return res.status(400).json({ success: false, message: 'Admin ID is required. Please provide a valid token or admin ID.' });
        }

        const admin = await Admin.findByIdAndUpdate(
            adminId,
            { 
                profileImage: req.file.buffer
            },
            { new: true }
        );

        if (!admin) {
            return res.status(404).json({ success: false, message: 'Admin not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Profile photo uploaded successfully'
        });
    } catch (error) {
        console.error('Error uploading admin profile photo:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to upload profile photo'
        });
    }
}

// Upload profile image for Dietitian
async function uploadDietitianProfileImage(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        let dietitianId = getUserIdFromToken(req);
        if (!dietitianId) {
            dietitianId = req.body.dietitianId || req.query.dietitianId || req.params.dietitianId;
        }
        
        if (!dietitianId) {
            return res.status(400).json({ success: false, message: 'Dietitian ID is required. Please provide a valid token or dietitian ID.' });
        }

        const dietitian = await Dietitian.findByIdAndUpdate(
            dietitianId,
            { 
                profileImage: req.file.buffer
            },
            { new: true }
        );

        if (!dietitian) {
            return res.status(404).json({ success: false, message: 'Dietitian not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Profile photo uploaded successfully'
        });
    } catch (error) {
        console.error('Error uploading dietitian profile photo:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to upload profile photo'
        });
    }
}

// Upload profile image for Organization
async function uploadOrganizationProfileImage(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        let orgId = getUserIdFromToken(req);
        if (!orgId) {
            orgId = req.body.orgId || req.query.orgId || req.params.orgId;
        }
        
        if (!orgId) {
            return res.status(400).json({ success: false, message: 'Organization ID is required. Please provide a valid token or organization ID.' });
        }

        const organization = await Organization.findByIdAndUpdate(
            orgId,
            { 
                profileImage: req.file.buffer
            },
            { new: true }
        );

        if (!organization) {
            return res.status(404).json({ success: false, message: 'Organization not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Profile photo uploaded successfully'
        });
    } catch (error) {
        console.error('Error uploading organization profile photo:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to upload profile photo'
        });
    }
}

// Upload profile image for Corporate Partner
async function uploadCorporatePartnerProfileImage(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        let partnerId = getUserIdFromToken(req);
        if (!partnerId) {
            partnerId = req.body.partnerId || req.query.partnerId || req.params.partnerId;
        }
        
        if (!partnerId) {
            return res.status(400).json({ success: false, message: 'Partner ID is required. Please provide a valid token or partner ID.' });
        }

        const partner = await CorporatePartner.findByIdAndUpdate(
            partnerId,
            { 
                profileImage: req.file.buffer
            },
            { new: true }
        );

        if (!partner) {
            return res.status(404).json({ success: false, message: 'Corporate Partner not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Profile photo uploaded successfully'
        });
    } catch (error) {
        console.error('Error uploading corporate partner profile photo:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to upload profile photo'
        });
    }
}

// Get profile image for User
async function getUserProfileImage(req, res) {
    try {
        let userId = getUserIdFromToken(req);
        if (!userId) {
            userId = req.body.userId || req.query.userId || req.params.userId;
        }
        
        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required' });
        }

        const user = await User.findById(userId);

        if (!user || !user.profileImage) {
            return res.status(404).json({ success: false, message: 'Profile image not found' });
        }

        // Convert buffer to base64 data URL
        const base64Image = Buffer.from(user.profileImage).toString('base64');
        const dataUrl = `data:image/jpeg;base64,${base64Image}`;

        res.status(200).json({
            success: true,
            profileImage: dataUrl
        });
    } catch (error) {
        console.error('Error retrieving user profile image:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to retrieve profile image'
        });
    }
}

// Get profile image for Admin
async function getAdminProfileImage(req, res) {
    try {
        let adminId = getUserIdFromToken(req);
        if (!adminId) {
            adminId = req.body.adminId || req.query.adminId || req.params.adminId;
        }
        
        if (!adminId) {
            return res.status(400).json({ success: false, message: 'Admin ID is required' });
        }

        const admin = await Admin.findById(adminId);

        if (!admin || !admin.profileImage) {
            return res.status(404).json({ success: false, message: 'Profile image not found' });
        }

        const base64Image = Buffer.from(admin.profileImage).toString('base64');
        const dataUrl = `data:image/jpeg;base64,${base64Image}`;

        res.status(200).json({
            success: true,
            profileImage: dataUrl
        });
    } catch (error) {
        console.error('Error retrieving admin profile image:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to retrieve profile image'
        });
    }
}

// Get profile image for Dietitian
async function getDietitianProfileImage(req, res) {
    try {
        let dietitianId = getUserIdFromToken(req);
        if (!dietitianId) {
            dietitianId = req.body.dietitianId || req.query.dietitianId || req.params.dietitianId;
        }
        
        if (!dietitianId) {
            return res.status(400).json({ success: false, message: 'Dietitian ID is required' });
        }

        const dietitian = await Dietitian.findById(dietitianId);

        if (!dietitian || !dietitian.profileImage) {
            return res.status(404).json({ success: false, message: 'Profile image not found' });
        }

        const base64Image = Buffer.from(dietitian.profileImage).toString('base64');
        const dataUrl = `data:image/jpeg;base64,${base64Image}`;

        res.status(200).json({
            success: true,
            profileImage: dataUrl
        });
    } catch (error) {
        console.error('Error retrieving dietitian profile image:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to retrieve profile image'
        });
    }
}

// Get profile image for Organization
async function getOrganizationProfileImage(req, res) {
    try {
        let orgId = getUserIdFromToken(req);
        if (!orgId) {
            orgId = req.body.orgId || req.query.orgId || req.params.orgId;
        }
        
        if (!orgId) {
            return res.status(400).json({ success: false, message: 'Organization ID is required' });
        }

        const organization = await Organization.findById(orgId);

        if (!organization || !organization.profileImage) {
            return res.status(404).json({ success: false, message: 'Profile image not found' });
        }

        const base64Image = Buffer.from(organization.profileImage).toString('base64');
        const dataUrl = `data:image/jpeg;base64,${base64Image}`;

        res.status(200).json({
            success: true,
            profileImage: dataUrl
        });
    } catch (error) {
        console.error('Error retrieving organization profile image:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to retrieve profile image'
        });
    }
}

// Get profile image for Corporate Partner
async function getCorporatePartnerProfileImage(req, res) {
    try {
        let partnerId = getUserIdFromToken(req);
        if (!partnerId) {
            partnerId = req.body.partnerId || req.query.partnerId || req.params.partnerId;
        }
        
        if (!partnerId) {
            return res.status(400).json({ success: false, message: 'Partner ID is required' });
        }

        const partner = await CorporatePartner.findById(partnerId);

        if (!partner || !partner.profileImage) {
            return res.status(404).json({ success: false, message: 'Profile image not found' });
        }

        const base64Image = Buffer.from(partner.profileImage).toString('base64');
        const dataUrl = `data:image/jpeg;base64,${base64Image}`;

        res.status(200).json({
            success: true,
            profileImage: dataUrl
        });
    } catch (error) {
        console.error('Error retrieving corporate partner profile image:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to retrieve profile image'
        });
    }
}

module.exports = {
    uploadUserProfileImage,
    uploadAdminProfileImage,
    uploadDietitianProfileImage,
    uploadOrganizationProfileImage,
    uploadCorporatePartnerProfileImage,
    getUserProfileImage,
    getAdminProfileImage,
    getDietitianProfileImage,
    getOrganizationProfileImage,
    getCorporatePartnerProfileImage
};
