// 2FA FUNCTIONALITY COMMENTED OUT - 2FA DISABLED

// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { UserAuth, User, Admin, Dietitian, Organization, CorporatePartner } = require('../models/userModel');
// const twoFAService = require('../services/twoFAService');

// require('dotenv').config();
// const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-development';
// const ADMIN_SIGNIN_KEY = process.env.ADMIN_SIGNIN_KEY || 'Nutri@2025';

// // Role Mapping
// const PROFILE_MODELS = {
//     user: User,
//     admin: Admin,
//     dietitian: Dietitian,
//     organization: Organization,
//     corporatepartner: CorporatePartner,
// };

// // ----------------------------------------------------------------------
// // SEND 2FA PIN CONTROLLER
// // ----------------------------------------------------------------------

// exports.send2FAPINController = async (req, res) => {
//     const role = req.params.role;
//     const { email, password, licenseNumber, adminKey } = req.body;

//     if (!email || !password) {
//         return res.status(400).json({ message: 'Email and password are required.' });
//     }

//     // Validate role
//     const validRoles = ['user', 'admin', 'dietitian', 'organization', 'corporatepartner'];
//     if (!validRoles.includes(role)) {
//         return res.status(400).json({ message: 'Invalid role specified.' });
//     }

//     try {
//         // 1. Find user in central Auth collection
//         const authUser = await UserAuth.findOne({ email });
//         if (!authUser || authUser.role !== role) {
//             return res.status(401).json({ message: 'Invalid credentials or role mismatch.' });
//         }

//         // 2. Check Password
//         const isMatch = await bcrypt.compare(password, authUser.passwordHash);
//         if (!isMatch) {
//             return res.status(401).json({ message: 'Invalid password.' });
//         }

//         // 3. Handle Role-Specific Credentials
//         const ProfileModel = PROFILE_MODELS[role];
//         let userName = 'User';

//         if (ProfileModel) {
//             const profile = await ProfileModel.findById(authUser.roleId);

//             if (!profile) {
//                 return res.status(404).json({ message: 'User profile not found.' });
//             }

//             // Get user name for email personalization
//             userName = profile.name || 'User';

//             // Role-specific validation
//             switch (role) {
//                 case 'dietitian':
//                 case 'organization':
//                 case 'corporatepartner':
//                     if (!licenseNumber || profile.licenseNumber !== licenseNumber) {
//                         return res.status(401).json({ message: `Invalid ${role} License Number.` });
//                     }
//                     break;
//                 case 'admin':
//                     if (!adminKey || adminKey !== ADMIN_SIGNIN_KEY) {
//                         return res.status(401).json({ message: 'Invalid Admin Key.' });
//                     }
//                     break;
//             }
//         }

//         // 4. Send 2FA PIN to email
//         const pinResult = await twoFAService.send2FAPIN(email, userName);

//         if (pinResult.success) {
//             return res.status(200).json({
//                 message: '2FA PIN sent successfully to your email. Please check your inbox.',
//                 email: email,
//                 role: role,
//                 requires2FA: true
//             });
//         } else {
//             console.error('2FA PIN sending failed:', pinResult.error);
//             return res.status(500).json({
//                 message: 'Failed to send 2FA PIN. Please try again later.'
//             });
//         }

//     } catch (error) {
//         console.error('Error in send 2FA PIN:', error);
//         res.status(500).json({ message: 'Internal server error. Please try again.' });
//     }
// };

// // ----------------------------------------------------------------------
// // VERIFY 2FA PIN CONTROLLER
// // ----------------------------------------------------------------------

// exports.verify2FAPINController = async (req, res) => {
//     const role = req.params.role;
//     const { email, pin, rememberMe } = req.body;

//     if (!email || !pin) {
//         return res.status(400).json({
//             message: 'Email and PIN are required.'
//         });
//     }

//     // Validate role
//     const validRoles = ['user', 'admin', 'dietitian', 'organization', 'corporatepartner'];
//     if (!validRoles.includes(role)) {
//         return res.status(400).json({ message: 'Invalid role specified.' });
//     }

//     try {
//         // 1. Verify PIN first
//         const pinVerification = twoFAService.verify2FAPIN(email, pin);

//         if (!pinVerification.success) {
//             return res.status(400).json({ message: pinVerification.message });
//         }

//         // 2. Find user in central Auth collection
//         const authUser = await UserAuth.findOne({ email, role });
//         if (!authUser) {
//             return res.status(404).json({
//                 message: `No ${role} account found with this email address.`
//             });
//         }

//         // 3. Generate JWT
//         const expiresIn = rememberMe ? '7d' : '1d';

//         const token = jwt.sign(
//             { userId: authUser._id, role: authUser.role, roleId: authUser.roleId },
//             JWT_SECRET,
//             { expiresIn }
//         );

//         // 4. Respond with token and success
//         return res.status(200).json({
//             message: 'Login successful!',
//             token,
//             role: authUser.role,
//             roleId: authUser.roleId,
//             expiresIn,
//             success: true
//         });

//     } catch (error) {
//         console.error('Error in verify 2FA PIN:', error);
//         res.status(500).json({ message: 'Internal server error. Please try again.' });
//     }
// };
