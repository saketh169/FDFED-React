import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

// SelectField Component
const SelectField = ({ id, label, options, value, onChange, required, error, colSpan }) => (
  <div className={`relative animate-slide-in ${colSpan ? 'lg:col-span-2' : ''}`}>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6a994e] transition-all duration-300 appearance-none bg-white shadow-sm hover:shadow-md"
        required={required}
        aria-invalid={!!error}
        aria-describedby={`${id}-error`}
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
      <p id={`${id}-error`} className="text-red-500 text-sm mt-2">{error}</p>
    )}
  </div>
);

// FileUploadField Component
const FileUploadField = ({ id, label, accept, maxSize, required, disabled, error, onChange, file, colSpan }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > maxSize) {
      onChange(id, null);
      onChange('error', `${label} file size exceeds ${maxSize / (1024 * 1024)}MB.`);
      return;
    }
    onChange(id, file);
    onChange('error', '');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.size > maxSize) {
      onChange(id, null);
      onChange('error', `${label} file size exceeds ${maxSize / (1024 * 1024)}MB.`);
      return;
    }
    onChange(id, file);
    onChange('error', '');
  };

  const handleRemove = () => {
    onChange(id, null);
    onChange('error', '');
    if (fileInputRef.current) fileInputRef.current.value = '';
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
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div
        className={`w-full p-4 border-2 border-dashed rounded-lg transition-all duration-300 ${
          isDragging && !disabled ? 'border-[#6a994e] bg-green-50' : 'border-gray-300 bg-white'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-[#6a994e] hover:shadow-md'}`}
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
              </>
            ) : (
              <span className="text-sm text-gray-500">
                Drag and drop {label.toLowerCase()} here or
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
          aria-invalid={!!error}
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
      {error && (
        <p id={`${id}-error`} className="text-red-500 text-sm mt-2">{error}</p>
      )}
      {!required && (
        <p className="text-gray-500 text-sm mt-2">Optional: {label}</p>
      )}
    </div>
  );
};

// RoleSelector Component (No change)
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

// FormFields Component
const FormFields = ({ role, formConfig, formData, errors, handleInputChange }) => (
  <div className="grid gap-3 sm:gap-4 lg:grid-cols-2 w-full max-w-7xl mx-auto space-y-4">
    {formConfig[role].map((field) => (
      <div key={field.id} className="mb-4">
        {field.type === 'select' ? (
          <SelectField
            id={field.id}
            label={field.label}
            options={field.options}
            value={formData[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            required={field.required}
            error={errors[field.id]}
            // ⚠️ Added colSpan prop based on config
            colSpan={field.colSpan} 
          />
        ) : (
          <FileUploadField
            id={field.id}
            label={field.label}
            accept={field.accept}
            maxSize={field.maxSize}
            required={field.required}
            disabled={field.dependsOn ? !formData[field.dependsOn] : field.disabled}
            error={errors[field.id]}
            onChange={(id, value) => handleInputChange(id, value)}
            file={formData[field.id]}
            // ⚠️ Added colSpan prop based on config
            colSpan={field.colSpan}
          />
        )}
      </div>
    ))}
  </div>
);

// FormActions Component (No change)
const FormActions = ({ isLoading }) => (
  <button
    type="submit"
    className="w-full bg-[#1E6F5C] text-white font-semibold py-3 rounded-lg hover:bg-[#155345] transition-all duration-300 shadow-md hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
    disabled={isLoading}
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
);

// FormContainer Component (No change - already has desired width/spacing)
const FormContainer = ({ role, message, children, navigate }) => (
  <section className="flex items-center justify-center bg-gray-100 p-2 sm:p-3">
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
      {message && (
        <div
          aria-live="polite"
          className={`p-2 mb-3 text-center text-sm rounded-lg shadow-sm ${
            message.includes('successfully') ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
          } w-full max-w-7xl mx-auto`}
          role="alert"
        >
          {message}
        </div>
      )}
      {children}
    </div>
  </section>
);

// Main DocUpload Component
const DocUpload = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validRoles = useMemo(() => ['dietitian', 'organization', 'corporatepartner'], []);

  const formConfig = useMemo(
    () => ({
      dietitian: [
        {
          id: 'interestedField',
          label: 'Interested In',
          type: 'select',
          options: [
            { value: '', label: 'Select your role', disabled: true },
            { value: 'weight_loss_gain', label: 'Weight Loss/Gain' },
            { value: 'diabetes_thyroid_management', label: 'Diabetes/Thyroid Management' },
            { value: 'cardiac_health', label: 'Cardiac Health' },
            { value: 'women_health', label: 'Women Health' },
            { value: 'skin_hair_care', label: 'Skin and Hair Care' },
            { value: 'gut_digestive_health', label: 'Gut/Digestive Health' },
          ],
          required: true,
        },
        {
          id: 'resume',
          label: 'Resume (PDF, max 5MB)',
          type: 'file',
          accept: '.pdf',
          maxSize: 5 * 1024 * 1024,
          required: true,
          disabled: true,
          dependsOn: 'interestedField',
        },
        {
          id: 'degreeType',
          label: 'Degree Type',
          type: 'select',
          options: [
            { value: '', label: 'Select your degree', disabled: true },
            { value: 'bsc', label: 'B.Sc. in Nutrition/Dietetics' },
            { value: 'msc', label: 'M.Sc. in Nutrition/Dietetics' },
            { value: 'food_science', label: 'B.Sc./M.Sc. in Food Science' },
            { value: 'other', label: 'Other' },
          ],
          required: true,
        },
        {
          id: 'degreeCertificate',
          label: 'Degree Certificate (PDF, max 5MB)',
          type: 'file',
          accept: '.pdf',
          maxSize: 5 * 1024 * 1024,
          required: true,
          disabled: true,
          dependsOn: 'degreeType',
        },
        {
          id: 'licenseIssuer',
          label: 'License Issued By',
          type: 'select',
          options: [
            { value: '', label: 'Select license issuer', disabled: true },
            { value: 'ida', label: 'Indian Dietetic Association (IDA)' },
            { value: 'cdr', label: 'Commission on Dietetic Registration (U.S.)' },
            { value: 'other', label: 'Other' },
          ],
          required: true,
        },
        {
          id: 'licenseDocument',
          label: 'License Document (PDF, max 5MB)',
          type: 'file',
          accept: '.pdf',
          maxSize: 5 * 1024 * 1024,
          required: true,
          disabled: true,
          dependsOn: 'licenseIssuer',
        },
        {
          id: 'idProofType',
          label: 'Government ID Proof Type',
          type: 'select',
          options: [
            { value: '', label: 'Select ID proof type', disabled: true },
            { value: 'passport', label: 'Passport' },
            { value: 'aadhaar', label: 'Aadhaar Card' },
            { value: 'driver_license', label: "Driver's License" },
            { value: 'other', label: 'Other' },
          ],
          required: true,
        },
        {
          id: 'idProof',
          label: 'Government ID Proof (PDF/Image, max 2MB)',
          type: 'file',
          accept: '.pdf,.jpg,.png',
          maxSize: 2 * 1024 * 1024,
          required: true,
          disabled: true,
          dependsOn: 'idProofType',
        },

        // OPTIONAL FIELDS (2 PAIRS: 4 FIELDS) - Now spanning two columns
        {
          id: 'specializationDomain',
          label: 'Specialization Domain',
          type: 'select',
          options: [
            { value: '', label: 'Select specialization domain', disabled: true },
            { value: 'sports_nutrition', label: 'Sports Nutrition' },
            { value: 'pediatric_nutrition', label: 'Pediatric Nutrition' },
            { value: 'weight_management', label: 'Weight Management' },
            { value: 'other', label: 'Other' },
          ],
          required: false,
        },
        {
          id: 'specializationCertifications',
          label: 'Specialization Certifications (PDF, max 5MB)',
          type: 'file',
          accept: '.pdf',
          maxSize: 5 * 1024 * 1024,
          required: false,
          disabled: true,
          dependsOn: 'specializationDomain',
        },
        {
          id: 'experienceCertificates',
          label: 'Experience Certificates (PDF, max 5MB)',
          type: 'file',
          accept: '.pdf',
          maxSize: 5 * 1024 * 1024,
          required: false,
          colSpan: 2, // ⚠️ Made this optional field span 2 columns
        },
        {
          id: 'internshipCertificate',
          label: 'Internship Completion Certificate (PDF, max 5MB)',
          type: 'file',
          accept: '.pdf',
          maxSize: 5 * 1024 * 1024,
          required: false,
          colSpan: 2, // ⚠️ Made this optional field span 2 columns
        },
        {
          id: 'researchPapers',
          label: 'Research Papers/Publications (PDF, max 5MB)',
          type: 'file',
          accept: '.pdf',
          maxSize: 5 * 1024 * 1024,
          required: false,
          colSpan: 2, // ⚠️ Made this optional field span 2 columns
        },
      ],
      organization: [
        // 1. Optional Org Logo (Kept first)
        {
          id: 'orgLogo',
          label: 'Organization Logo (Image, max 20MB)',
          type: 'file',
          accept: '.jpg,.png,.jpeg',
          maxSize: 20 * 1024 * 1024,
          required: true,
        },
        // 2. Optional Org Brochure (Kept second)
        {
          id: 'orgBrochure',
          label: 'Organization Brochure (PDF, max 20MB)',
          type: 'file',
          accept: '.pdf',
          maxSize: 20 * 1024 * 1024,
          required: false,
        },
        
        // MANDATORY FIELDS - Grouped together
        // 3. Legal Document Type (Mandatory)
        {
          id: 'legalDocumentType',
          label: 'Legal Document Type',
          type: 'select',
          options: [
            { value: '', label: 'Select legal document type', disabled: true },
            { value: 'certificateOfIncorporation', label: 'Certificate of Incorporation' },
            { value: 'articlesOfAssociation', label: 'Articles of Association' },
            { value: 'memorandumOfAssociation', label: 'Memorandum of Association' },
          ],
          required: true,
        },
        // 4. Legal Document (Mandatory)
        {
          id: 'legalDocument',
          label: 'Legal Document (PDF, max 20MB)',
          type: 'file',
          accept: '.pdf',
          maxSize: 20 * 1024 * 1024,
          required: true,
          disabled: true,
          dependsOn: 'legalDocumentType',
        },
        // 5. Tax Document Type (Mandatory)
        {
          id: 'taxDocumentType',
          label: 'Tax Document Type',
          type: 'select',
          options: [
            { value: '', label: 'Select tax document type', disabled: true },
            { value: 'gstCertificate', label: 'GST Certificate' },
            { value: 'panCard', label: 'PAN Card' },
            { value: 'tinCertificate', label: 'TIN Certificate' },
          ],
          required: true,
        },
        // 6. Tax Document (Mandatory)
        {
          id: 'taxDocument',
          label: 'Tax Document (PDF, max 20MB)',
          type: 'file',
          accept: '.pdf',
          maxSize: 20 * 1024 * 1024,
          required: true,
          disabled: true,
          dependsOn: 'taxDocumentType',
        },
        // 7. Business License Type (Mandatory)
        {
          id: 'businessLicenseType',
          label: 'Business License Type',
          type: 'select',
          options: [
            { value: '', label: 'Select business license type', disabled: true },
            { value: 'generalLicense', label: 'General Business License' },
            { value: 'industrySpecificLicense', label: 'Industry-Specific License' },
          ],
          required: true,
        },
        // 8. Business License (Mandatory)
        {
          id: 'businessLicense',
          label: 'Business License (PDF, max 20MB)',
          type: 'file',
          accept: '.pdf',
          maxSize: 20 * 1024 * 1024,
          required: true,
          disabled: true,
          dependsOn: 'businessLicenseType',
        },
        // 9. Authorized Rep ID Type (Mandatory)
        {
          id: 'authorizedRepIdType',
          label: 'Identity Proof Type',
          type: 'select',
          options: [
            { value: '', label: 'Select identity proof type', disabled: true },
            { value: 'aadhaarCard', label: 'Aadhaar Card' },
            { value: 'passport', label: 'Passport' },
            { value: 'driversLicense', label: "Driver's License" },
          ],
          required: true,
        },
        // 10. Authorized Rep ID (Mandatory)
        {
          id: 'authorizedRepId',
          label: 'Identity Proof (PDF/Image, max 20MB)',
          type: 'file',
          accept: '.pdf,.jpg,.png',
          maxSize: 20 * 1024 * 1024,
          required: true,
          disabled: true,
          dependsOn: 'authorizedRepIdType',
        },

        // OPTIONAL FIELDS - Grouped at the end
        // 11. Address Proof Type (Optional)
        {
          id: 'addressProofType',
          label: 'Proof of Address Type',
          type: 'select',
          options: [
            { value: '', label: 'Select proof of address type', disabled: true },
            { value: 'utilityBill', label: 'Utility Bill' },
            { value: 'leaseAgreement', label: 'Lease Agreement' },
            { value: 'propertyTaxReceipt', label: 'Property Tax Receipt' },
          ],
          required: false,
        },
        // 12. Address Proof (Optional)
        {
          id: 'addressProof',
          label: 'Proof of Address (PDF/Image, max 20MB)',
          type: 'file',
          accept: '.pdf,.jpg,.png',
          maxSize: 20 * 1024 * 1024,
          required: false,
          disabled: true,
          dependsOn: 'addressProofType',
        },
        // 13. Bank Document Type (Optional)
        {
          id: 'bankDocumentType',
          label: 'Bank Document Type',
          type: 'select',
          options: [
            { value: '', label: 'Select bank document type', disabled: true },
            { value: 'cancelledCheque', label: 'Cancelled Cheque' },
            { value: 'bankStatement', label: 'Bank Statement' },
          ],
          required: false,
        },
        // 14. Bank Document (Optional)
        {
          id: 'bankDocument',
          label: 'Bank Document (PDF, max 20MB)',
          type: 'file',
          accept: '.pdf',
          maxSize: 20 * 1024 * 1024,
          required: false,
          disabled: true,
          dependsOn: 'bankDocumentType',
        },
      ],
      corporatepartner: [
        {
          id: 'partnershipAgreement',
          label: 'Partnership Agreement (PDF, max 20MB)',
          type: 'file',
          accept: '.pdf',
          maxSize: 20 * 1024 * 1024,
          required: true,
        },
        {
          id: 'companyBrochure',
          label: 'Company Brochure (PDF, max 20MB)',
          type: 'file',
          accept: '.pdf',
          maxSize: 20 * 1024 * 1024,
          required: false,
        },
        {
          id: 'businessLicenseType',
          label: 'Business License Type',
          type: 'select',
          options: [
            { value: '', label: 'Select business license type', disabled: true },
            { value: 'generalLicense', label: 'General Business License' },
            { value: 'industrySpecificLicense', label: 'Industry-Specific License' },
          ],
          required: true,
        },
        {
          id: 'businessLicense',
          label: 'Business License (PDF, max 20MB)',
          type: 'file',
          accept: '.pdf',
          maxSize: 20 * 1024 * 1024,
          required: true,
          disabled: true,
          dependsOn: 'businessLicenseType',
        },
        {
          id: 'taxDocumentType',
          label: 'Tax Document Type',
          type: 'select',
          options: [
            { value: '', label: 'Select tax document type', disabled: true },
            { value: 'gstCertificate', label: 'GST Certificate' },
            { value: 'panCard', label: 'PAN Card' },
            { value: 'tinCertificate', label: 'TIN Certificate' },
          ],
          required: true,
        },
        {
          id: 'taxDocument',
          label: 'Tax Document (PDF, max 20MB)',
          type: 'file',
          accept: '.pdf',
          maxSize: 20 * 1024 * 1024,
          required: true,
          disabled: true,
          dependsOn: 'taxDocumentType',
        },
        {
          id: 'authorizedRepIdType',
          label: 'Identity Proof Type',
          type: 'select',
          options: [
            { value: '', label: 'Select identity proof type', disabled: true },
            { value: 'aadhaarCard', label: 'Aadhaar Card' },
            { value: 'passport', label: 'Passport' },
            { value: 'driversLicense', label: "Driver's License" },
          ],
          required: true,
        },
        {
          id: 'authorizedRepId',
          label: 'Identity Proof (PDF/Image, max 20MB)',
          type: 'file',
          accept: '.pdf,.jpg,.png',
          maxSize: 20 * 1024 * 1024,
          required: true,
          disabled: true,
          dependsOn: 'authorizedRepIdType',
        },
        {
          id: 'bankDocumentType',
          label: 'Bank Document Type',
          type: 'select',
          options: [
            { value: '', label: 'Select bank document type', disabled: true },
            { value: 'cancelledCheque', label: 'Cancelled Cheque' },
            { value: 'bankStatement', label: 'Bank Statement' },
          ],
          required: false,
        },
        {
          id: 'bankDocument',
          label: 'Bank Document (PDF, max 20MB)',
          type: 'file',
          accept: '.pdf',
          maxSize: 20 * 1024 * 1024,
          required: false,
          disabled: true,
          dependsOn: 'bankDocumentType',
        },
      ],
    }),
    []
  );

  useEffect(() => {
    const roleFromUrl = searchParams.get('role');
    if (validRoles.includes(roleFromUrl)) {
      setRole(roleFromUrl);
      const initialData = formConfig[roleFromUrl].reduce(
        (acc, field) => ({
          ...acc,
          [field.id]: field.type === 'file' ? null : '',
        }),
        {}
      );
      setFormData(initialData);
    } else {
      setRole('');
      setMessage('Invalid role. Please select a valid role.');
    }
  }, [searchParams, formConfig, validRoles]);

  const handleInputChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: value === null ? prev[id] : '' }));

    const field = formConfig[role]?.find((f) => f.id === id);
    if (field?.type === 'select') {
      const dependentField = formConfig[role]?.find((f) => f.dependsOn === id);
      if (dependentField && value) {
        setFormData((prev) => ({ ...prev, [dependentField.id]: prev[dependentField.id] || null }));
        setErrors((prev) => ({ ...prev, [dependentField.id]: '' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    formConfig[role]?.forEach((field) => {
      if (field.required && !formData[field.id]) {
        newErrors[field.id] = `Please ${field.type === 'select' ? 'select' : 'upload'} your ${field.label.toLowerCase()}.`;
      }
      if (field.type === 'file' && formData[field.id]) {
        const file = formData[field.id];
        const allowedExtensions = field.accept.split(',').map((ext) => ext.trim().toLowerCase());
        const fileExtension = `.${file.name.split('.').pop().toLowerCase()}`;
        if (!allowedExtensions.includes(fileExtension)) {
          newErrors[field.id] = `Invalid file type for ${field.label}. Allowed: ${field.accept}.`;
        }
      }
      if (field.dependsOn && formData[field.dependsOn] && !formData[field.id]) {
        newErrors[field.id] = `Please upload your ${field.label.toLowerCase()}.`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage('');

    const roleRoutes = {
      dietitian: '/dietitian/home',
      organization: '/organization/home',
      corporatepartner: '/corporatepartner/home',
    };

    if (!roleRoutes[role]) {
      setMessage('Error: Invalid role. Please select a valid role.');
      console.error('Invalid role:', role);
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value instanceof File) {
          formDataToSend.append(key, value);
        } else if (value) {
          formDataToSend.append(key, value);
        }
      });

      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call
      setMessage('Documents uploaded successfully! Redirecting...');
      setTimeout(() => {
        navigate(roleRoutes[role]);
      }, 1000);
    } catch (error) {
      setMessage(`An error occurred while uploading documents: ${error.message}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormContainer role={role} message={message} navigate={navigate}>
      {!role || !formConfig[role] ? (
        <RoleSelector validRoles={validRoles} navigate={navigate} />
      ) : (
        <form id={`${role}UploadForm`} onSubmit={handleFormSubmit} className="needs-validation" noValidate>
          <FormFields
            role={role}
            formConfig={formConfig}
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
          />
          <div className="mt-4">
            <FormActions isLoading={isLoading} />
          </div>
        </form>
      )}
    </FormContainer>
  );
};

export default DocUpload;