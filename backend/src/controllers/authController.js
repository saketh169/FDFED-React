const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserAuth, User, Admin, Dietitian, Organization, CorporatePartner } = require('../models/userModel');

require('dotenv').config(); 
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-development';
// NOTE: ADMIN_SIGNIN_KEY is still loaded, but only for the purpose of the signinController's initial check (if needed).
// If your security requires a hardcoded ENV key for ALL admins, keep this. 
const ADMIN_SIGNIN_KEY = process.env.ADMIN_SIGNIN_KEY || 'Nutri@2025'; 

const PROFILE_MODELS = {
    user: User,
    admin: Admin,
    dietitian: Dietitian,
    organization: Organization,
    corporatepartner: CorporatePartner,
};

const NAME_FIELDS = {
    user: 'name',
    admin: 'name',
    dietitian: 'name',
    organization: 'name',
    corporatepartner: 'name',
};

// Helper function to check for GLOBAL conflicts across ALL profile collections
const checkGlobalConflict = async (field, value, errorMessage) => {
    const models = [User, Admin, Dietitian, Organization, CorporatePartner];
    
    for (const Model of models) {
        const query = {};
        query[field] = value;
        const existing = await Model.findOne(query).lean(); 
        if (existing) {
            return { message: errorMessage };
        }
    }
    return null; // No conflict found
};

// ----------------------------------------------------------------------
// SIGNUP CONTROLLER 
// ----------------------------------------------------------------------

exports.signupController = async (req, res) => {
    const role = req.params.role; 
    // Removed adminKey from destructuring:
    const { email, password, ...profileData } = req.body; 
    
    const ProfileModel = PROFILE_MODELS[role];
    if (!ProfileModel) {
        return res.status(400).json({ message: 'Invalid signup role specified.' });
    }
    
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    try {
        const { name, phone } = profileData;

        // --- 1. CHECK SEQUENCE: Name ---
        if (name) {
            const nameConflict = await checkGlobalConflict('name', name, 
                `The Name "${name}" is already registered.`);
            if (nameConflict) return res.status(409).json(nameConflict);
        }

        // --- 2. CHECK SEQUENCE: Email ---
        const existingUser = await UserAuth.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email address is already registered.' });
        }

        // --- 3. CHECK SEQUENCE: Phone Number ---
        if (phone) {
            const phoneConflict = await checkGlobalConflict('phone', phone, 
                `The Phone Number "${phone}" is already registered.`);
            if (phoneConflict) return res.status(409).json(phoneConflict);
        }
        
        // --- 4. HASH PASSWORD AND SAVE ---
        const hashedPassword = await bcrypt.hash(password, 12);

        // 4a. Create Role-Specific Profile. 
        const profile = new ProfileModel(profileData);
        // This save enforces Name and License uniqueness (role-specific).
        await profile.save(); 

        // 4b. Create Central Authentication Record 
        const authUser = new UserAuth({
            email,
            passwordHash: hashedPassword,
            role,
            roleId: profile._id
        });
        await authUser.save();

        // --- 5. GENERATE JWT AND RESPOND ---
        const token = jwt.sign(
            { userId: authUser._id, role: authUser.role, roleId: authUser.roleId },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        const registeredName = profile.name || 'New Member';
        
        return res.status(201).json({ 
            message: 'Registration successful! Proceed to the next step.',
            name: registeredName,
            token 
        });

    } catch (error) {
        console.error(`Error during ${role} signup:`, error);
        
        // --- 6. ERROR HANDLING ---
        
        if (error.name === 'ValidationError') {
            const errors = {};
            for (const field in error.errors) {
                errors[field] = error.errors[field].message;
            }
            return res.status(400).json({ message: 'Validation failed.', errors });
        }
        
        // Handle MongoDB Unique Index Errors (Code 11000) 
        if (error.code === 11000) {
            let uniqueField = 'A role-specific unique field';
            const match = error.message.match(/index: (.*) dup key/);
            const indexName = match ? match[1] : '';
            
            // Removed 'adminKey' from index check logic:
            if (indexName.includes('licenseNumber')) uniqueField = 'License Number';
            else if (indexName.includes('name')) uniqueField = 'Name';
            else if (indexName.includes('email')) uniqueField = 'Email';

            return res.status(409).json({ message: `${uniqueField} is already registered.` });
        }

        res.status(500).json({ message: 'Internal Server Error during registration.' });
    }
};

// ----------------------------------------------------------------------
// SIGNIN CONTROLLER 
// ----------------------------------------------------------------------

exports.signinController = async (req, res) => {
    const role = req.params.role; 
    // Removed adminKey from destructuring:
    const { email, password, licenseNumber, id, rememberMe } = req.body; 

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

        // 3. Handle Role-Specific Credentials (Verification of License/AdminKey)
        const ProfileModel = PROFILE_MODELS[role];
        if (ProfileModel) {
            const profile = await ProfileModel.findById(authUser.roleId);

            if (!profile) {
                return res.status(404).json({ message: 'User profile not found.' });
            }

            // Role-specific validation for signin
            switch (role) {
                case 'dietitian':
                    if (!licenseNumber || profile.licenseNumber !== licenseNumber) {
                        return res.status(401).json({ message: 'Invalid license number.' });
                    }
                    break;
                case 'admin':
                    // **MODIFIED:** Removed adminKey check entirely, relying on email/password only
                    // If secure ENV key verification is needed, you'd check ADMIN_SIGNIN_KEY here:
                    /*
                    if (!req.body.adminKey || ADMIN_SIGNIN_KEY !== req.body.adminKey) { 
                        return res.status(401).json({ message: 'Invalid Admin Key.' });
                    }
                    */
                    break;
                case 'organization':
                    if (!id || profile.licenseNumber !== id) {
                        return res.status(401).json({ message: 'Invalid Organization ID/License Number.' });
                    }
                    break;
                case 'corporatepartner':
                    if (!id || profile.licenseNumber !== id) {
                        return res.status(401).json({ message: 'Invalid Corporate Partner ID/License Number.' });
                    }
                    break;
            }
        }

        // 4. Generate JWT
        const expiresIn = rememberMe ? '7d' : '1h'; 
        
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