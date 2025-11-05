import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    address: ''
  });
  const [originalData, setOriginalData] = useState({});
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Fetch user details on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('authToken_user');
        if (!token) {
          setMessage('Session expired. Please login again.');
          setTimeout(() => navigate('/signin?role=user'), 2000);
          return;
        }

        const response = await axios.get('/api/getuserdetails', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.success) {
          const userData = {
            name: response.data.name || '',
            email: response.data.email || '',
            phone: response.data.phone || '',
            dob: response.data.dob ? response.data.dob.split('T')[0] : '',
            gender: response.data.gender || '',
            address: response.data.address || ''
          };
          setFormData(userData);
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
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    // Validation
    if (!formData.name || formData.name.length < 5) {
      setMessage('Name must be at least 5 characters long.');
      return;
    }

    if (!formData.phone || formData.phone.length !== 10) {
      setMessage('Phone number must be exactly 10 digits.');
      return;
    }

    if (!formData.dob) {
      setMessage('Date of birth is required.');
      return;
    }

    if (!formData.gender) {
      setMessage('Gender is required.');
      return;
    }

    if (!formData.address || formData.address.length < 5) {
      setMessage('Address must be at least 5 characters long.');
      return;
    }

    // Check if any changes were made
    const hasChanges = Object.keys(formData).some(
      key => key !== 'email' && formData[key] !== originalData[key]
    );

    if (!hasChanges) {
      setMessage('No changes detected. Please modify at least one field.');
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('authToken_user');
      if (!token) {
        setMessage('Session expired. Please login again.');
        setTimeout(() => navigate('/signin?role=user'), 2000);
        return;
      }

      // Only send fields that were changed (excluding email)
      const updatePayload = {};
      Object.keys(formData).forEach(key => {
        if (key !== 'email' && formData[key] !== originalData[key]) {
          updatePayload[key] = formData[key];
        }
      });

      const response = await axios.put('/api/update-profile', updatePayload, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setMessage('Profile updated successfully! Redirecting to dashboard...');
        setOriginalData(formData); // Update original data
        setTimeout(() => {
          navigate('/user/profile');
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
    setFormData(originalData);
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
              onClick={() => navigate('/user/profile')}
              className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition mb-4"
            >
              <i className="fas fa-arrow-left"></i>
              <span>Back to Dashboard</span>
            </button>
            <h2 className="text-3xl font-bold text-teal-900">Edit Profile</h2>
            <p className="text-gray-600 mt-2">Update your personal information</p>
          </div>

          {/* Message Display */}
          {message && (
            <div
              className={`p-4 mb-6 rounded-lg ${
                message.includes('Error') || message.includes('required') || message.includes('must')
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="md:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  placeholder="Enter your full name"
                  required
                  minLength="5"
                />
              </div>

              {/* Email (Read-only) */}
              <div className="md:col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email (Cannot be changed)
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 cursor-not-allowed"
                  readOnly
                  disabled
                />
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  placeholder="Enter 10-digit phone number"
                  required
                  pattern="[0-9]{10}"
                  maxLength="10"
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  required
                />
              </div>

              {/* Gender */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender *
                </label>
                <div className="flex gap-6">
                  {['male', 'female', 'other'].map((genderOption) => (
                    <label key={genderOption} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value={genderOption}
                        checked={formData.gender === genderOption}
                        onChange={handleChange}
                        className="h-4 w-4 text-emerald-600 border-gray-300 focus:ring-emerald-600"
                        required
                      />
                      <span className="ml-2 text-gray-700 capitalize">{genderOption}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  placeholder="Enter your complete address"
                  required
                  minLength="5"
                ></textarea>
              </div>
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
                disabled={isLoading}
              >
                <i className="fas fa-undo mr-2"></i>
                Reset
              </button>
              <button
                type="button"
                onClick={() => navigate('/user/profile')}
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
              Important Information
            </h3>
            <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
              <li>Your email address cannot be changed for security reasons</li>
              <li>To change your password, use the "Change Password" option</li>
              <li>Ensure all information is accurate before saving</li>
              <li>Changes will be reflected immediately after saving</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
