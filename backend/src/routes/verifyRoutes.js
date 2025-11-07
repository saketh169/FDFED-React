const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
    validateDietitianObjectId,
    validateOrganizationObjectId,
    validateCorporateObjectId,
    handleMulterError
} = require('../middlewares/authMiddleware');
const {
    uploadDietitianFiles,
    getDietitians,
    getDietitianFile,
    approveDietitianDocument,
    disapproveDietitianDocument,
    finalApproveDietitian,
    finalDisapproveDietitian,
    uploadDietitianFinalReport,
    getCurrentDietitian,
    checkDietitianStatus,
    uploadOrganizationFiles,
    getOrganizations,
    getOrganizationFile,
    approveOrganizationDocument,
    disapproveOrganizationDocument,
    finalApproveOrganization,
    finalDisapproveOrganization,
    uploadOrganizationFinalReport,
    getCurrentOrganization,
    checkOrganizationStatus,
    uploadCorporateFiles,
    getCorporatePartners,
    getCorporateFile,
    approveCorporateDocument,
    disapproveCorporateDocument,
    finalApproveCorporate,
    finalDisapproveCorporate,
    uploadCorporateFinalReport,
    getCurrentCorporate,
    checkCorporateStatus
} = require('../controllers/verifyController');

// Multer configuration for dietitian file uploads
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF is allowed.'));
    }
};
const dietitianUpload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit per file
        files: 8 // Maximum 8 files
    }
}).fields([
    { name: 'resume', maxCount: 1 },
    { name: 'degreeCertificate', maxCount: 1 },
    { name: 'licenseDocument', maxCount: 1 },
    { name: 'idProof', maxCount: 1 },
    { name: 'experienceCertificates', maxCount: 1 },
    { name: 'specializationCertifications', maxCount: 1 },
    { name: 'internshipCertificate', maxCount: 1 },
    { name: 'researchPapers', maxCount: 1 }
]);

// Multer configuration for final report upload
const reportUpload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF is allowed.'));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 1 // Only one file allowed
    }
}).single('finalReport');

// Dietitian Routes
router.post('/upload', dietitianUpload, handleMulterError, uploadDietitianFiles);
router.get('/dietitians', getDietitians);
router.get('/files/:dietitianId/:field', validateDietitianObjectId, getDietitianFile);
router.post('/:dietitianId/approve', validateDietitianObjectId, approveDietitianDocument);
router.post('/:dietitianId/disapprove', validateDietitianObjectId, disapproveDietitianDocument);
router.post('/:dietitianId/final-approve', validateDietitianObjectId, finalApproveDietitian);
router.post('/:dietitianId/final-disapprove', validateDietitianObjectId, finalDisapproveDietitian);
router.post('/:dietitianId/upload-report', validateDietitianObjectId, reportUpload, handleMulterError, uploadDietitianFinalReport);
router.get('/me', getCurrentDietitian);
router.get('/check-status', checkDietitianStatus);

// Multer configuration for organization file uploads
const organizationStorage = multer.memoryStorage();
const organizationFileFilter = (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF and images are allowed.'));
    }
};
const organizationUpload = multer({
    storage: organizationStorage,
    fileFilter: organizationFileFilter,
    limits: {
        fileSize: 20 * 1024 * 1024, // 20MB limit per file
        files: 8 // Maximum 8 files
    }
}).fields([
    { name: 'orgLogo', maxCount: 1 },
    { name: 'orgBrochure', maxCount: 1 },
    { name: 'legalDocument', maxCount: 1 },
    { name: 'taxDocument', maxCount: 1 },
    { name: 'addressProof', maxCount: 1 },
    { name: 'businessLicense', maxCount: 1 },
    { name: 'authorizedRepId', maxCount: 1 },
    { name: 'bankDocument', maxCount: 1 }
]);

// Multer configuration for organization final report upload
const orgReportUpload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF is allowed.'));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 1 // Only one file allowed
    }
}).single('finalReport');

// Multer configuration for corporate partner file uploads
const corporateStorage = multer.memoryStorage();
const corporateFileFilter = (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF and images are allowed.'));
    }
};
const corporateUpload = multer({
    storage: corporateStorage,
    fileFilter: corporateFileFilter,
    limits: {
        fileSize: 20 * 1024 * 1024, // 20MB limit per file
        files: 7 // Maximum 7 files
    }
}).fields([
    { name: 'businessLicense', maxCount: 1 },
    { name: 'taxIdDocument', maxCount: 1 },
    { name: 'incorporationCertificate', maxCount: 1 },
    { name: 'authorizedRepId', maxCount: 1 },
    { name: 'bankAccountProof', maxCount: 1 },
    { name: 'financialAudit', maxCount: 1 },
    { name: 'codeOfConduct', maxCount: 1 }
]);

// Multer configuration for corporate partner final report upload
const corpReportUpload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF is allowed.'));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 1 // Only one file allowed
    }
}).single('finalReport');

// Organization Routes
router.post('/org/upload', organizationUpload, handleMulterError, uploadOrganizationFiles);
router.get('/organizations', getOrganizations);
router.get('/org/files/:orgId/:field', validateOrganizationObjectId, getOrganizationFile);
router.post('/org/:orgId/approve', validateOrganizationObjectId, approveOrganizationDocument);
router.post('/org/:orgId/disapprove', validateOrganizationObjectId, disapproveOrganizationDocument);
router.post('/org/:orgId/final-approve', validateOrganizationObjectId, finalApproveOrganization);
router.post('/org/:orgId/final-disapprove', validateOrganizationObjectId, finalDisapproveOrganization);
router.post('/org/:orgId/upload-report', validateOrganizationObjectId, orgReportUpload, handleMulterError, uploadOrganizationFinalReport);
router.get('/org/me', getCurrentOrganization);
router.get('/org/check-status', checkOrganizationStatus);

// Corporate Partner Routes
router.post('/corporate/upload', corporateUpload, handleMulterError, uploadCorporateFiles);
router.get('/corporate', getCorporatePartners);
router.get('/corporate/files/:cpId/:field', validateCorporateObjectId, getCorporateFile);
router.post('/corporate/:cpId/approve', validateCorporateObjectId, approveCorporateDocument);
router.post('/corporate/:cpId/disapprove', validateCorporateObjectId, disapproveCorporateDocument);
router.post('/corporate/:cpId/final-approve', validateCorporateObjectId, finalApproveCorporate);
router.post('/corporate/:cpId/final-disapprove', validateCorporateObjectId, finalDisapproveCorporate);
router.post('/corporate/:cpId/upload-report', validateCorporateObjectId, corpReportUpload, handleMulterError, uploadCorporateFinalReport);
router.get('/corporate/me', getCurrentCorporate);
router.get('/corporate/check-status', checkCorporateStatus);

module.exports = router;