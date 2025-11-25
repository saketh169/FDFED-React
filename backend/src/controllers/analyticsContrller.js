const { User, Dietitian, Organization, CorporatePartner } = require('../models/userModel');
const Booking = require('../models/bookingModel');
const MealPlan = require('../models/mealPlanModel');

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

// Get subscriptions (placeholder - using MealPlan as subscription)
exports.getSubscriptions = async (req, res) => {
    try {
        // Assuming MealPlan represents subscriptions
        const subscriptions = await MealPlan.find({})
            .populate('userId', 'name')
            .select('planName dietType calories createdAt userId');
        // Format to match frontend expectation
        const formatted = subscriptions.map(sub => ({
            _id: sub._id,
            name: sub.planName, // plan name
            billingType: 'monthly', // placeholder
            createdAt: sub.createdAt,
            amount: sub.calories * 0.1, // placeholder amount
            paymentMethod: 'UPI', // placeholder
            transactionId: sub._id.toString(),
            expiresAt: new Date(sub.createdAt.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days later
            status: 'success',
            userId: { name: sub.userId.name }
        }));
        res.json({ data: formatted });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching subscriptions', error: error.message });
    }
};

// Get consultation revenue
exports.getConsultationRevenue = async (req, res) => {
    try {
        const consultations = await Booking.find({ paymentStatus: 'completed' }, 'date amount');
        res.json({ data: consultations });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching consultation revenue', error: error.message });
    }
};
