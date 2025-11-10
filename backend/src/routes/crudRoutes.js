const express = require('express');
const router = express.Router();
const {
    getUsersByRole,
    removeUser,
    getRemovedAccounts,
    restoreAccount,
    getUserDetails,
    permanentDeleteAccount
} = require('../controllers/crudController');

// Middleware to check admin authentication
const requireAdmin = (req, res, next) => {
    // Check for admin token in header or session
    const token = req.headers.authorization?.replace('Bearer ', '') ||
                  req.headers['admin-auth-token'];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Admin authentication required' });
    }

    // In a real implementation, you'd verify the JWT token here
    // For now, we'll just check if it exists
    if (token === 'admin-token-placeholder') {
        return next();
    }

    // You can add more sophisticated token verification here
    next(); // Temporarily allow all requests for development
};

// Apply admin middleware to all routes
router.use(requireAdmin);

// Get all users by role (with optional search)
router.get('/:role-list', getUsersByRole);
router.get('/:role-list/search', getUsersByRole); // Alternative search endpoint

// Get user details
router.get('/:role-list/:id', getUserDetails);

// Remove a user
router.delete('/:role-list/:id', removeUser);

// Get removed accounts
router.get('/removed-accounts', getRemovedAccounts);
router.get('/removed-accounts/search', getRemovedAccounts); // Alternative search endpoint

// Restore a removed account
router.post('/removed-accounts/:id/restore', restoreAccount);

// Permanently delete a removed account
router.delete('/removed-accounts/:id', permanentDeleteAccount);

module.exports = router;