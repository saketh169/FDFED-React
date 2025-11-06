import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';

// Role-specific configuration
const roleConfig = {
  user: {
    tokenKey: 'authToken_user',
    signinPath: '/signin?role=user',
    dashboardPath: '/user/profile',
    roleLabel: 'User',
    apiEndpoint: '/api/getuserdetails',
    fields: ['name', 'phone', 'dob', 'gender', 'address']
  },
  dietitian: {
    tokenKey: 'authToken_dietitian',
    signinPath: '/signin?role=dietitian',
    dashboardPath: '/dietitian/profile',
    roleLabel: 'Dietitian',
    apiEndpoint: '/api/getdietitiandetails',
    fields: ['name', 'phone', 'age']
  },
  organization: {
    tokenKey: 'authToken_organization',
    signinPath: '/signin?role=organization',
    dashboardPath: '/organization/profile',
    roleLabel: 'Organization',
    apiEndpoint: '/api/getorganizationdetails',
    fields: ['name', 'phone', 'address']
  },
  admin: {
    tokenKey: 'authToken_admin',
    signinPath: '/signin?role=admin',
    dashboardPath: '/admin/profile',
    roleLabel: 'Admin',
    apiEndpoint: '/api/getadmindetails',
    fields: ['name', 'phone']
  },
  corporatepartner: {
    tokenKey: 'authToken_corporatepartner',
    signinPath: '/signin?role=corporatepartner',
    dashboardPath: '/corporatepartner/profile',
    roleLabel: 'Corporate Partner',
    apiEndpoint: '/api/getcorporatepartnerdetails',
    fields: ['name', 'phone', 'address']
  }
};

// Yup validation schema builder based on role fields
const getValidationSchema = (fields) => {
  const schemaShape = {};
  
  if (fields.includes('name')) {
    schemaShape.name = yup.string().min(5, 'Name must be at least 5 characters').required('Name is required');
  }
  
  if (fields.includes('phone')) {
    schemaShape.phone = yup
      .string()
      .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
      .required('Phone number is required');
  }
  
  if (fields.includes('dob')) {
    schemaShape.dob = yup.string().required('Date of birth is required');
  }
  
  if (fields.includes('gender')) {
    schemaShape.gender = yup.string().required('Gender is required');
  }
  
  if (fields.includes('address')) {
    schemaShape.address = yup.string().min(5, 'Address must be at least 5 characters').required('Address is required');
  }
  
  if (fields.includes('age')) {
    schemaShape.age = yup
      .number()
      .typeError('Age must be a number')
      .min(18, 'Age must be at least 18')
      .max(100, 'Age must be less than 100')
      .required('Age is required');
  }
  
  return yup.object().shape(schemaShape);
};

const EditProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [originalData, setOriginalData] = useState({});
  
  // Detect role from current path
  const detectRole = () => {
    if (location.pathname.includes('/user/')) return 'user';
    if (location.pathname.includes('/dietitian/')) return 'dietitian';
    if (location.pathname.includes('/organization/')) return 'organization';
    if (location.pathname.includes('/admin/')) return 'admin';
    if (location.pathname.includes('/corporatepartner/')) return 'corporatepartner';
    return 'user'; // Default fallback
  };
  
  const role = detectRole();
  const config = roleConfig[role];
  
  // React Hook Form with Yup validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch
  } = useForm({
    resolver: yupResolver(getValidationSchema(config.fields)),
    mode: 'onBlur'
  });
  
  const formData = watch();

  // Fetch user details on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem(config.tokenKey);
        if (!token) {
          setMessage('Session expired. Please login again.');
          setTimeout(() => navigate(config.signinPath), 2000);
          return;
        }

        const response = await axios.get(config.apiEndpoint, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.success) {
          const userData = {};
          
          // Populate form based on role-specific fields
          config.fields.forEach(field => {
            if (field === 'dob' && response.data[field]) {
              userData[field] = response.data[field].split('T')[0];
            } else {
              userData[field] = response.data[field] || '';
            }
          });
          
          // Email is always read-only
          userData.email = response.data.email || '';
          
          // Set form values
          Object.keys(userData).forEach(key => {
            setValue(key, userData[key]);
          });
          
          setOriginalData(userData);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        setMessage('Failed to load user details. Please try again.');
      } finally {
        setIsFetching(false);
      }
    };

    fetchUserDetails();
  }, [navigate, config, setValue]);

  const onSubmit = async (data) => {
    setMessage('');

    // Check if any changes were made
    const hasChanges = config.fields.some(key => data[key] !== originalData[key]);

    if (!hasChanges) {
      setMessage('No changes detected. Please modify at least one field.');
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem(config.tokenKey);
      if (!token) {
        setMessage('Session expired. Please login again.');
        setTimeout(() => navigate(config.signinPath), 2000);
        return;
      }

      // Only send fields that were changed
      const updatePayload = {};
      config.fields.forEach(key => {
        if (data[key] !== originalData[key]) {
          updatePayload[key] = data[key];
        }
      });

      const response = await axios.put('/api/update-profile', updatePayload, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setMessage('Profile updated successfully! Redirecting to dashboard...');
        setOriginalData(data); // Update original data
        setTimeout(() => {
          navigate(config.dashboardPath);
        }, 2000);
      }
    } catch (error) {
      console.error('Update profile error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update profile. Please try again.';
      setMessage(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    reset(originalData);
    setMessage('');
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-emerald-600 mb-4"></i>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-emerald-600">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => navigate(config.dashboardPath)}
              className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition mb-4"
            >
              <i className="fas fa-arrow-left"></i>
              <span>Back to Dashboard</span>
            </button>
            <h2 className="text-3xl font-bold text-teal-900">Edit Profile</h2>
            <p className="text-gray-600 mt-2">Update your {config.roleLabel.toLowerCase()} information</p>
          </div>

          {/* Message Display */}
          {message && (
            <div
              className={`p-4 mb-6 rounded-lg ${
                message.includes('Error') || message.includes('Failed')
                  ? 'bg-red-100 text-red-800 border border-red-300'
                  : message.includes('No changes')
                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                  : 'bg-green-100 text-green-800 border border-green-300'
              }`}
            >
              {message}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Full Name */}
              {config.fields.includes('name') && (
                <div className="md:col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register('name')}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-600`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>
              )}

              {/* Email (Read-only) */}
              <div className="md:col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  {...register('email')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 cursor-not-allowed"
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              {/* Phone */}
              {config.fields.includes('phone') && (
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    {...register('phone')}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-600`}
                    placeholder="10-digit phone number"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>
              )}

              {/* Date of Birth (User only) */}
              {config.fields.includes('dob') && (
                <div>
                  <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    id="dob"
                    {...register('dob')}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.dob ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-600`}
                  />
                  {errors.dob && (
                    <p className="text-red-500 text-sm mt-1">{errors.dob.message}</p>
                  )}
                </div>
              )}

              {/* Age (Dietitian only) */}
              {config.fields.includes('age') && (
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                    Age *
                  </label>
                  <input
                    type="number"
                    id="age"
                    {...register('age')}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.age ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-600`}
                    placeholder="Enter your age"
                  />
                  {errors.age && (
                    <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>
                  )}
                </div>
              )}

              {/* Gender (User only) */}
              {config.fields.includes('gender') && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender *
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="male"
                        {...register('gender')}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-600"
                      />
                      <span className="text-gray-700">Male</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="female"
                        {...register('gender')}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-600"
                      />
                      <span className="text-gray-700">Female</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="other"
                        {...register('gender')}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-600"
                      />
                      <span className="text-gray-700">Other</span>
                    </label>
                  </div>
                  {errors.gender && (
                    <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
                  )}
                </div>
              )}

              {/* Address */}
              {config.fields.includes('address') && (
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <textarea
                    id="address"
                    rows="3"
                    {...register('address')}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-600 resize-none`}
                    placeholder="Enter your complete address"
                  ></textarea>
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-emerald-600 text-white font-semibold py-3 rounded-lg hover:bg-emerald-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Updating Profile...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save mr-2"></i>
                    Save Changes
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-300 transition"
              >
                <i className="fas fa-undo mr-2"></i>
                Reset
              </button>
              <button
                type="button"
                onClick={() => navigate(config.dashboardPath)}
                className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Info Box */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              <i className="fas fa-info-circle mr-2"></i>
              Profile Update Information
            </h3>
            <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
              <li>Your email address cannot be changed</li>
              <li>All fields marked with * are required</li>
              <li>Changes will be saved immediately after submission</li>
              <li>Click "Reset" to restore original values</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
