const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// --- 1. CENTRAL AUTHENTICATION SCHEMA (Email is Globally Unique) ---
const UserAuthSchema = new Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['user', 'admin', 'dietitian', 'organization', 'corporatepartner'],
        required: true 
    },
    roleId: { type: Schema.Types.ObjectId, required: true } 
}, { timestamps: true });


// --- 2. ROLE-SPECIFIC PROFILE SCHEMAS (Name and License are Role-Unique) ---

// 2a. Standard User Profile
const UserSchema = new Schema({
    name: { type: String, required: true, minlength: 5, unique: true, trim: true }, // ROLE-SPECIFIC UNIQUE
    email: { type: String, required: true, lowercase: true, trim: true }, // Email from UserAuth
    phone: { type: String, required: true, minlength: 10, maxlength: 10 }, // Global check in Controller
    dob: { type: Date, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    address: { type: String, required: true, maxlength: 200 },
    profileImage: { type: Buffer },
}, { timestamps: true });

// 2b. Admin Profile (adminKey REMOVED)
const AdminSchema = new Schema({
    name: { type: String, required: true, minlength: 5, unique: true, trim: true }, // ROLE-SPECIFIC UNIQUE
    email: { type: String, required: true, lowercase: true, trim: true }, // Email from UserAuth
    phone: { type: String, required: true, minlength: 10, maxlength: 10 }, // Global check in Controller
    dob: { type: Date, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    address: { type: String, required: true, maxlength: 200 },
    profileImage: { type: Buffer },
}, { timestamps: true });

// 2c. Dietitian Profile
const DietitianSchema = new Schema({
    name: { type: String, required: true, minlength: 5, unique: true, trim: true }, // ROLE-SPECIFIC UNIQUE
    email: { type: String, required: true, lowercase: true, trim: true }, // Email from UserAuth
    age: { type: Number, required: true, min: 18 },
    phone: { type: String, required: true, minlength: 10, maxlength: 10 }, // Global check in Controller
    licenseNumber: { type: String, required: true, unique: true, match: /^DLN[0-9]{6}$/ }, // ROLE-SPECIFIC UNIQUE
    documents: { type: Schema.Types.Mixed, default: {} }, // Store document metadata
    documentUploadStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
    lastDocumentUpdate: { type: Date, default: null },
    profileImage: { type: Buffer },
}, { timestamps: true });

// 2d. Organization Profile
const OrganizationSchema = new Schema({
    name: { type: String, required: true, minlength: 5, unique: true, trim: true }, // ROLE-SPECIFIC UNIQUE
    email: { type: String, required: true, lowercase: true, trim: true }, // Email from UserAuth
    phone: { type: String, required: true, minlength: 10, maxlength: 10 }, // Global check in Controller
    licenseNumber: { type: String, required: true, unique: true, match: /^OLN[0-9]{6}$/ }, // ROLE-SPECIFIC UNIQUE
    address: { type: String, required: true, maxlength: 200 },
    documents: { type: Schema.Types.Mixed, default: {} }, // Store document metadata
    documentUploadStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
    lastDocumentUpdate: { type: Date, default: null },
    profileImage: { type: Buffer },
}, { timestamps: true });

// 2e. Corporate Partner Profile
const CorporatePartnerSchema = new Schema({
    name: { type: String, required: true, minlength: 5, unique: true, trim: true }, // ROLE-SPECIFIC UNIQUE
    email: { type: String, required: true, lowercase: true, trim: true }, // Email from UserAuth
    phone: { type: String, required: true, minlength: 10, maxlength: 10 }, // Global check in Controller
    licenseNumber: { type: String, required: true, unique: true, match: /^CLN[0-9]{6}$/ }, // ROLE-SPECIFIC UNIQUE
    address: { type: String, required: true, maxlength: 200 },
    documents: { type: Schema.Types.Mixed, default: {} }, // Store document metadata
    documentUploadStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
    lastDocumentUpdate: { type: Date, default: null },
    profileImage: { type: Buffer },
}, { timestamps: true });


module.exports = {
    UserAuth: mongoose.model('UserAuth', UserAuthSchema),
    User: mongoose.model('User', UserSchema),
    Admin: mongoose.model('Admin', AdminSchema),
    Dietitian: mongoose.model('Dietitian', DietitianSchema),
    Organization: mongoose.model('Organization', OrganizationSchema),
    CorporatePartner: mongoose.model('CorporatePartner', CorporatePartnerSchema)
};