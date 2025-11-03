const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const {
    uploadUserProfileImage,
    uploadAdminProfileImage,
    uploadDietitianProfileImage,
    uploadOrganizationProfileImage,
    uploadCorporatePartnerProfileImage,
    getUserProfileImage,
    getAdminProfileImage,
    getDietitianProfileImage,
    getOrganizationProfileImage,
    getCorporatePartnerProfileImage,
    getUserDetails,
    getDietitianDetails,
    getAdminDetails,
    getOrganizationDetails,
    getCorporatePartnerDetails
} = require('../controllers/profileController');

// Profile Image Upload Routes - No authentication required for now
router.post('/uploaduser', upload.single('profileImage'), uploadUserProfileImage);
router.post('/uploadadmin', upload.single('profileImage'), uploadAdminProfileImage);
router.post('/uploaddietitian', upload.single('profileImage'), uploadDietitianProfileImage);
router.post('/uploadorganization', upload.single('profileImage'), uploadOrganizationProfileImage);
router.post('/uploadcorporatepartner', upload.single('profileImage'), uploadCorporatePartnerProfileImage);

// Profile Image Retrieval Routes
router.get('/getuser', getUserProfileImage);
router.get('/getadmin', getAdminProfileImage);
router.get('/getdietitian', getDietitianProfileImage);
router.get('/getorganization', getOrganizationProfileImage);
router.get('/getcorporatepartner', getCorporatePartnerProfileImage);

// Unified User Details Routes - Role-specific naming with matching controller functions
// These will automatically detect the role from the JWT token
router.get('/getuserdetails', getUserDetails);
router.get('/getdietitiandetails', getDietitianDetails);
router.get('/getadmindetails', getAdminDetails);
router.get('/getorganizationdetails', getOrganizationDetails);
router.get('/getcorporatepartnerdetails', getCorporatePartnerDetails);


module.exports = router;
