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
    getCorporatePartnerProfileImage
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

module.exports = router;
