const mongoose = require('mongoose');
const { Dietitian, Organization, CorporatePartner } = require('../models/userModel');

// Middleware for dietitian-only access
function ensureDietitianAuthenticated(req, res, next) {
  console.log('Session check (ensureDietitianAuthenticated):', req.session);
  if (req.session.dietitian && mongoose.isValidObjectId(req.session.dietitian.id)) {
    return next();
  }
  return res.status(401).json({ success: false, message: 'Unauthorized: Dietitian access required' });
}

// Middleware for organization-only access
function ensureOrganizationAuthenticated(req, res, next) {
  console.log('Session check (ensureOrganizationAuthenticated):', req.session);
  if (req.session.organization && mongoose.isValidObjectId(req.session.organization.id)) {
    return next();
  }
  return res.status(401).json({ success: false, message: 'Unauthorized: Organization access required' });
}

// Middleware for corporate partner-only access
function ensureCorporatePartnerAuthenticated(req, res, next) {
  console.log('Session check (ensureCorporatePartnerAuthenticated):', req.session);
  if (req.session.corporatePartner && mongoose.isValidObjectId(req.session.corporatePartner.id)) {
    return next();
  }
  return res.status(401).json({ success: false, message: 'Unauthorized: Corporate Partner access required' });
}

// Middleware to validate MongoDB ObjectId for dietitian
function validateDietitianObjectId(req, res, next) {
  const { dietitianId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(dietitianId)) {
    return res.status(400).json({ success: false, message: 'Invalid dietitian ID' });
  }
  next();
}

// Middleware to validate MongoDB ObjectId for organization
function validateOrganizationObjectId(req, res, next) {
  const { orgId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(orgId)) {
    return res.status(400).json({ success: false, message: 'Invalid organization ID' });
  }
  next();
}

// Middleware to validate MongoDB ObjectId for corporate partner
function validateCorporateObjectId(req, res, next) {
  const { cpId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(cpId)) {
    return res.status(400).json({ success: false, message: 'Invalid corporate partner ID' });
  }
  next();
}

// Middleware to handle Multer errors
function handleMulterError(err, req, res, next) {
    if (err instanceof require('multer').MulterError) {
        console.error('Multer Error:', err);
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                success: false,
                message: `Unexpected field: ${err.field}. Expected fields: resume, degreeCertificate, licenseDocument, idProof, experienceCertificates, specializationCertifications, internshipCertificate, researchPapers, finalReport`,
            });
        }
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: `File too large. Maximum size allowed is ${err.field === 'finalReport' ? '5MB' : '5MB'}.`,
            });
        }
        return res.status(400).json({
            success: false,
            message: `Multer error: ${err.message}`,
        });
    } else if (err.message === 'Invalid file type. Only PDF is allowed.') {
        console.error('File type error:', err.message);
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
    next(err);
}

module.exports = {
    ensureDietitianAuthenticated,
    ensureOrganizationAuthenticated,
    ensureCorporatePartnerAuthenticated,
    validateDietitianObjectId,
    validateOrganizationObjectId,
    validateCorporateObjectId,
    handleMulterError
};