const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Mongoose Models
const { UserAuth, User, Admin, Dietitian, Organization, CorporatePartner } = require('../models/userModel'); 

// Load environment variables
require('dotenv').config(); 
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-development';
const ADMIN_SIGNIN_KEY = process.env.ADMIN_SIGNIN_KEY || 'Nutri@2025'; 

// --- Role Mapping ---
const PROFILE_MODELS = {
    user: User,
    admin: Admin,
    dietitian: Dietitian,
    organization: Organization,
    corporatepartner: CorporatePartner,
};

// --- Helper Function for Global Conflict Check (Name, Phone, etc.) ---
const checkGlobalConflict = async (field, value, errorMessage) => {
    const models = [User, Admin, Dietitian, Organization, CorporatePartner];
    
    if (!value) return null;

    for (const Model of models) {
        const query = {};
        query[field] = value;
        
        const existing = await Model.findOne(query).lean(); 
        if (existing) {
            return { message: errorMessage };
        }
    }
    return null; 
};

// ----------------------------------------------------------------------
// SIGNUP CONTROLLER
// ----------------------------------------------------------------------

exports.signupController = async (req, res) => {
    const role = req.params.role; 
    const { email, password, licenseNumber, ...profileData } = req.body; 
    
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

        // 1. Check Name (Global Conflict)
        if (name) {
            const nameConflict = await checkGlobalConflict('name', name, 
                `The Name "${name}" is already in use by another profile.`);
            if (nameConflict) return res.status(409).json(nameConflict);
        }
        
        // 2. Check Phone Number (Global Conflict)
        if (phone) {
            const phoneConflict = await checkGlobalConflict('phone', phone, 
                `The Phone Number "${phone}" is already registered globally.`);
            if (phoneConflict) return res.status(409).json(phoneConflict);
        }

        // 3. Check Email (Auth Conflict)
        const existingUser = await UserAuth.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email address is already registered.' });
        }
    
        // 4. Check License Number (Required Field Check)
        const rolesWithLicense = ['dietitian', 'organization', 'corporatepartner'];
        if (rolesWithLicense.includes(role) && !licenseNumber) {
             return res.status(400).json({ message: 'License Number is required for this role.' });
        }
        
        // 5. HASH PASSWORD AND SAVE
        const hashedPassword = await bcrypt.hash(password, 12);

        // Save the Role-Specific Profile
        const profile = new ProfileModel({ ...profileData, licenseNumber }); 
        await profile.save(); 

        // Create Central Authentication Record 
        const authUser = new UserAuth({
            email,
            passwordHash: hashedPassword,
            role,
            roleId: profile._id
        });
        await authUser.save();

        // 6. GENERATE JWT AND RESPOND
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
        
        // 7. ERROR HANDLING
        
        // Mongoose Validation Error
        if (error.name === 'ValidationError') {
            const errors = {};
            for (const field in error.errors) {
                errors[field] = error.errors[field].message;
            }
            return res.status(400).json({ message: 'Validation failed.', errors });
        }
        
        // MongoDB Unique Index Errors (Code 11000)
        if (error.code === 11000) {
            let uniqueField = 'A role-specific unique field';
            const match = error.message.match(/index: (.*) dup key/);
            const indexName = match ? match[1] : '';
            
            if (indexName.includes('name')) uniqueField = 'Name';
            else if (indexName.includes('email')) uniqueField = 'Email';
            else if (indexName.includes('licenseNumber')) uniqueField = 'License Number';
            
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
    const { email, password, licenseNumber, adminKey, rememberMe } = req.body; 

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

        // 3. Handle Role-Specific Credentials
        const ProfileModel = PROFILE_MODELS[role];
        if (ProfileModel) {
            const profile = await ProfileModel.findById(authUser.roleId);

            if (!profile) {
                return res.status(404).json({ message: 'User profile not found.' });
            }

            // Role-specific validation for signin
            switch (role) {
                case 'dietitian':
                case 'organization': 
                case 'corporatepartner': 
                    if (!licenseNumber || profile.licenseNumber !== licenseNumber) {
                        return res.status(401).json({ message: `Invalid ${role} License Number.` });
                    }
                    break;
                case 'admin':
                    // **NEW: Validate Admin Key from environment variable**
                    if (!adminKey || adminKey !== ADMIN_SIGNIN_KEY) {
                        return res.status(401).json({ message: 'Invalid Admin Key.' });
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