const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// File Schema (Subdocument for uploaded files)
const FileSchema = new Schema({
    fieldName: { type: String, required: true },
    originalName: { type: String, required: true },
    filename: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number },
    mimetype: { type: String }
}, { _id: true });

// Main Lab Report Schema
const LabReportSchema = new Schema({
    clientId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    clientName: {
        type: String,
        required: true
    },
    submittedCategories: [{
        type: String,
        enum: [
            'Hormonal_Issues',
            'Fitness_Metrics',
            'General_Reports',
            'Blood_Sugar_Focus',
            'Thyroid',
            'Cardiovascular'
        ],
        required: true
    }],
    // Data for each category
    hormonalIssues: {
        testosteroneTotal: { type: Number },
        dheaS: { type: Number },
        cortisol: { type: Number },
        vitaminD: { type: Number }
    },
    fitnessMetrics: {
        heightCm: { type: Number },
        currentWeight: { type: Number },
        bodyFatPercentage: { type: Number },
        activityLevel: {
            type: String,
            enum: ['sedentary', 'light', 'moderate', 'very', 'extra']
        },
        additionalInfo: { type: String }
    },
    generalReports: {
        dateOfReport: { type: Date },
        bmiValue: { type: Number },
        currentWeight: { type: Number },
        heightCm: { type: Number }
    },
    bloodSugarFocus: {
        fastingGlucose: { type: Number },
        hba1c: { type: Number },
        cholesterolTotal: { type: Number },
        triglycerides: { type: Number }
    },
    thyroid: {
        tsh: { type: Number },
        freeT4: { type: Number },
        reverseT3: { type: Number },
        thyroidAntibodies: { type: String }
    },
    cardiovascular: {
        systolicBP: { type: Number },
        diastolicBP: { type: Number },
        spO2: { type: Number },
        restingHeartRate: { type: Number }
    },
    // File uploads
    uploadedFiles: [FileSchema],
    // Status
    status: {
        type: String,
        enum: ['submitted', 'reviewed', 'pending_review'],
        default: 'submitted'
    },
    reviewedBy: {
        dietitianId: { type: Schema.Types.ObjectId, ref: 'Dietitian' },
        dietitianName: { type: String },
        reviewedAt: { type: Date }
    },
    notes: { type: String } // Dietitian notes
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better query performance
LabReportSchema.index({ clientId: 1 });
LabReportSchema.index({ createdAt: -1 });
LabReportSchema.index({ status: 1 });
LabReportSchema.index({ 'reviewedBy.dietitianId': 1 });

// Virtual for formatted submission date
LabReportSchema.virtual('formattedDate').get(function() {
    return this.createdAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
});

const LabReport = mongoose.model('LabReport', LabReportSchema);

module.exports = { LabReport };