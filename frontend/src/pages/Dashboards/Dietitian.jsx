import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar"; // Assuming a Sidebar component exists
import Status from "../../middleware/Status"; // Import Status component

// Mock Data (Replace with actual API data)
const mockDietitian = {
  name: "Dr. Alex Chen",
  age: 45,
  email: "alex.chen@nutriconnect.com",
  phone: "+91 99887 76655",
  profileImage:
    "https://img.freepik.com/free-photo/young-man-doctor-with-white-coat-stethoscope-smiles-portrait-hospital-clinic_1303-29477.jpg?w=1060&t=st=1701389000~exp=1701390000~hmac=a8c541c415324b91485c2c525f0a06c5b525d88665f8c6e2b8c569a9b1c7482f",
  // In a real app, profileImageBase64 would be fetched or null
};

// --- Main Dashboard Component ---
const DietitianDashboard = () => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(mockDietitian.profileImage);
  const [dietitianDetails, setDietitianDetails] = useState(mockDietitian); // Store fetched dietitian details
  const [showImageModal, setShowImageModal] = useState(false);
  const fileInputRef = React.useRef(null);

  // Fetch profile details from backend on component mount
  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        const token = localStorage.getItem('authToken_dietitian');
        if (!token) return;

        const response = await fetch('/api/getdietitiandetails', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (data.success) {
          // Update dietitian details from API response
          setDietitianDetails({
            name: data.name || mockDietitian.name,
            email: data.email || mockDietitian.email,
            phone: data.phone || mockDietitian.phone,
            age: data.age || mockDietitian.age,
            specialization: data.specialization || mockDietitian.specialization,
            experience: data.experience || mockDietitian.experience
          });
          
          // Update profile image
          if (data.profileImage) {
            setProfileImage(data.profileImage);
            localStorage.setItem('profileImage', data.profileImage);
          }
        }
      } catch (error) {
        console.error('Error fetching profile details:', error);
      }
    };

    fetchProfileDetails();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 1. Local Preview
    const reader = new FileReader();
    reader.onload = () => {
      setProfileImage(reader.result);
      // Store in localStorage for header display
      localStorage.setItem('profileImage', reader.result);
    };
    reader.readAsDataURL(file);

    // 2. Upload to backend
    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      // Get token from localStorage
      const token = localStorage.getItem('authToken_dietitian');
      
      if (!token) {
        alert('Session expired. Please login again.');
        navigate('/signin?role=dietitian');
        return;
      }

      const res = await fetch('/api/uploaddietitian', { 
        method: 'POST', 
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();

      if (data.success) {
        alert("Profile photo updated successfully!");
      } else {
        alert(`Upload failed: ${data.message || 'Unknown error'}`);
        // Revert to old image on failure if needed
        setProfileImage(mockDietitian.profileImage); 
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload error occurred.");
      setProfileImage(mockDietitian.profileImage);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("dietitianAuthToken"); // Use a distinct key
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Re-using the structure from the User Dashboard */}
      <Sidebar /> 

      {/* Main Content */}
      <div className="flex-1 p-6 lg:p-2">
        <h1 className="text-3xl lg:text-4xl font-bold text-green-900 mb-6 border-b border-gray-200 pb-4">
          Welcome, {dietitianDetails.name}! 
        </h1>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. Profile Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-green-600 flex flex-col items-center">
            <h3 className="text-xl font-bold text-teal-900 mb-5 text-center w-full">
              Dietitian Profile
            </h3>

            <div className="relative mb-4">
              <img
                src={profileImage}
                alt={`${dietitianDetails.name}'s Profile`}
                className="w-32 h-32 rounded-full object-cover border-4 border-green-600 cursor-pointer hover:opacity-80 transition"
                onClick={() => setShowImageModal(true)}
              />
              <label
                htmlFor="profileUpload"
                className="absolute bottom-0 right-0 bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer shadow hover:bg-green-700 transition"
              >
                <i className="fas fa-camera text-sm"></i>
              </label>
              <input
                type="file"
                id="profileUpload"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>

            <p className="text-xs text-gray-500 mb-4">
              Click camera to update photo
            </p>

            <h5 className="font-semibold text-lg text-gray-800">
              {dietitianDetails.name}
            </h5>
            <p className="text-sm text-gray-600">Age: {dietitianDetails.age}</p>
            <p className="text-sm text-gray-600">{dietitianDetails.email}</p>
            <p className="text-sm text-gray-600 mb-3">
              Contact: {dietitianDetails.phone}
            </p>

            <div className="flex gap-2 flex-wrap justify-center mt-auto">
              <button
                onClick={() => navigate("/dietitian/edit-profile")}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-600 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-600 hover:text-white transition"
              >
                <i className="fas fa-user-edit"></i> Edit Profile
              </button>
              <button
                onClick={() => navigate("/dietitian/change-pass")}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-400 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-100 transition"
              >
                <i className="fas fa-lock"></i> Change Password
              </button>
            </div>

            <span className="mt-4 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
              Active
            </span>
          </div>

          {/* 2. Document Verification Status Card (Dynamic content) */}
          <Status role="dietitian" />

          {/* 3. Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-blue-600">
            <h3 className="text-xl font-bold text-teal-900 mb-5 text-center">
              Quick Actions
            </h3>

            <div className="space-y-3">
              <button
                onClick={() => navigate("/recieved_diet")}
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-full hover:bg-blue-700 transition shadow flex items-center justify-center gap-2"
              >
                <i className="fas fa-shield-check"></i> View Verification Status
              </button>

              <button
                onClick={() => navigate("/dietitian-consultations")}
                className="w-full bg-amber-500 text-white font-semibold py-3 rounded-full hover:bg-amber-600 transition shadow flex items-center justify-center gap-2"
              >
                <i className="fas fa-users"></i> My Clients
              </button>

              <button
                onClick={() => navigate("/dietitian-meal-plans")}
                className="w-full bg-green-600 text-white font-semibold py-3 rounded-full hover:bg-green-700 transition shadow flex items-center justify-center gap-2"
              >
                <i className="fas fa-utensils"></i> Create Meal Plan
              </button>

              <button
                onClick={handleLogout}
                className="w-full bg-red-600 text-white font-semibold py-3 rounded-full hover:bg-red-700 transition shadow flex items-center justify-center gap-2 mt-4"
              >
                <i className="fas fa-sign-out-alt"></i> Log Out
              </button>
            </div>
          </div>
        </div>

        {/* 4. Notifications */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border-t-4 border-gray-400">
          <h3 className="text-xl font-bold text-teal-900 mb-5 text-center">
            Notifications
          </h3>

          <ul className="space-y-3">
            <li className="flex items-center gap-2 text-gray-700 p-2 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition">
              <i className="fas fa-bell text-yellow-500"></i>
              <span>You have a <span className="font-semibold text-gray-900">new client request</span>.</span>
            </li>
            <li className="flex items-center gap-2 text-gray-700 p-2 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition">
              <i className="fas fa-calendar-alt text-blue-500"></i>
              <span>Your appointment with <span className="font-semibold text-gray-900">John Doe</span> is scheduled for tomorrow.</span>
            </li>
            <li className="flex items-center gap-2 text-gray-700 p-2 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition">
              <i className="fas fa-check-circle text-green-500"></i>
              <span>Your documents have been <span className="font-semibold text-gray-900">successfully verified</span>.</span>
            </li>
          </ul>
        </div>

        {/* 5. Recent Activities */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border-t-4 border-gray-400">
          <h3 className="text-xl font-bold text-teal-900 mb-5 text-center">
            Recent Activities
          </h3>

          <ul className="space-y-3">
            <li className="flex items-center gap-2 text-gray-700 p-2 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition">
              <i className="fas fa-circle text-xs text-teal-600"></i>
              <span>Logged in today at <span className="font-semibold text-gray-900">10:00 AM</span></span>
            </li>
            <li className="flex items-center gap-2 text-gray-700 p-2 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition">
              <i className="fas fa-circle text-xs text-teal-600"></i>
              <span>Created a new meal plan for <span className="font-semibold text-gray-900">John Doe</span></span>
            </li>
            <li className="flex items-center gap-2 text-gray-700 p-2 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition">
              <i className="fas fa-circle text-xs text-teal-600"></i>
              <span>Uploaded <span className="font-semibold text-gray-900">new certification documents</span></span>
            </li>
          </ul>
        </div>

        {/* Image Modal */}
        {showImageModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
            onClick={() => setShowImageModal(false)}
          >
            <div
              className="bg-white rounded-2xl max-w-2xl w-full relative overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg z-10 transition"
                aria-label="Close modal"
              >
                <i className="fas fa-times text-lg"></i>
              </button>

              {/* Image Container */}
              <div className="flex items-center justify-center bg-gray-100 p-8 h-96" >
                <img
                  src={profileImage}
                  alt="Profile Full Size"
                  className="w-full h-full rounded-lg object-contain"
                  onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/400?text=Dietitian'}
                />
              </div>

              {/* Footer with user info */}
              <div className="bg-white p-6 border-t border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{mockDietitian.name}</h2>
                <p className="text-gray-600 mb-4">{mockDietitian.email}</p>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      setShowImageModal(false);
                      fileInputRef.current?.click();
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition"
                  >
                    <i className="fas fa-camera"></i> Change Photo
                  </button>
                  <button
                    onClick={() => setShowImageModal(false)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-400 text-gray-700 rounded-full font-medium hover:bg-gray-100 transition"
                  >
                    <i className="fas fa-times"></i> Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DietitianDashboard;