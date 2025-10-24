const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// --- 1. CENTRAL AUTHENTICATION SCHEMA ---
// This schema is used for login, password storage, and linking to the specific role profile.
const UserAuthSchema = new Schema({
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['user', 'admin', 'dietitian', 'organization', 'corporatepartner'],
        required: true 
    },
    // The roleId links to the specific profile document (e.g., in the 'dietitians' collection)
    roleId: { type: Schema.Types.ObjectId, required: true } 
}, { timestamps: true });


// --- 2. ROLE-SPECIFIC PROFILE SCHEMAS ---

// 2a. Standard User Profile
const UserSchema = new Schema({
    name: { type: String, required: true, minlength: 5 },
    phone: { type: String, required: true, minlength: 10, maxlength: 10 },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    address: { type: String, required: true, maxlength: 200 },
}, { timestamps: true });

// 2b. Admin Profile (Minimal, focused on access)
const AdminSchema = new Schema({
    name: { type: String, required: true, minlength: 5 },
    adminKey: { type: String, required: true }, // Should be verified server-side
    phone: { type: String, required: true, minlength: 10, maxlength: 10 },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    address: { type: String, required: true, maxlength: 200 },
}, { timestamps: true });

// 2c. Dietitian Profile
const DietitianSchema = new Schema({
    name: { type: String, required: true, minlength: 5 },
    age: { type: Number, required: true, min: 18 },
    phone: { type: String, required: true, minlength: 10, maxlength: 10 },
    licenseNumber: { type: String, required: true, unique: true, match: /^DLN[0-9]{6}$/ },
    // Fields for documents will be added later, typically a URL array.
}, { timestamps: true });

// 2d. Organization Profile
const OrganizationSchema = new Schema({
    name: { type: String, required: true, minlength: 5 },
    phone: { type: String, required: true, minlength: 10, maxlength: 10 },
    licenseNumber: { type: String, required: true, unique: true, match: /^OLN[0-9]{6}$/ },
    address: { type: String, required: true, maxlength: 200 },
});

// 2e. Corporate Partner Profile
const CorporatePartnerSchema = new Schema({
    name: { type: String, required: true, minlength: 5 },
    phone: { type: String, required: true, minlength: 10, maxlength: 10 },
    licenseNumber: { type: String, required: true, unique: true, match: /^CLN[0-9]{6}$/ },
    address: { type: String, required: true, maxlength: 200 },
});


module.exports = {
    UserAuth: mongoose.model('UserAuth', UserAuthSchema),
    User: mongoose.model('User', UserSchema),
    Admin: mongoose.model('Admin', AdminSchema),
    Dietitian: mongoose.model('Dietitian', DietitianSchema),
    Organization: mongoose.model('Organization', OrganizationSchema),
    CorporatePartner: mongoose.model('CorporatePartner', CorporatePartnerSchema)
};
