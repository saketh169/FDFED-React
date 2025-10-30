import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

// --- Color constants ---
const primaryGreen = '#1E6F5C';
const lightGreen = '#6a994e';

// --- Helper Functions for RHF/Yup Validation ---

/**
 * Creates a Yup schema mixin for file validation (size, type).
 * Can be made required/optional based on config.
 */
const fileValidation = (fieldConfig) => {
  const { label, accept, maxSize, required } = fieldConfig;
  let schema = Yup.mixed();

  if (required) {
    schema = schema.required(`Please upload your ${label.toLowerCase()}.`);
  } else {
    // Allows optional fields to be null/undefined/empty
    schema = schema.nullable().notRequired();
  }

  // --- Core Validation Tests ---
  schema = schema
    .test(
      'is-file-object',
      `Please upload your ${label.toLowerCase()}.`,
      (value) => {
        // If not required and no value, pass. Otherwise, if value exists, it must be a File object or null/undefined
        if (!required && !value) return true;
        return value instanceof File || value === null || value === undefined;
      }
    )
    .test(
      'file-size',
      `${label} file size exceeds ${(maxSize / (1024 * 1024)).toFixed(0)} MB.`,
      (value) => {
        if (!value) return true; // Checked by previous tests
        return value.size <= maxSize;
      }
    )
    .test(
      'file-type',
      `Invalid file type. Allowed: ${accept.replace(/\./g, ' ')}.`,
      (value) => {
        if (!value) return true;
        const ext = '.' + value.name.split('.').pop()?.toLowerCase();
        const allowed = accept.split(',').map((a) => a.trim().toLowerCase());
        return allowed.includes(ext);
      }
    );

  return schema;
};

/**
 * Builds the Yup validation schema dynamically based on the role and form configuration.
 */
const buildDocUploadValidationSchema = (role, formConfig) => {
  const config = formConfig[role] || [];
  let schemaFields = {};

  config.forEach((field) => {
    if (field.type === 'select') {
      let selectSchema = Yup.string();

      if (field.required) {
        selectSchema = selectSchema.required(`Please select your ${field.label.toLowerCase()}.`);
      } else {
        selectSchema = selectSchema.nullable().notRequired();
      }

      schemaFields[field.id] = selectSchema;
    } else if (field.type === 'file') {
      if (field.dependsOn) {
        // Handle conditionally required file fields
        const fileSchema = fileValidation({ ...field, required: false }).when(
          field.dependsOn,
          {
            is: (val) => val && val !== '', // If the select field has a value
            then: () => fileValidation(field), // Make it required
            otherwise: () => fileValidation({ ...field, required: false }), // Keep it optional
          }
        );
        schemaFields[field.id] = fileSchema;
      } else {
        // Handle always required/optional independent file fields
        schemaFields[field.id] = fileValidation(field);
      }
    }
  });

  return Yup.object().shape(schemaFields);
};

// --- Initial Form Values Based on Role ---
const getInitialValues = (role, formConfig) => {
  const config = formConfig[role] || [];
  return config.reduce(
    (acc, field) => ({
      ...acc,
      [field.id]: field.type === 'file' ? null : '', // null for file objects, empty string for selects
    }),
    {}
  );
};


// SelectField Component (Modified for RHF register and Tailwind fix)
const SelectField = ({ id, label, options, required, error, colSpan, register }) => (
  <div className={`relative animate-slide-in ${colSpan ? 'lg:col-span-2' : ''}`}>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
      {label}
      {!required && <span className="ml-1 text-xs text-gray-500 font-medium">(Optional)</span>}
    </label>
    <div className="relative">
      <select
        id={id}
        // FIX: Ensuring Tailwind dynamic color references use bracket notation
        className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[${lightGreen}] transition-all duration-300 appearance-none bg-white shadow-sm hover:shadow-md ${error ? 'border-red-500' : ''}`}
        required={required}
        aria-invalid={!!error}
        aria-describedby={`${id}-error`}
        {...register(id)} // RHF registration
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            hidden={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    </div>
    {error && (
      <p id={`${id}-error`} className="text-red-500 text-sm mt-2">{error.message}</p>
    )}
  </div>
);

// FileUploadField Component
const FileUploadField = ({
  id,
  label,
  accept,
  maxSize,
  required,
  disabled,
  error,
  colSpan,
  // RHF Controller props
  field: { onChange, value }, // value is the File object or null
}) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState(''); // size or type error

  const file = value;

  const clearLocalError = () => {
    setLocalError('');
  };

  const validateFile = (f) => {
    if (!f) return true;

    // Size check
    if (f.size > maxSize) {
      const mb = (maxSize / (1024 * 1024)).toFixed(0);
      setLocalError(`${label} file size exceeds ${mb} MB.`);
      return false;
    }

    // Type check
    const ext = '.' + f.name.split('.').pop()?.toLowerCase();
    const allowed = accept.split(',').map(a => a.trim().toLowerCase());
    if (!allowed.includes(ext)) {
      setLocalError(`Invalid file type. Allowed: ${accept.replace(/\./g, ' ')}.`);
      return false;
    }

    return true;
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    clearLocalError();
    if (f && !validateFile(f)) {
      onChange(null); // Set RHF value to null on local error
      // FIX: Clear the file input element value when a local error occurs
      if (fileInputRef.current) fileInputRef.current.value = ''; 
      return;
    }
    onChange(f || null); // Pass File object or null to RHF
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    clearLocalError();
    if (f && !validateFile(f)) {
      onChange(null);
      // FIX: Clear the file input element value when a local error occurs
      if (fileInputRef.current) fileInputRef.current.value = ''; 
      return;
    }
    onChange(f || null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemove = () => {
    onChange(null); // Clear RHF value
    clearLocalError();
    if (fileInputRef.current) fileInputRef.current.value = ''; // Reset file input element
  };

  const getFileIcon = (fileName) => {
    const extension = fileName?.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') {
      return (
        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 2a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6H6zm4 14h-2v-2h2v2zm0-4h-2v-2h2v2zm4 4h-2v-2h2v2zm0-4h-2v-2h2v2zm4 4h-2v-4h2v4z"/>
        </svg>
      );
    } else if (['jpg', 'jpeg', 'png'].includes(extension)) {
      return (
        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4 4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2H4zm14 12H6v-2h12v2zm0-4H6v-2h12v2zm0-4V6H6v2h12z"/>
        </svg>
      );
    }
    return null;
  };

  return (
    <div className={`relative animate-slide-in ${colSpan ? 'lg:col-span-2' : ''}`}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {!required && <span className="ml-1 text-xs text-gray-500 font-medium">(Optional)</span>}
      </label>
      <div
        className={`w-full p-4 border-2 border-dashed rounded-lg transition-all duration-300 ${
          isDragging && !disabled ? 'border-[#6a994e] bg-green-50' : 'border-gray-300 bg-white'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-[#6a994e] hover:shadow-md'} 
        ${localError || error ? 'border-red-400' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="region"
        aria-label={`Upload ${label}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {file ? (
              <>
                {getFileIcon(file.name)}
                <span className="text-sm text-gray-700 truncate max-w-xs">{file.name}</span>
                <span className="text-xs text-gray-500">({(file.size / (1024*1024)).toFixed(2)} MB)</span>
              </>
            ) : (
              <span className="text-sm text-gray-500">
                Drag and drop {label.toLowerCase()} here
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              disabled
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#28B463] text-white hover:bg-[#1E8449]'
            }`}
            disabled={disabled}
          >
            Browse
          </button>
        </div>
        <input
          id={id}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          ref={fileInputRef}
          disabled={disabled}
          aria-invalid={!!error || !!localError}
          aria-describedby={`${id}-error`}
        />
        {file && (
          <button
            type="button"
            onClick={handleRemove}
            className="mt-2 text-sm text-red-500 hover:text-red-700 underline"
          >
            Remove File
          </button>
        )}
      </div>
      {(localError || error) && (
        <p id={`${id}-error`} className="text-red-500 text-sm mt-2">
          {localError || (error ? error.message : '')}
        </p>
      )}
    </div>
  );
};

// RoleSelector Component (Unchanged)
const RoleSelector = ({ validRoles, navigate }) => (
  <div className="text-center p-4 sm:p-5 animate-slide-in">
    <h3 className="text-xl text-gray-700 font-semibold mb-4">Please select a role to upload documents.</h3>
    <div className="flex justify-center gap-3 sm:gap-4 flex-wrap">
      {validRoles.map((r) => (
        <button
          key={r}
          onClick={() => navigate(`/upload-documents?role=${r}`, { replace: true })}
          className="bg-[#28B463] hover:bg-[#1E8449] text-white font-bold py-2 px-4 rounded-md shadow-lg transition-all duration-300 hover:shadow-xl"
        >
          {r.charAt(0).toUpperCase() + r.slice(1)}
        </button>
      ))}
    </div>
  </div>
);

// FormFields Component (Unchanged logic)
const FormFields = ({ role, formConfig, errors, control, register, watch }) => (
  <div className="grid gap-4 lg:grid-cols-2 w-full max-w-7xl mx-auto">
    {formConfig[role].map((field) => (
      field.type === 'select' ? (
        <SelectField
          key={field.id}
          id={field.id}
          label={field.label}
          options={field.options}
          required={field.required}
          error={errors[field.id]}
          colSpan={field.colSpan}
          register={register} // Pass RHF register
        />
      ) : (
        <Controller // Wrap FileUploadField in Controller
          key={field.id}
          name={field.id}
          control={control}
          render={({ field }) => (
            <FileUploadField
              id={field.id}
              label={field.label}
              accept={field.accept}
              maxSize={field.maxSize}
              required={field.required}
              // Dependency logic using RHF watch
              disabled={field.dependsOn ? !watch(field.dependsOn) : field.disabled}
              error={errors[field.id]}
              colSpan={field.colSpan}
              field={field} // Pass the RHF field object
            />
          )}
        />
      )
    ))}
  </div>
);

// FormActions Component (Unchanged)
const FormActions = ({ isLoading }) => (
  <div>
    <button
      type="submit"
      disabled={isLoading}
      // FIX: Ensuring Tailwind dynamic color references use bracket notation
      className={`w-full bg-[${primaryGreen}] text-white font-semibold py-3 rounded-lg hover:bg-[#155345] transition-all duration-300 shadow-md hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z" />
          </svg>
          Submitting...
        </>
      ) : (
        'Submit Documents'
      )}
    </button>
  </div>
);

// FormContainer Component (Unchanged)
const FormContainer = ({ role, children, navigate }) => (
  <section className="flex items-center justify-center bg-gray-100 p-2 sm:p-3 min-h-screen">
    <div className="w-full max-w-7xl p-4 sm:p-5 mx-auto rounded-3xl shadow-2xl bg-white relative animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-3 left-3 text-[#1E6F5C] hover:text-[#155345] text-xl transition-colors"
        aria-label="Go back"
      >
        <i className="fas fa-times"></i>
      </button>
      <h2 className="text-center text-3xl font-bold text-[#1E6F5C] mb-4">
        UPLOAD DOCUMENTS {role ? `- ${role.charAt(0).toUpperCase() + role.slice(1)}` : ''}
      </h2>
      {children}
    </div>
  </section>
);

// Main DocUpload Component (Unchanged logic)
const DocUpload = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validRoles = useMemo(() => ['dietitian', 'organization', 'corporatepartner'], []);

  const formConfig = useMemo(
    () => ({
      dietitian: [
        { id: 'interestedField', label: 'Interested In', type: 'select', options: [{ value: '', label: 'Select your role', disabled: true }, { value: 'weight_loss_gain', label: 'Weight Loss/Gain' }, { value: 'diabetes_thyroid_management', label: 'Diabetes/Thyroid Management' }, { value: 'cardiac_health', label: 'Cardiac Health' }, { value: 'women_health', label: 'Women Health' }, { value: 'skin_hair_care', label: 'Skin and Hair Care' }, { value: 'gut_digestive_health', label: 'Gut/Digestive Health' }], required: true },
        { id: 'resume', label: 'Resume (PDF, max 5MB)', type: 'file', accept: '.pdf', maxSize: 5 * 1024 * 1024, required: true, disabled: true, dependsOn: 'interestedField' },
        { id: 'degreeType', label: 'Degree Type', type: 'select', options: [{ value: '', label: 'Select your degree', disabled: true }, { value: 'bsc', label: 'B.Sc. in Nutrition/Dietetics' }, { value: 'msc', label: 'M.Sc. in Nutrition/Dietetics' }, { value: 'food_science', label: 'B.Sc./M.Sc. in Food Science' }, { value: 'other', label: 'Other' }], required: true },
        { id: 'degreeCertificate', label: 'Degree Certificate (PDF, max 5MB)', type: 'file', accept: '.pdf', maxSize: 5 * 1024 * 1024, required: true, disabled: true, dependsOn: 'degreeType' },
        { id: 'licenseIssuer', label: 'License Issued By', type: 'select', options: [{ value: '', label: 'Select license issuer', disabled: true }, { value: 'ida', label: 'Indian Dietetic Association (IDA)' }, { value: 'cdr', label: 'Commission on Dietetic Registration (U.S.)' }, { value: 'other', label: 'Other' }], required: true },
        { id: 'licenseDocument', label: 'License Document (PDF, max 5MB)', type: 'file', accept: '.pdf', maxSize: 5 * 1024 * 1024, required: true, disabled: true, dependsOn: 'licenseIssuer' },
        { id: 'idProofType', label: 'Government ID Proof Type', type: 'select', options: [{ value: '', label: 'Select ID proof type', disabled: true }, { value: 'passport', label: 'Passport' }, { value: 'aadhaar', label: 'Aadhaar Card' }, { value: 'driver_license', label: "Driver's License" }, { value: 'other', label: 'Other' }], required: true },
        { id: 'idProof', label: 'Government ID Proof (PDF/Image, max 2MB)', type: 'file', accept: '.pdf,.jpg,.png', maxSize: 2 * 1024 * 1024, required: true, disabled: true, dependsOn: 'idProofType' },
        { id: 'specializationDomain', label: 'Specialization Domain', type: 'select', options: [{ value: '', label: 'Select specialization domain', disabled: true }, { value: 'sports_nutrition', label: 'Sports Nutrition' }, { value: 'pediatric_nutrition', label: 'Pediatric Nutrition' }, { value: 'weight_management', label: 'Weight Management' }, { value: 'other', label: 'Other' }], required: false },
        { id: 'specializationCertifications', label: 'Specialization Certifications (PDF, max 5MB)', type: 'file', accept: '.pdf', maxSize: 5 * 1024 * 1024, required: false, disabled: true, dependsOn: 'specializationDomain' },
        { id: 'experienceCertificates', label: 'Experience Certificates (PDF, max 5MB)', type: 'file', accept: '.pdf', maxSize: 5 * 1024 * 1024, required: false, colSpan: 2 },
        { id: 'internshipCertificate', label: 'Internship Completion Certificate (PDF, max 5MB)', type: 'file', accept: '.pdf', maxSize: 5 * 1024 * 1024, required: false, colSpan: 2 },
        { id: 'researchPapers', label: 'Research Papers/Publications (PDF, max 5MB)', type: 'file', accept: '.pdf', maxSize: 5 * 1024 * 1024, required: false, colSpan: 2 },
      ],
      organization: [
        { id: 'orgLogo', label: 'Organization Logo (Image, max 20MB)', type: 'file', accept: '.jpg,.png,.jpeg', maxSize: 20 * 1024 * 1024, required: true },
        { id: 'orgBrochure', label: 'Organization Brochure (PDF, max 20MB)', type: 'file', accept: '.pdf', maxSize: 20 * 1024 * 1024, required: false },
        { id: 'legalDocumentType', label: 'Legal Document Type', type: 'select', options: [{ value: '', label: 'Select legal document type', disabled: true }, { value: 'certificateOfIncorporation', label: 'Certificate of Incorporation' }, { value: 'articlesOfAssociation', label: 'Articles of Association' }, { value: 'memorandumOfAssociation', label: 'Memorandum of Association' }], required: true },
        { id: 'legalDocument', label: 'Legal Document (PDF, max 20MB)', type: 'file', accept: '.pdf', maxSize: 20 * 1024 * 1024, required: true, disabled: true, dependsOn: 'legalDocumentType' },
        { id: 'taxDocumentType', label: 'Tax Document Type', type: 'select', options: [{ value: '', label: 'Select tax document type', disabled: true }, { value: 'gstCertificate', label: 'GST Certificate' }, { value: 'panCard', label: 'PAN Card' }, { value: 'tinCertificate', label: 'TIN Certificate' }], required: true },
        { id: 'taxDocument', label: 'Tax Document (PDF, max 20MB)', type: 'file', accept: '.pdf', maxSize: 20 * 1024 * 1024, required: true, disabled: true, dependsOn: 'taxDocumentType' },
        { id: 'businessLicenseType', label: 'Business License Type', type: 'select', options: [{ value: '', label: 'Select business license type', disabled: true }, { value: 'generalLicense', label: 'General Business License' }, { value: 'industrySpecificLicense', label: 'Industry-Specific License' }], required: true },
        { id: 'businessLicense', label: 'Business License (PDF, max 20MB)', type: 'file', accept: '.pdf', maxSize: 20 * 1024 * 1024, required: true, disabled: true, dependsOn: 'businessLicenseType' },
        { id: 'authorizedRepIdType', label: 'Identity Proof Type', type: 'select', options: [{ value: '', label: 'Select identity proof type', disabled: true }, { value: 'aadhaarCard', label: 'Aadhaar Card' }, { value: 'passport', label: 'Passport' }, { value: 'driversLicense', label: "Driver's License" }], required: true },
        { id: 'authorizedRepId', label: 'Identity Proof (PDF/Image, max 20MB)', type: 'file', accept: '.pdf,.jpg,.png', maxSize: 20 * 1024 * 1024, required: true, disabled: true, dependsOn: 'authorizedRepIdType' },
        { id: 'addressProofType', label: 'Proof of Address Type', type: 'select', options: [{ value: '', label: 'Select proof of address type', disabled: true }, { value: 'utilityBill', label: 'Utility Bill' }, { value: 'leaseAgreement', label: 'Lease Agreement' }, { value: 'propertyTaxReceipt', label: 'Property Tax Receipt' }], required: false },
        { id: 'addressProof', label: 'Proof of Address (PDF/Image, max 20MB)', type: 'file', accept: '.pdf,.jpg,.png', maxSize: 20 * 1024 * 1024, required: false, disabled: true, dependsOn: 'addressProofType' },
        { id: 'bankDocumentType', label: 'Bank Document Type', type: 'select', options: [{ value: '', label: 'Select bank document type', disabled: true }, { value: 'cancelledCheque', label: 'Cancelled Cheque' }, { value: 'bankStatement', label: 'Bank Statement' }], required: false },
        { id: 'bankDocument', label: 'Bank Document (PDF, max 20MB)', type: 'file', accept: '.pdf', maxSize: 20 * 1024 * 1024, required: false, disabled: true, dependsOn: 'bankDocumentType' },
      ],
      corporatepartner: [
        { id: 'partnershipAgreement', label: 'Partnership Agreement (PDF, max 20MB)', type: 'file', accept: '.pdf', maxSize: 20 * 1024 * 1024, required: true },
        { id: 'companyBrochure', label: 'Company Brochure (PDF, max 20MB)', type: 'file', accept: '.pdf', maxSize: 20 * 1024 * 1024, required: false },
        { id: 'businessLicenseType', label: 'Business License Type', type: 'select', options: [{ value: '', label: 'Select business license type', disabled: true }, { value: 'generalLicense', label: 'General Business License' }, { value: 'industrySpecificLicense', label: 'Industry-Specific License' }], required: true },
        { id: 'businessLicense', label: 'Business License (PDF, max 20MB)', type: 'file', accept: '.pdf', maxSize: 20 * 1024 * 1024, required: true, disabled: true, dependsOn: 'businessLicenseType' },
        { id: 'taxDocumentType', label: 'Tax Document Type', type: 'select', options: [{ value: '', label: 'Select tax document type', disabled: true }, { value: 'gstCertificate', label: 'GST Certificate' }, { value: 'panCard', label: 'PAN Card' }, { value: 'tinCertificate', label: 'TIN Certificate' }], required: true },
        { id: 'taxDocument', label: 'Tax Document (PDF, max 20MB)', type: 'file', accept: '.pdf', maxSize: 20 * 1024 * 1024, required: true, disabled: true, dependsOn: 'taxDocumentType' },
        { id: 'authorizedRepIdType', label: 'Identity Proof Type', type: 'select', options: [{ value: '', label: 'Select identity proof type', disabled: true }, { value: 'aadhaarCard', label: 'Aadhaar Card' }, { value: 'passport', label: 'Passport' }, { value: 'driversLicense', label: "Driver's License" }], required: true },
        { id: 'authorizedRepId', label: 'Identity Proof (PDF/Image, max 20MB)', type: 'file', accept: '.pdf,.jpg,.png', maxSize: 20 * 1024 * 1024, required: true, disabled: true, dependsOn: 'authorizedRepIdType' },
        { id: 'bankDocumentType', label: 'Bank Document Type', type: 'select', options: [{ value: '', label: 'Select bank document type', disabled: true }, { value: 'cancelledCheque', label: 'Cancelled Cheque' }, { value: 'bankStatement', label: 'Bank Statement' }], required: false },
        { id: 'bankDocument', label: 'Bank Document (PDF, max 20MB)', type: 'file', accept: '.pdf', maxSize: 20 * 1024 * 1024, required: false, disabled: true, dependsOn: 'bankDocumentType' },
      ],
    }),
    []
  );

  // **RHF Setup**
  const validationSchema = useMemo(() => buildDocUploadValidationSchema(role, formConfig), [role, formConfig]);
  
  const { 
    handleSubmit, 
    control, 
    register, 
    watch, 
    reset, 
    formState: { errors } 
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: getInitialValues(role, formConfig),
    mode: 'onBlur',
  });


  useEffect(() => {
    const roleFromUrl = searchParams.get('role');
    if (validRoles.includes(roleFromUrl)) {
      setRole(roleFromUrl);
      reset(getInitialValues(roleFromUrl, formConfig)); // Reset form values and RHF state
      setMessage('');
    } else {
      setRole('');
      reset({});
      setMessage('Invalid role. Please select a valid role.');
    }
  }, [searchParams, formConfig, validRoles, reset]);

  const roleRoutes = {
    dietitian: '/dietitian/home',
    organization: '/organization/home',
    corporatepartner: '/corporatepartner/home',
  };

  // RHF-powered submit handler
  const handleFormSubmit = async (data) => {
    setMessage('');
    
    if (!roleRoutes[role]) {
      setMessage('Invalid role selected.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const formDataToSend = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        // Only append non-null/non-empty values
        if (value !== null && value !== '') {
          // File objects (including null ones from initial state) are handled by Yup and will be File instances if uploaded
          formDataToSend.append(key, value);
        }
      });

      // SIMULATE API CALL
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.8) {
            reject(new Error('Network timeout'));
          } else {
            resolve();
          }
        }, 2000);
      });

      setMessage('Documents uploaded successfully! Redirecting...');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      setTimeout(() => {
        navigate(roleRoutes[role]);
      }, 1500);
    } catch (error) {
      const reasons = {
        'Network timeout': 'Connection lost. Please try again.',
        'File too large': 'One or more files exceed size limit.',
        'Invalid file type': 'Invalid file format detected.',
      };
      setMessage(reasons[error.message] || 'Server error. Please try again later.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormContainer role={role} navigate={navigate}>
      {!role || !formConfig[role] ? (
        <RoleSelector validRoles={validRoles} navigate={navigate} />
      ) : (
        <form id={`${role}UploadForm`} onSubmit={handleSubmit(handleFormSubmit)} className="needs-validation" noValidate>
          {/* Global message */}
          {message && (
            <div
              aria-live="polite"
              className={`p-3 mb-5 text-center text-base font-medium rounded-lg shadow-sm animate-slide-in w-full ${
                message.includes('successfully') || message.includes('Redirecting')
                  ? 'text-green-800 bg-green-100 border border-green-300'
                  : 'text-red-800 bg-red-100 border border-red-300'
              }`}
              role="alert"
            >
              {message}
            </div>
          )}

          <FormFields
            role={role}
            formConfig={formConfig}
            errors={errors}
            control={control}
            register={register}
            watch={watch}
          />
          <div className="mt-6">
            <FormActions isLoading={isLoading} />
          </div>
        </form>
      )}
    </FormContainer>
  );
};

export default DocUpload;