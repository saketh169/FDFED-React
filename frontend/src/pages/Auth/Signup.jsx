import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const Signup = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({}); // State to track validation errors

  useEffect(() => {
    const roleFromUrl = searchParams.get('role');
    console.log('Role from URL:', roleFromUrl);
    if (roleFromUrl) {
      setRole(roleFromUrl);
    }
  }, [searchParams]);

  // Validation function to check form inputs
  const validateForm = (form) => {
    const errors = {};
    const inputs = form.querySelectorAll('input, textarea');

    // Validate name fields - only letters, spaces, dots, underscores; min 5 chars, at least 4 letters
    inputs.forEach((input) => {
      const id = input.id;
      if (id.includes('Name') && input.type === 'text') {
        const nameValue = input.value.trim();
        const namePattern = /^[a-zA-Z\s._]+$/;
        const letterCount = (nameValue.match(/[a-zA-Z]/g) || []).length;
        if (!nameValue) {
          errors[id] = `${input.labels[0]?.textContent || 'Field'} is required.`;
        } else if (!namePattern.test(nameValue)) {
          errors[id] = 'Name can only contain letters, spaces, dots, or underscores.';
        } else if (nameValue.length < 5) {
          errors[id] = 'Name must be at least 5 characters long.';
        } else if (letterCount < 4) {
          errors[id] = 'Name must contain at least 4 letters.';
        }
      }
    });

    // Validate license number fields (dietitian, organization, corporatepartner)
    inputs.forEach((input) => {
      const id = input.id;
      if (id.includes('LicenseNumber') && input.type === 'text') {
        const value = input.value.trim();
        if (!value) {
          errors[id] = `${input.labels[0]?.textContent || 'Field'} is required.`;
        } else if (id === 'dietitianLicenseNumber' && !/^DLN[0-9]{6}$/.test(value)) {
          errors[id] = 'License Number must be in the format DLN followed by 6 digits (e.g., DLN123456).';
        } else if (id === 'organizationLicenseNumber' && !/^OLN[0-9]{6}$/.test(value)) {
          errors[id] = 'License Number must be in the format OLN followed by 6 digits (e.g., OLN123456).';
        } else if (id === 'corporatepartnerLicenseNumber' && !/^CLN[0-9]{6}$/.test(value)) {
          errors[id] = 'License Number must be in the format CLN followed by 6 digits (e.g., CLN123456).';
        }
      }
    });

    // General validation for other fields
    inputs.forEach((input) => {
      const id = input.id;
      if (!input.checkValidity() && !errors[id]) { // Skip if already flagged
        if (input.validity.valueMissing) {
          errors[id] = `${input.labels[0]?.textContent || 'Field'} is required.`;
        } else if (input.validity.typeMismatch) {
          if (input.type === 'email') {
            errors[id] = 'Please enter a valid email address.';
          }
        } else if (input.validity.tooShort) {
          errors[id] = `${
            input.labels[0]?.textContent || 'Field'
          } must be at least ${input.minLength} characters.`;
        } else if (input.validity.tooLong) {
          errors[id] = `${
            input.labels[0]?.textContent || 'Field'
          } must not exceed ${input.maxLength} characters.`;
        } else if (input.validity.patternMismatch) {
          if (input.type === 'tel') {
            errors[id] = 'Enter a valid 10-digit phone number.';
          }
        } else if (input.type === 'number' && input.min) {
          errors[id] = `${input.labels[0]?.textContent || 'Field'} must be at least ${input.min}.`;
        }
      }
    });

    // Validate radio buttons for gender (user and admin forms)
    const genderInputs = form.querySelectorAll('input[type="radio"]');
    const genderGroups = {};
    genderInputs.forEach((input) => {
      if (input.name.includes('Gender')) {
        genderGroups[input.name] = genderGroups[input.name] || [];
        genderGroups[input.name].push(input);
      }
    });
    Object.keys(genderGroups).forEach((name) => {
      if (!genderGroups[name].some((input) => input.checked)) {
        const genderKey = name.replace('user', '').replace('admin', '');
        errors[`${genderKey}Gender`] = 'Please select your gender.';
      }
    });

    // Custom validation for date of birth (user and admin forms)
    const dobInput = form.querySelector('input[type="date"]');
    if (dobInput) {
      const dobValue = new Date(dobInput.value);
      const today = new Date();
      const minAgeDate = new Date();
      minAgeDate.setFullYear(today.getFullYear() - 10); // Minimum age 10
      if (dobInput.value && dobValue > minAgeDate) {
        errors[dobInput.id] = 'You must be at least 10 years old.';
      }
    }

    // Custom validation for age (dietitian form)
    const ageInput = form.querySelector('input[type="number"]');
    if (ageInput) {
      const age = parseInt(ageInput.value, 10);
      if (ageInput.value && age < 18) {
        errors[ageInput.id] = 'Age must be at least 18.';
      }
    }

    return errors;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    form.classList.add('was-validated');

    // Validate form inputs
    const validationErrors = validateForm(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setMessage('Please fix the validation errors.');
      return; // Stop submission if there are validation errors
    }

    const roleRoutes = {
      user: '/user/home',
      admin: '/admin/home',
      organization: `/upload-documents?role=organization`,
      corporatepartner: `/upload-documents?role=corporatepartner`,
      dietitian: `/upload-documents?role=dietitian`,
    };

    if (!roleRoutes[role]) {
      setMessage('Error: Invalid role. Please try again.');
      console.error('Invalid role:', role);
      return;
    }

    setMessage('Sign-up successful! Redirecting...');
    console.log('Form submitted, role:', role);
    setTimeout(() => {
      setMessage('');
      navigate(roleRoutes[role]);
    }, 1000);
  };

  const renderForm = () => {
    const commonInputClasses =
      'w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6a994e] transition-all duration-300';
    const commonButtonClasses =
      'w-full bg-[#1E6F5C] text-white font-semibold py-3 rounded-lg hover:bg-[#155345] transition-colors duration-300 shadow-md hover:shadow-lg';
    const errorClasses = 'text-red-500 text-xs mt-1';

    switch (role) {
      case 'user':
        return (
          <div className="mt-6 mb-3 w-full max-w-7xl mx-auto">
            <form
              id="userSignupForm"
              onSubmit={handleFormSubmit}
              className="needs-validation grid gap-3 sm:gap-4 lg:grid-cols-2"
              noValidate
            >
              {/* Left Column (3 Fields: Name, Phone, DOB) */}
              <div className="relative">
                <label
                  htmlFor="userName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  id="userName"
                  type="text"
                  className={`${commonInputClasses} ${
                    errors.userName ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter your full name"
                  required
                  minLength="5"
                  maxLength="50"
                />
                {errors.userName && <div className={errorClasses}>{errors.userName}</div>}
              </div>

              {/* Right Column (3 Fields: Email, Password, Gender) */}
              <div className="relative">
                <label
                  htmlFor="userEmail"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="userEmail"
                  type="email"
                  className={`${commonInputClasses} ${
                    errors.userEmail ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter your email"
                  required
                  minLength="10"
                  maxLength="50"
                />
                {errors.userEmail && <div className={errorClasses}>{errors.userEmail}</div>}
              </div>

              <div className="relative">
                <label
                  htmlFor="userPhone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <input
                  id="userPhone"
                  type="tel"
                  className={`${commonInputClasses} ${
                    errors.userPhone ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter your phone number"
                  pattern="[0-9]{10}"
                  required
                  minLength="10"
                  maxLength="10"
                />
                {errors.userPhone && <div className={errorClasses}>{errors.userPhone}</div>}
              </div>
              <div className="relative">
                <label
                  htmlFor="userPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="userPassword"
                  type="password"
                  className={`${commonInputClasses} ${
                    errors.userPassword ? 'border-red-500' : ''
                  }`}
                  placeholder="Create a password"
                  required
                  minLength="6"
                  maxLength="20"
                />
                {errors.userPassword && (
                  <div className={errorClasses}>{errors.userPassword}</div>
                )}
              </div>

              <div className="relative">
                <label
                  htmlFor="userDob"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Date of Birth
                </label>
                <input
                  id="userDob"
                  type="date"
                  className={`${commonInputClasses} ${
                    errors.userDob ? 'border-red-500' : ''
                  }`}
                  required
                />
                {errors.userDob && <div className={errorClasses}>{errors.userDob}</div>}
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      className="h-4 w-4 text-[#1E6F5C] border-gray-300 rounded focus:ring-[#1E6F5C]"
                      type="radio"
                      name="userGender"
                      value="male"
                      required
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Male
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      className="h-4 w-4 text-[#1E6F5C] border-gray-300 rounded focus:ring-[#1E6F5C]"
                      type="radio"
                      name="userGender"
                      value="female"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Female
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      className="h-4 w-4 text-[#1E6F5C] border-gray-300 rounded focus:ring-[#1E6F5C]"
                      type="radio"
                      name="userGender"
                      value="other"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Other
                    </label>
                  </div>
                </div>
                {errors.userGender && (
                  <div className={errorClasses}>{errors.userGender}</div>
                )}
              </div>

              {/* Full Width (Address, Button) */}
              <div className="relative lg:col-span-2">
                <label
                  htmlFor="userAddress"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Address
                </label>
                <textarea
                  id="userAddress"
                  className={`${commonInputClasses} ${
                    errors.userAddress ? 'border-red-500' : ''
                  }`}
                  rows="3"
                  placeholder="Enter your address"
                  required
                  minLength="5"
                  maxLength="200"
                ></textarea>
                {errors.userAddress && (
                  <div className={errorClasses}>{errors.userAddress}</div>
                )}
              </div>

              <div className="lg:col-span-2">
                <button type="submit" className={commonButtonClasses}>
                  Get Started
                </button>
              </div>
            </form>
          </div>
        );
      case 'dietitian':
        return (
          <div className="mt-6 mb-3 w-full max-w-7xl mx-auto">
            <form
              id="dietitianSignupForm"
              onSubmit={handleFormSubmit}
              className="needs-validation grid gap-3 sm:gap-4 lg:grid-cols-2"
              noValidate
            >
              {/* Left Column (3 Fields: Name, Age, Phone) */}
              <div className="relative">
                <label
                  htmlFor="dietitianName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  id="dietitianName"
                  type="text"
                  className={`${commonInputClasses} ${
                    errors.dietitianName ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter your full name"
                  required
                  minLength="5"
                  maxLength="50"
                />
                {errors.dietitianName && (
                  <div className={errorClasses}>{errors.dietitianName}</div>
                )}
              </div>

              {/* Right Column (3 Fields: Email, Password, License Number) */}
              <div className="relative">
                <label
                  htmlFor="dietitianEmail"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="dietitianEmail"
                  type="email"
                  className={`${commonInputClasses} ${
                    errors.dietitianEmail ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter your email"
                  required
                  minLength="5"
                  maxLength="50"
                />
                {errors.dietitianEmail && (
                  <div className={errorClasses}>{errors.dietitianEmail}</div>
                )}
              </div>

              <div className="relative">
                <label
                  htmlFor="dietitianAge"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Age
                </label>
                <input
                  id="dietitianAge"
                  type="number"
                  className={`${commonInputClasses} ${
                    errors.dietitianAge ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter your age"
                  required
                  min="18"
                />
                {errors.dietitianAge && (
                  <div className={errorClasses}>{errors.dietitianAge}</div>
                )}
              </div>
              <div className="relative">
                <label
                  htmlFor="dietitianPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="dietitianPassword"
                  type="password"
                  className={`${commonInputClasses} ${
                    errors.dietitianPassword ? 'border-red-500' : ''
                  }`}
                  placeholder="Create a password"
                  required
                  minLength="6"
                  maxLength="20"
                />
                {errors.dietitianPassword && (
                  <div className={errorClasses}>{errors.dietitianPassword}</div>
                )}
              </div>

              <div className="relative">
                <label
                  htmlFor="dietitianPhone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <input
                  id="dietitianPhone"
                  type="tel"
                  className={`${commonInputClasses} ${
                    errors.dietitianPhone ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter your phone number"
                  pattern="[0-9]{10}"
                  required
                  minLength="10"
                  maxLength="10"
                />
                {errors.dietitianPhone && (
                  <div className={errorClasses}>{errors.dietitianPhone}</div>
                )}
              </div>
              <div className="relative">
                <label
                  htmlFor="dietitianLicenseNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  License Number
                </label>
                <input
                  id="dietitianLicenseNumber"
                  type="text"
                  className={`${commonInputClasses} ${
                    errors.dietitianLicenseNumber ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter your license number (e.g., DLN123456)"
                  required
                  minLength="9"
                  maxLength="9"
                />
                {errors.dietitianLicenseNumber && (
                  <div className={errorClasses}>
                    {errors.dietitianLicenseNumber}
                  </div>
                )}
              </div>

              <div className="lg:col-span-2">
                <button type="submit" className={commonButtonClasses}>
                  Get Started
                </button>
              </div>
            </form>
          </div>
        );
      case 'organization':
        return (
          <div className="mt-6 mb-3 w-full max-w-7xl mx-auto">
            <form
              id="organizationSignupForm"
              onSubmit={handleFormSubmit}
              className="needs-validation grid gap-3 sm:gap-4 lg:grid-cols-2"
              noValidate
            >
              {/* Left Column (3 Fields: Name, Phone, License Number) */}
              <div className="relative">
                <label
                  htmlFor="organizationName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Certifying Organization Name
                </label>
                <input
                  id="organizationName"
                  type="text"
                  className={`${commonInputClasses} ${
                    errors.organizationName ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter organization name"
                  required
                  minLength="5"
                  maxLength="50"
                />
                {errors.organizationName && (
                  <div className={errorClasses}>{errors.organizationName}</div>
                )}
              </div>

              {/* Right Column (2 Fields: Email, Password) */}
              <div className="relative">
                <label
                  htmlFor="organizationEmail"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="organizationEmail"
                  type="email"
                  className={`${commonInputClasses} ${
                    errors.organizationEmail ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter your email"
                  required
                  minLength="10"
                  maxLength="50"
                />
                {errors.organizationEmail && (
                  <div className={errorClasses}>{errors.organizationEmail}</div>
                )}
              </div>

              <div className="relative">
                <label
                  htmlFor="organizationPhone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <input
                  id="organizationPhone"
                  type="tel"
                  className={`${commonInputClasses} ${
                    errors.organizationPhone ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter your phone number"
                  pattern="[0-9]{10}"
                  required
                  minLength="10"
                  maxLength="10"
                />
                {errors.organizationPhone && (
                  <div className={errorClasses}>{errors.organizationPhone}</div>
                )}
              </div>
              <div className="relative">
                <label
                  htmlFor="organizationPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="organizationPassword"
                  type="password"
                  className={`${commonInputClasses} ${
                    errors.organizationPassword ? 'border-red-500' : ''
                  }`}
                  placeholder="Create a password"
                  required
                  minLength="6"
                  maxLength="20"
                />
                {errors.organizationPassword && (
                  <div className={errorClasses}>
                    {errors.organizationPassword}
                  </div>
                )}
              </div>

              <div className="relative">
                <label
                  htmlFor="organizationLicenseNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  License Number
                </label>
                <input
                  id="organizationLicenseNumber"
                  type="text"
                  className={`${commonInputClasses} ${
                    errors.organizationLicenseNumber ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter license number (e.g., OLN123456)"
                  required
                  minLength="9"
                  maxLength="9"
                />
                {errors.organizationLicenseNumber && (
                  <div className={errorClasses}>
                    {errors.organizationLicenseNumber}
                  </div>
                )}
              </div>
              {/* Empty div for layout symmetry */}
              <div className="relative"></div>

              {/* Full Width (Address, Button) */}
              <div className="relative lg:col-span-2">
                <label
                  htmlFor="organizationAddress"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Address
                </label>
                <textarea
                  id="organizationAddress"
                  className={`${commonInputClasses} ${
                    errors.organizationAddress ? 'border-red-500' : ''
                  }`}
                  rows="3"
                  placeholder="Enter your address"
                  required
                  minLength="5"
                  maxLength="200"
                ></textarea>
                {errors.organizationAddress && (
                  <div className={errorClasses}>
                    {errors.organizationAddress}
                  </div>
                )}
              </div>

              <div className="lg:col-span-2">
                <button type="submit" className={commonButtonClasses}>
                  Get Started
                </button>
              </div>
            </form>
          </div>
        );
      case 'corporatepartner':
        return (
          <div className="mt-6 mb-3 w-full max-w-7xl mx-auto">
            <form
              id="corporatepartnerSignupForm"
              onSubmit={handleFormSubmit}
              className="needs-validation grid gap-3 sm:gap-4 lg:grid-cols-2"
              noValidate
            >
              {/* Left Column (3 Fields: Corporate Name, Phone, License Number) */}
              <div className="relative">
                <label
                  htmlFor="corporatepartnerName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Corporate Name
                </label>
                <input
                  id="corporatepartnerName"
                  type="text"
                  className={`${commonInputClasses} ${
                    errors.corporatepartnerName ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter corporate name"
                  required
                  minLength="5"
                  maxLength="50"
                />
                {errors.corporatepartnerName && (
                  <div className={errorClasses}>
                    {errors.corporatepartnerName}
                  </div>
                )}
              </div>

              {/* Right Column (2 Fields: Email, Password) */}
              <div className="relative">
                <label
                  htmlFor="corporatepartnerEmail"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="corporatepartnerEmail"
                  type="email"
                  className={`${commonInputClasses} ${
                    errors.corporatepartnerEmail ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter your email"
                  required
                  minLength="10"
                  maxLength="50"
                />
                {errors.corporatepartnerEmail && (
                  <div className={errorClasses}>
                    {errors.corporatepartnerEmail}
                  </div>
                )}
              </div>

              <div className="relative">
                <label
                  htmlFor="corporatepartnerPhone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <input
                  id="corporatepartnerPhone"
                  type="tel"
                  className={`${commonInputClasses} ${
                    errors.corporatepartnerPhone ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter your phone number"
                  pattern="[0-9]{10}"
                  required
                  minLength="10"
                  maxLength="10"
                />
                {errors.corporatepartnerPhone && (
                  <div className={errorClasses}>
                    {errors.corporatepartnerPhone}
                  </div>
                )}
              </div>
              <div className="relative">
                <label
                  htmlFor="corporatepartnerPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="corporatepartnerPassword"
                  type="password"
                  className={`${commonInputClasses} ${
                    errors.corporatepartnerPassword ? 'border-red-500' : ''
                  }`}
                  placeholder="Create a password"
                  required
                  minLength="6"
                  maxLength="20"
                />
                {errors.corporatepartnerPassword && (
                  <div className={errorClasses}>
                    {errors.corporatepartnerPassword}
                  </div>
                )}
              </div>

              <div className="relative">
                <label
                  htmlFor="corporatepartnerLicenseNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Corporate License Number
                </label>
                <input
                  id="corporatepartnerLicenseNumber"
                  type="text"
                  className={`${commonInputClasses} ${
                    errors.corporatepartnerLicenseNumber ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter license number (e.g., CLN123456)"
                  required
                  minLength="9"
                  maxLength="9"
                />
                {errors.corporatepartnerLicenseNumber && (
                  <div className={errorClasses}>
                    {errors.corporatepartnerLicenseNumber}
                  </div>
                )}
              </div>
              {/* Empty div for layout symmetry */}
              <div className="relative"></div>

              {/* Full Width (Address, Button) */}
              <div className="relative lg:col-span-2">
                <label
                  htmlFor="corporatepartnerAddress"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Address
                </label>
                <textarea
                  id="corporatepartnerAddress"
                  className={`${commonInputClasses} ${
                    errors.corporatepartnerAddress ? 'border-red-500' : ''
                  }`}
                  rows="3"
                  placeholder="Enter your address"
                  required
                  minLength="5"
                  maxLength="200"
                ></textarea>
                {errors.corporatepartnerAddress && (
                  <div className={errorClasses}>
                    {errors.corporatepartnerAddress}
                  </div>
                )}
              </div>

              <div className="lg:col-span-2">
                <button type="submit" className={commonButtonClasses}>
                  Get Started
                </button>
              </div>
            </form>
          </div>
        );
      case 'admin':
        return (
          <div className="mt-6 mb-3 w-full max-w-7xl mx-auto">
            <form
              id="adminSignupForm"
              onSubmit={handleFormSubmit}
              className="needs-validation grid gap-3 sm:gap-4 lg:grid-cols-2"
              noValidate
            >
              {/* Left Column (3 Fields: Name, Admin Key, Phone) */}
              <div className="relative">
                <label
                  htmlFor="adminName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  id="adminName"
                  type="text"
                  className={`${commonInputClasses} ${
                    errors.adminName ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter your full name"
                  required
                  minLength="5"
                  maxLength="50"
                />
                {errors.adminName && <div className={errorClasses}>{errors.adminName}</div>}
              </div>

              {/* Right Column (3 Fields: Email, Password, DOB) */}
              <div className="relative">
                <label
                  htmlFor="adminEmail"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="adminEmail"
                  type="email"
                  className={`${commonInputClasses} ${
                    errors.adminEmail ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter your email"
                  required
                  minLength="10"
                  maxLength="50"
                />
                {errors.adminEmail && <div className={errorClasses}>{errors.adminEmail}</div>}
              </div>

              <div className="relative">
                <label
                  htmlFor="adminKey"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Admin Key
                </label>
                <input
                  id="adminKey"
                  type="password"
                  className={`${commonInputClasses} ${
                    errors.adminKey ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter Admin Key"
                  required
                  minLength="5"
                  maxLength="20"
                />
                {errors.adminKey && <div className={errorClasses}>{errors.adminKey}</div>}
              </div>
              <div className="relative">
                <label
                  htmlFor="adminPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="adminPassword"
                  type="password"
                  className={`${commonInputClasses} ${
                    errors.adminPassword ? 'border-red-500' : ''
                  }`}
                  placeholder="Create a password"
                  required
                  minLength="6"
                  maxLength="20"
                />
                {errors.adminPassword && (
                  <div className={errorClasses}>{errors.adminPassword}</div>
                )}
              </div>

              <div className="relative">
                <label
                  htmlFor="adminPhone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <input
                  id="adminPhone"
                  type="tel"
                  className={`${commonInputClasses} ${
                    errors.adminPhone ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter your phone number"
                  pattern="[0-9]{10}"
                  required
                  minLength="10"
                  maxLength="10"
                />
                {errors.adminPhone && (
                  <div className={errorClasses}>{errors.adminPhone}</div>
                )}
              </div>
              <div className="relative">
                <label
                  htmlFor="adminDob"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Date of Birth
                </label>
                <input
                  id="adminDob"
                  type="date"
                  className={`${commonInputClasses} ${
                    errors.adminDob ? 'border-red-500' : ''
                  }`}
                  required
                />
                {errors.adminDob && <div className={errorClasses}>{errors.adminDob}</div>}
              </div>

              {/* Gender field */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      className="h-4 w-4 text-[#1E6F5C] border-gray-300 rounded focus:ring-[#1E6F5C]"
                      type="radio"
                      name="adminGender"
                      value="male"
                      required
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Male
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      className="h-4 w-4 text-[#1E6F5C] border-gray-300 rounded focus:ring-[#1E6F5C]"
                      type="radio"
                      name="adminGender"
                      value="female"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Female
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      className="h-4 w-4 text-[#1E6F5C] border-gray-300 rounded focus:ring-[#1E6F5C]"
                      type="radio"
                      name="adminGender"
                      value="other"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Other
                    </label>
                  </div>
                </div>
                {errors.adminGender && (
                  <div className={errorClasses}>{errors.adminGender}</div>
                )}
              </div>
              {/* Empty div for symmetry */}
              <div className="relative"></div>

              {/* Full Width (Address, Button) */}
              <div className="relative lg:col-span-2">
                <label
                  htmlFor="adminAddress"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Address
                </label>
                <textarea
                  id="adminAddress"
                  className={`${commonInputClasses} ${
                    errors.adminAddress ? 'border-red-500' : ''
                  }`}
                  rows="3"
                  placeholder="Enter your address"
                  required
                  minLength="5"
                  maxLength="200"
                ></textarea>
                {errors.adminAddress && (
                  <div className={errorClasses}>{errors.adminAddress}</div>
                )}
              </div>

              <div className="lg:col-span-2">
                <button type="submit" className={commonButtonClasses}>
                  Get Started
                </button>
              </div>
            </form>
          </div>
        );
      default:
        return (
          <div className="mt-6 mb-3 w-full max-w-7xl mx-auto">
            <div className="text-center p-4 sm:p-5 flex flex-col items-center justify-center min-h-[150px]">
              <h3 className="text-xl text-gray-700 font-semibold mb-4">
                Please select a role to sign up.
              </h3>
              <button
                onClick={() => navigate('/role')}
                className="bg-[#28B463] hover:bg-[#1E8449] text-white font-bold py-2 px-4 rounded-md shadow-lg transition-colors"
              >
                Select a Role
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <section className="flex items-center justify-center bg-gray-100 p-2 sm:p-3 min-h-[650px]">
      <div className="w-full max-w-7xl p-4 sm:p-5 mx-auto rounded-3xl shadow-2xl bg-white flex flex-col items-center justify-center">
        <h2 className="text-center text-3xl font-bold text-[#1E6F5C] mb-4">
          GET STARTED
        </h2>
        {message && (
          <div
            className="p-2 mb-3 text-center text-sm text-green-700 bg-green-100 rounded-lg w-full max-w-7xl mx-auto"
            role="alert"
          >
            {message}
          </div>
        )}
        {renderForm()}
      </div>
    </section>
  );
};

export default Signup;