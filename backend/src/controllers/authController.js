const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserAuth, User, Admin, Dietitian, Organization, CorporatePartner } = require('../models/userModel');

// It's CRITICAL to use a strong secret stored in a .env file
require('dotenv').config(); 
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-development';

// Map the Mongoose Profile Model
const PROFILE_MODELS = {
    user: User,
    admin: Admin,
    dietitian: Dietitian,
    organization: Organization,
    corporatepartner: CorporatePartner,
};

// Map the name field to retrieve for the response message
const NAME_FIELDS = {
    user: 'name',
    admin: 'name',
    dietitian: 'name',
    organization: 'organizationName',
    corporatepartner: 'corporatepartnerName',
};

exports.signupController = async (req, res) => {
    // The role is extracted from the URL parameter set by the router
    const role = req.params.role; 
    const { email, password, ...profileData } = req.body;
    
    // 1. Validate role against our supported models
    const ProfileModel = PROFILE_MODELS[role];
    if (!ProfileModel) {
        // This should theoretically not happen if the router is configured correctly
        return res.status(400).json({ message: 'Invalid signup role specified.' });
    }
    
    // Simple data checks
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    try {
        // 2. Check for existing user by email in the central Auth collection
        const existingUser = await UserAuth.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already exists. Please login or use a different email.' });
        }

        // 3. Hash Password (Crucial for security)
        const hashedPassword = await bcrypt.hash(password, 12);

        // 4. Create Role-Specific Profile (Separate Collection)
        const profile = new ProfileModel(profileData);
        await profile.save();

        // 5. Create Central Authentication Record (UserAuth Collection)
        const authUser = new UserAuth({
            email,
            passwordHash: hashedPassword,
            role,
            roleId: profile._id // Link the auth record to the specific profile document
        });
        await authUser.save();

        // 6. Generate JWT (Access Token)
        const token = jwt.sign(
            { userId: authUser._id, role: authUser.role, roleId: authUser.roleId },
            JWT_SECRET,
            { expiresIn: '1h' } 
        );

        // 7. Respond with Success
        const userNameField = NAME_FIELDS[role] || 'name';
        const registeredName = profile[userNameField] || 'New User';
        
        return res.status(201).json({ 
            message: 'Registration successful! Proceed to the next step.',
            name: registeredName,
            token 
        });

    } catch (error) {
        console.error(`Error during ${role} signup:`, error);
        
        if (error.name === 'ValidationError') {
            const errors = {};
            for (const field in error.errors) {
                errors[field] = error.errors[field].message;
            }
            return res.status(400).json({ message: 'Validation failed.', errors });
        }
        if (error.code === 11000) {
            return res.status(409).json({ message: 'License number or email already registered.' });
        }

        res.status(500).json({ message: 'Internal Server Error during registration.' });
    }
};

exports.signinController = async (req, res) => {
    // The role is extracted from the URL parameter set by the router
    const role = req.params.role;
    const { email, password, licenseNumber, adminKey, id, rememberMe } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // 1. Find user in central Auth collection
        const authUser = await UserAuth.findOne({ email });
        if (!authUser || authUser.role !== role) {
            return res.status(401).json({ message: 'Invalid credentials or role mismatch.' });
        }

        // 2. Check Password
        const isMatch = await bcrypt.compare(password, authUser.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password.' });
        }

        // 3. Handle Role-Specific Credentials (e.g., license number verification)
        const ProfileModel = PROFILE_MODELS[role];
        if (ProfileModel) {
            const profile = await ProfileModel.findById(authUser.roleId);

            if (!profile) {
                return res.status(404).json({ message: 'User profile not found.' });
            }

            // Dietitian check
            if (role === 'dietitian' && profile.licenseNumber !== licenseNumber) {
                return res.status(401).json({ message: 'Invalid license number.' });
            }
            // Admin check
            if (role === 'admin' && profile.adminKey !== adminKey) {
                return res.status(401).json({ message: 'Invalid Admin Key.' });
            }
            // Organization/Corporate Partner ID check (using 'id' from frontend form which should match profile name/id field)
            // Note: This assumes 'id' in the frontend maps to 'name' or a specific ID in the profile schema. 
            // For this example, we'll check against the name if 'id' is provided.
            if ((role === 'organization' || role === 'corporatepartner') && profile.name !== req.body.name) {
                // Assuming 'name' field holds the organizational identifier
                 return res.status(401).json({ message: 'Invalid Organization Name or ID.' });
            }
        }

        // 4. Generate JWT
        // Set expiry based on 'rememberMe' flag for a persistent session
        const expiresIn = rememberMe ? '7d' : '1h'; // 7 days vs 1 hour
        
        const token = jwt.sign(
            { userId: authUser._id, role: authUser.role, roleId: authUser.roleId },
            JWT_SECRET,
            { expiresIn } 
        );

        // 5. Respond with token and success
        return res.status(200).json({ 
            message: 'Login successful!',
            token,
            expiresIn 
        });

    } catch (error) {
        console.error(`Error during ${role} signin:`, error);
        res.status(500).json({ message: 'Internal Server Error during login.' });
    }
};
