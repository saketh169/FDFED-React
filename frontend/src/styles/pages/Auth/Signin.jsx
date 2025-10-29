import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signin = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false); // New state for loading

  // --- Color constants for UI consistency ---
  const primaryGreen = '#1E6F5C';
  const lightGreen = '#6a994e';

  // --- Role-based redirection routes ---
  const roleRoutes = {
    user: '/user/home',
    admin: '/admin/home',
    organization: '/organization/home',
    corporatepartner: '/corporatepartner/home',
    dietitian: '/dietitian/home',
  };

  useEffect(() => {
    const roleFromUrl = searchParams.get('role') || 'user';
    setRole(roleFromUrl);
  }, [searchParams]);

  const validateForm = (form) => {
    const errors = {};
    const inputs = form.querySelectorAll('input');

    // General HTML5 validation fallback
    inputs.forEach((input) => {
      const id = input.id;
      if (!input.checkValidity()) {
        if (input.validity.valueMissing) {
          errors[id] = `${input.labels[0]?.textContent || 'Field'} is required.`;
        } else if (input.validity.typeMismatch && input.type === 'email') {
          errors[id] = 'Please enter a valid email address.';
        } else if (input.validity.tooShort) {
          errors[id] = `${input.labels[0]?.textContent || 'Field'} must be at least ${input.minLength} characters.`;
        } else if (input.validity.tooLong) {
          errors[id] = `${input.labels[0]?.textContent || 'Field'} must not exceed ${input.maxLength} characters.`;
        }
      }
    });

    // Additional role-specific validation (License number/ID checks)
    const formData = new FormData(form);

    if (role === 'dietitian') {
      const license = formData.get('dietitianLicenseNumber');
      if (license && !/^DLN[0-9]{6}$/.test(license)) {
        errors['dietitianLicenseNumber'] = 'License Number format is incorrect (e.g., DLN123456).';
      }
    }
    if (role === 'organization') {
      const orgId = formData.get('organizationId');
      if (!orgId || orgId.length < 5) {
        // Updated message to reflect the form structure more accurately
        errors['organizationId'] = 'Organization ID is required and must be at least 5 characters.'; 
      }
    }
    
    // *** NEW VALIDATION FOR CORPORATE PARTNER ***
    if (role === 'corporatepartner') {
      const partnerId = formData.get('corporatePartnerId');
      if (!partnerId || partnerId.length < 5) {
        errors['corporatePartnerId'] = 'Partner ID is required and must be at least 5 characters.';
      }
    }
    // *** END NEW VALIDATION ***
    
    if (role === 'admin') {
      const adminKey = formData.get('adminKey');
      if (!adminKey || adminKey.length < 5) {
        errors['adminKey'] = 'Admin Key is required and must be at least 5 characters.';
      }
    }

    return errors;
  };

  // --- Function to serialize form data ---
  const serializeForm = (form) => {
    const formData = {};
    const prefix = role;

    form.querySelectorAll('input').forEach(input => {
      let key = input.id.replace(prefix, '').toLowerCase();
      
      // Handle special case for unique IDs/Keys
      if (input.id === 'adminKey') key = 'adminKey';
      if (input.id === 'organizationId') key = 'organizationId'; 
      // Handle the new corporatePartnerId field 
      if (input.id === 'corporatePartnerId') key = 'corporatePartnerId';

      if (input.value && input.type !== 'checkbox') {
        formData[key] = input.value;
      }
    });

    formData.role = role;

    // Check if 'Remember Me' is checked
    const rememberMeInput = form.querySelector(`#rememberMe${role.charAt(0).toUpperCase() + role.slice(1)}`);
    formData.rememberMe = rememberMeInput?.checked || false;

    return formData;
  };


  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    form.classList.add('was-validated');

    const validationErrors = validateForm(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setMessage('Please fix the validation errors.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const formData = serializeForm(form);
    const apiRoute = `/api/signin/${role}`; // e.g., /api/signin/user

    setIsLoading(true);
    setMessage('Verifying credentials...');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
        // Use axios.post for the API call
        const response = await axios.post(apiRoute, formData);
        const data = response.data;

        // CRITICAL: Handle token storage
        if (data.token) {
            localStorage.setItem('authToken', data.token);
            // If you use refresh tokens (recommended for 'Remember Me'), the backend would set an HTTP-only cookie here.
        }

        setMessage(`Sign-in successful! Redirecting to ${role} home page ...`);

        // Redirect after a short delay
        setTimeout(() => {
            setMessage('');
            navigate(roleRoutes[role]);
        }, 1000);

    } catch (error) {
        console.error('Sign-in Error:', error.response ? error.response.data : error.message);

        const errorMessage = error.response?.data?.message
            || 'Login failed. Please check your credentials.';

        setMessage(`Error: ${errorMessage}`);
        // Reset errors if the response provided specific field errors (e.g., wrong password)
        setErrors(error.response?.data?.errors || {});

    } finally {
        setIsLoading(false);
    }
  };

  const renderForm = () => {
    const commonInputClasses =
      `w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[${lightGreen}] transition-all duration-300`;
    const commonButtonClasses =
      `w-full bg-[${primaryGreen}] text-white font-semibold py-3 rounded-lg hover:bg-[#155345] transition-colors duration-300 shadow-md hover:shadow-lg disabled:opacity-50`;
    const commonLinkClasses = 'text-[#1E6F5C] hover:text-[#155345] font-medium transition-colors duration-300';
    const errorClasses = 'text-red-500 text-xs mt-1';

    // Submit Button with Loading State
    const SubmitButton = () => (
      <button type="submit" className={commonButtonClasses} disabled={isLoading}>
        {isLoading ? (
          <>
            <i className="fas fa-spinner fa-spin mr-2"></i> Logging In...
          </>
        ) : (
          'Log In'
        )}
      </button>
    );

    const RememberMe = () => (
      <div className="flex items-center">
        <input
          type="checkbox"
          className={`h-4 w-4 text-[${primaryGreen}] border-gray-300 rounded focus:ring-[${primaryGreen}]`}
          id={`rememberMe${role.charAt(0).toUpperCase() + role.slice(1)}`}
        />
        <label
          className="ml-2 block text-sm text-gray-900"
          htmlFor={`rememberMe${role.charAt(0).toUpperCase() + role.slice(1)}`}
        >
          Remember Me
        </label>
      </div>
    );

    switch (role) {
      // USER
      case 'user':
        return (
          <form id="userLoginForm" onSubmit={handleFormSubmit} className="space-y-4" noValidate>
            <div className="relative">
              <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="userEmail"
                name="email"
                type="email"
                className={`${commonInputClasses} ${errors.userEmail ? 'border-red-500' : ''}`}
                placeholder="Enter your email"
                required
                minLength="5"
                maxLength="50"
              />
              {errors.userEmail && <div className={errorClasses}>{errors.userEmail}</div>}
            </div>

            <div className="relative">
              <label htmlFor="userPassword" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                id="userPassword"
                name="password"
                type="password"
                className={`${commonInputClasses} ${errors.userPassword ? 'border-red-500' : ''}`}
                placeholder="Enter your password"
                required
                minLength="6"
                maxLength="20"
              />
              {errors.userPassword && <div className={errorClasses}>{errors.userPassword}</div>}
            </div>

            <div className="flex items-center justify-between">
              <RememberMe />
              <Link to="/forgot-password" className="text-sm font-medium text-[#1E6F5C] hover:text-[#155345]">
                Forgot Password?
              </Link>
            </div>

            <SubmitButton />

            <p className="text-center text-sm mt-4">
              Don't have an account?{' '}
              <Link to={`/signup?role=${role}`} className={commonLinkClasses}>Sign Up</Link>
            </p>
          </form>
        );

      // DIETITIAN
      case 'dietitian':
        return (
          <form id="dietitianLoginForm" onSubmit={handleFormSubmit} className="space-y-4" noValidate>
            <div className="relative">
              <label htmlFor="dietitianEmail" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="dietitianEmail"
                name="email"
                type="email"
                className={`${commonInputClasses} ${errors.dietitianEmail ? 'border-red-500' : ''}`}
                placeholder="Enter your email"
                required
                minLength="5"
                maxLength="50"
              />
              {errors.dietitianEmail && <div className={errorClasses}>{errors.dietitianEmail}</div>}
            </div>

            <div className="relative">
              <label htmlFor="dietitianPassword" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                id="dietitianPassword"
                name="password"
                type="password"
                className={`${commonInputClasses} ${errors.dietitianPassword ? 'border-red-500' : ''}`}
                placeholder="Enter your password"
                required
                minLength="6"
                maxLength="20"
              />
              {errors.dietitianPassword && <div className={errorClasses}>{errors.dietitianPassword}</div>}
            </div>
            
            {/* License Number field is already here for Dietitian */}
            <div className="relative">
              <label htmlFor="dietitianLicenseNumber" className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
              <input
                id="dietitianLicenseNumber"
                name="licenseNumber"
                type="text"
                className={`${commonInputClasses} ${errors.dietitianLicenseNumber ? 'border-red-500' : ''}`}
                placeholder="e.g., DLN123456"
                required
                minLength="9"
                maxLength="9"
              />
              {errors.dietitianLicenseNumber && <div className={errorClasses}>{errors.dietitianLicenseNumber}</div>}
            </div>

            <div className="flex items-center justify-between">
              <RememberMe />
              <Link to="/forgot-password" className="text-sm font-medium text-[#1E6F5C] hover:text-[#155345]">
                Forgot Password?
              </Link>
            </div>

            <SubmitButton />

            <p className="text-center text-sm mt-4">
              Don't have an account?{' '}
              <Link to={`/signup?role=${role}`} className={commonLinkClasses}>Sign Up</Link>
            </p>
          </form>
        );

      // ORGANIZATION
      case 'organization':
        return (
          <form id="organizationLoginForm" onSubmit={handleFormSubmit} className="space-y-4" noValidate>
            <div className="relative">
              <label htmlFor="organizationEmail" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="organizationEmail"
                name="email"
                type="email"
                className={`${commonInputClasses} ${errors.organizationEmail ? 'border-red-500' : ''}`}
                placeholder="Enter your email"
                required
                minLength="5"
                maxLength="50"
              />
              {errors.organizationEmail && <div className={errorClasses}>{errors.organizationEmail}</div>}
            </div>

            {/* Organization ID field is already here for Organization */}
            <div className="relative">
              <label htmlFor="organizationId" className="block text-sm font-medium text-gray-700 mb-1">Organization ID</label>
              <input
                id="organizationId"
                name="id"
                type="text"
                className={`${commonInputClasses} ${errors.organizationId ? 'border-red-500' : ''}`}
                placeholder="Enter organization ID (e.g., ORG1234)"
                required
                minLength="5"
                maxLength="20"
              />
              {errors.organizationId && <div className={errorClasses}>{errors.organizationId}</div>}
            </div>

            <div className="relative">
              <label htmlFor="organizationPassword" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                id="organizationPassword"
                name="password"
                type="password"
                className={`${commonInputClasses} ${errors.organizationPassword ? 'border-red-500' : ''}`}
                placeholder="Enter your password"
                required
                minLength="6"
                maxLength="20"
              />
              {errors.organizationPassword && <div className={errorClasses}>{errors.organizationPassword}</div>}
            </div>

            <div className="flex items-center justify-between">
              <RememberMe />
              <Link to="/forgot-password" className="text-sm font-medium text-[#1E6F5C] hover:text-[#155345]">
                Forgot Password?
              </Link>
            </div>

            <SubmitButton />

            <p className="text-center text-sm mt-4">
              Don't have an account?{' '}
              <Link to={`/signup?role=${role}`} className={commonLinkClasses}>Sign Up</Link>
            </p>
          </form>
        );

      // CORPORATE PARTNER
      case 'corporatepartner':
        return (
          <form id="corporatepartnerLoginForm" onSubmit={handleFormSubmit} className="space-y-4" noValidate>
            <div className="relative">
              <label htmlFor="corporatepartnerEmail" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="corporatepartnerEmail"
                name="email"
                type="email"
                className={`${commonInputClasses} ${errors.corporatepartnerEmail ? 'border-red-500' : ''}`}
                placeholder="Enter your email"
                required
                minLength="5"
                maxLength="50"
              />
              {errors.corporatepartnerEmail && <div className={errorClasses}>{errors.corporatepartnerEmail}</div>}
            </div>

            {/* *** NEW CORPORATE PARTNER ID FIELD ADDED HERE *** */}
            <div className="relative">
              <label htmlFor="corporatePartnerId" className="block text-sm font-medium text-gray-700 mb-1">Partner ID/License</label>
              <input
                id="corporatePartnerId"
                name="partnerId"
                type="text"
                className={`${commonInputClasses} ${errors.corporatePartnerId ? 'border-red-500' : ''}`}
                placeholder="Enter your Partner ID or License"
                required
                minLength="5"
                maxLength="20"
              />
              {errors.corporatePartnerId && <div className={errorClasses}>{errors.corporatePartnerId}</div>}
            </div>
            {/* *** END NEW FIELD *** */}
            
            <div className="relative">
              <label htmlFor="corporatepartnerPassword" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                id="corporatepartnerPassword"
                name="password"
                type="password"
                className={`${commonInputClasses} ${errors.corporatepartnerPassword ? 'border-red-500' : ''}`}
                placeholder="Enter your password"
                required
                minLength="6"
                maxLength="20"
              />
              {errors.corporatepartnerPassword && <div className={errorClasses}>{errors.corporatepartnerPassword}</div>}
            </div>

            <div className="flex items-center justify-between">
              <RememberMe />
              <Link to="/forgot-password" className="text-sm font-medium text-[#1E6F5C] hover:text-[#155345]">
                Forgot Password?
              </Link>
            </div>

            <SubmitButton />

            <p className="text-center text-sm mt-4">
              Don't have an account?{' '}
              <Link to={`/signup?role=${role}`} className={commonLinkClasses}>Sign Up</Link>
            </p>
          </form>
        );

      // ADMIN
      case 'admin':
        return (
          <form id="adminLoginForm" onSubmit={handleFormSubmit} className="space-y-4" noValidate>
            <div className="relative">
              <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="adminEmail"
                name="email"
                type="email"
                className={`${commonInputClasses} ${errors.adminEmail ? 'border-red-500' : ''}`}
                placeholder="Enter your email"
                required
                minLength="5"
                maxLength="50"
              />
              {errors.adminEmail && <div className={errorClasses}>{errors.adminEmail}</div>}
            </div>

            <div className="relative">
              <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                id="adminPassword"
                name="password"
                type="password"
                className={`${commonInputClasses} ${errors.adminPassword ? 'border-red-500' : ''}`}
                placeholder="Enter your password"
                required
                minLength="6"
                maxLength="20"
              />
              {errors.adminPassword && <div className={errorClasses}>{errors.adminPassword}</div>}
            </div>

            <div className="relative">
              <label htmlFor="adminKey" className="block text-sm font-medium text-gray-700 mb-1">Admin Key</label>
              <input
                id="adminKey"
                name="adminKey"
                type="password"
                className={`${commonInputClasses} ${errors.adminKey ? 'border-red-500' : ''}`}
                placeholder="Enter Admin Key"
                required
                minLength="5"
                maxLength="20"
              />
              {errors.adminKey && <div className={errorClasses}>{errors.adminKey}</div>}
            </div>

            <div className="flex items-center justify-between">
              <RememberMe />
              <Link to="/forgot-password" className="text-sm font-medium text-[#1E6F5C] hover:text-[#155345]">
                Forgot Password?
              </Link>
            </div>

            <SubmitButton />

            <p className="text-center text-sm mt-4">
              Don't have an account?{' '}
              <Link to={`/signup?role=${role}`} className={commonLinkClasses}>Sign Up</Link>
            </p>
          </form>
        );

      default:
        return (
          <div className="text-center p-8">
            <h3 className="text-xl text-gray-700 font-semibold mb-4">Please select a role to sign in.</h3>
            <button
              onClick={() => navigate('/role')}
              className="mt-4 bg-[#28B463] hover:bg-[#1E8449] text-white font-bold py-2 px-4 rounded-md shadow-lg transition-colors"
            >
              Select a Role
            </button>
          </div>
        );
    }
  };

  return (
    <section className="flex items-center justify-center bg-gray-100 p-4 min-h-[600px]">
      <div className="w-full max-w-lg p-8 mx-auto rounded-3xl shadow-2xl bg-white animate-fade-in">
        <h2 className="text-center text-3xl font-bold text-[#1E6F5C] mb-6">LOG IN AS {role.toUpperCase()}</h2>

        {/* Global Alert */}
        {message && (
          <div
            aria-live="polite"
            className={`p-3 mb-5 text-center text-base font-medium rounded-lg shadow-sm animate-slide-in w-full ${
              message.includes('successful') || message.includes('Redirecting') || message.includes('Verifying')
                ? 'text-green-800 bg-green-100 border border-green-300'
                : 'text-red-800 bg-red-100 border border-red-300'
            }`}
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

export default Signin;