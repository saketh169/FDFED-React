const express = require('express');
const router = express.Router();
const {
    getUsersList,
    getDietitiansList,
    getVerifyingOrganizations,
    getAllOrganizations,
    getAllCorporatePartners,
    getActiveDietPlans,
    getSubscriptions,
    getConsultationRevenue
} = require('../controllers/analyticsContrller');

// Analytics routes
router.get('/users-list', getUsersList);
router.get('/dietitian-list', getDietitiansList);
router.get('/verifying-organizations', getVerifyingOrganizations);
router.get('/organizations-list', getAllOrganizations);
router.get('/corporate-partners-list', getAllCorporatePartners);
router.get('/active-diet-plans', getActiveDietPlans);
router.get('/subscriptions', getSubscriptions);
router.get('/consultation-revenue', getConsultationRevenue);

module.exports = router;
