import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';

const Signin = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const roleFromUrl = searchParams.get('role') || 'user';
    setRole(roleFromUrl);
  }, [searchParams]);

  const validateForm = (form) => {
    const errors = {};
    const inputs = form.querySelectorAll('input');

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

    return errors;
  };

  const handleFormSubmit = (e) => {
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

    const roleRoutes = {
      user: '/user/home',
      admin: '/admin/home',
      organization: '/organization/home',
      corporatepartner: '/corporatepartner/home',
      dietitian: '/dietitian/home',
    };

    if (!roleRoutes[role]) {
      setMessage('Error: Invalid role.');
      return;
    }

    setMessage('Sign-in successful! Redirecting...');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      setMessage('');
      navigate(roleRoutes[role]);
    }, 1500);
  };

  const renderForm = () => {
    const commonInputClasses =
      'w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6a994e] transition-all duration-300';
    const commonButtonClasses =
      'w-full bg-[#1E6F5C] text-white font-semibold py-3 rounded-lg hover:bg-[#155345] transition-colors duration-300 shadow-md hover:shadow-lg';
    const commonLinkClasses = 'text-[#1E6F5C] hover:text-[#155345] font-medium transition-colors duration-300';
    const errorClasses = 'text-red-500 text-xs mt-1';

    const RememberMe = () => (
      <div className="flex items-center">
        <input
          type="checkbox"
          className="h-4 w-4 text-[#1E6F5C] border-gray-300 rounded focus:ring-[#1E6F5C]"
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

            <button type="submit" className={commonButtonClasses}>Log In</button>

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
                type="password"
                className={`${commonInputClasses} ${errors.dietitianPassword ? 'border-red-500' : ''}`}
                placeholder="Enter your password"
                required
                minLength="6"
                maxLength="20"
              />
              {errors.dietitianPassword && <div className={errorClasses}>{errors.dietitianPassword}</div>}
            </div>

            <div className="relative">
              <label htmlFor="dietitianLicenseNumber" className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
              <input
                id="dietitianLicenseNumber"
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

            <button type="submit" className={commonButtonClasses}>Log In</button>

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
              <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
              <input
                id="organizationName"
                type="text"
                className={`${commonInputClasses} ${errors.organizationName ? 'border-red-500' : ''}`}
                placeholder="Enter organization name"
                required
                minLength="3"
                maxLength="50"
              />
              {errors.organizationName && <div className={errorClasses}>{errors.organizationName}</div>}
            </div>

            <div className="relative">
              <label htmlFor="organizationEmail" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="organizationEmail"
                type="email"
                className={`${commonInputClasses} ${errors.organizationEmail ? 'border-red-500' : ''}`}
                placeholder="Enter your email"
                required
                minLength="5"
                maxLength="50"
              />
              {errors.organizationEmail && <div className={errorClasses}>{errors.organizationEmail}</div>}
            </div>

            <div className="relative">
              <label htmlFor="organizationId" className="block text-sm font-medium text-gray-700 mb-1">Organization ID</label>
              <input
                id="organizationId"
                type="text"
                className={`${commonInputClasses} ${errors.organizationId ? 'border-red-500' : ''}`}
                placeholder="Enter organization ID"
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

            <button type="submit" className={commonButtonClasses}>Log In</button>

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
                type="email"
                className={`${commonInputClasses} ${errors.corporatepartnerEmail ? 'border-red-500' : ''}`}
                placeholder="Enter your email"
                required
                minLength="5"
                maxLength="50"
              />
              {errors.corporatepartnerEmail && <div className={errorClasses}>{errors.corporatepartnerEmail}</div>}
            </div>

            <div className="relative">
              <label htmlFor="corporatepartnerPassword" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                id="corporatepartnerPassword"
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

            <button type="submit" className={commonButtonClasses}>Log In</button>

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

            <button type="submit" className={commonButtonClasses}>Log In</button>

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
        <h2 className="text-center text-3xl font-bold text-[#1E6F5C] mb-6">LOG IN</h2>

        {/* Global Alert */}
        {message && (
          <div
            aria-live="polite"
            className={`p-3 mb-5 text-center text-base font-medium rounded-lg shadow-sm animate-slide-in w-full ${
              message.includes('successful') || message.includes('Redirecting')
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