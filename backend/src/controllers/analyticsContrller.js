const { User, Dietitian, Organization, CorporatePartner } = require('../models/userModel');
const Booking = require('../models/bookingModel');
const MealPlan = require('../models/mealPlanModel');
const Payment = require('../models/paymentModel');

// Get all users
exports.getUsersList = async (req, res) => {
    try {
        const users = await User.find({}, 'name email phone');
        res.json({ data: users });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

// Get all dietitians
exports.getDietitiansList = async (req, res) => {
    try {
        const dietitians = await Dietitian.find({}, 'name email phone specialization fees');
        res.json({ data: dietitians });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching dietitians', error: error.message });
    }
};

// Get verifying organizations
exports.getVerifyingOrganizations = async (req, res) => {
    try {
        const organizations = await Organization.find({ documentUploadStatus: 'pending' }, 'name email phone');
        res.json({ data: organizations });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching organizations', error: error.message });
    }
};

// Get all organizations
exports.getAllOrganizations = async (req, res) => {
    try {
        const organizations = await Organization.find({}, 'name email phone');
        res.json({ data: organizations });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching organizations', error: error.message });
    }
};

// Get all corporate partners
exports.getAllCorporatePartners = async (req, res) => {
    try {
        const corporatePartners = await CorporatePartner.find({}, 'name email phone');
        res.json({ data: corporatePartners });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching corporate partners', error: error.message });
    }
};

// Get active diet plans
exports.getActiveDietPlans = async (req, res) => {
    try {
        const activePlans = await MealPlan.find({ isActive: true });
        res.json({ data: activePlans });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching active diet plans', error: error.message });
    }
};

// Get subscriptions (using Payment model)
exports.getSubscriptions = async (req, res) => {
    try {
        // Using Payment model for subscriptions
        const payments = await Payment.find({ paymentStatus: 'success' })
            .populate('userId', 'name')
            .select('planType billingCycle amount paymentMethod transactionId subscriptionStartDate subscriptionEndDate createdAt paymentDate userId userName');
        // Format to match frontend expectation
        const formatted = payments.map(payment => ({
            id: payment._id,
            name: payment.userName,
            plan: payment.planType,
            cycle: payment.billingCycle,
            revenue: payment.amount,
            paymentMethod: payment.paymentMethod,
            transactionId: payment.transactionId,
            startDate: payment.subscriptionStartDate || payment.createdAt,
            expiresAt: payment.subscriptionEndDate,
            status: payment.paymentStatus,
            createdAt: payment.createdAt,
            paymentDate: payment.paymentDate,
            userId: { name: payment.userId?.name || payment.userName }
        }));
        res.json({ data: formatted });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching subscriptions', error: error.message });
    }
};

// Get consultation revenue
exports.getConsultationRevenue = async (req, res) => {
    try {
        const consultations = await Booking.find({ paymentStatus: 'completed' }, 'date amount createdAt');
        res.json({ data: consultations });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching consultation revenue', error: error.message });
    }
};
