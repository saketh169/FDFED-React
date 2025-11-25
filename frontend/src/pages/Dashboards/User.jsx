import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Chart from "chart.js/auto";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useAuthContext } from "../../hooks/useAuthContext";

// Mock Data
const mockUser = {
  name: "Jane Doe",
  age: 32,
  email: "jane.doe@example.com",
  phone: "+91 98765 43210",
  address: "45 Green St, Chennai, IN",
  profileImage:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2TgOv9CMmsUzYKCcLGWPvqcpUk6HXp2mnww&s",
};

const mockProgressData = [
  { createdAt: "2025-10-22", weight: 73.5, goal: "Loss", waterIntake: 2.2 },
  { createdAt: "2025-10-15", weight: 73.8, goal: "Loss", waterIntake: 2.0 },
  { createdAt: "2025-10-08", weight: 74.5, goal: "Loss", waterIntake: 1.8 },
  { createdAt: "2025-10-01", weight: 75, goal: "Loss", waterIntake: 1.5 },
];

// Progress Chart Component - Retained as it is excellent
const ProgressChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;

    const ctx = chartRef.current.getContext("2d");
    if (chartInstance.current) chartInstance.current.destroy();

    const labels = data.map((d) => new Date(d.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }));
    const weights = data.map((d) => d.weight);

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Weight (kg)",
            data: weights,
            borderColor: "#27AE60", // Emerald Green
            backgroundColor: "rgba(39, 174, 96, 0.1)",
            borderWidth: 3,
            pointBackgroundColor: "#27AE60",
            pointRadius: 5,
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { backgroundColor: "#1A4A40", titleColor: "#fff", bodyColor: "#fff" }, // Dark Teal Tooltip
        },
        scales: {
          y: {
            beginAtZero: false,
            suggestedMin: Math.min(...weights) - 1,
            suggestedMax: Math.max(...weights) + 1,
            grid: { color: "#e5e7eb" },
            ticks: { color: "#4b5563" },
          },
          x: {
            grid: { display: false },
            ticks: { color: "#4b5563" },
          },
        },
      },
    });

    return () => chartInstance.current?.destroy();
  }, [data]);

  return <canvas ref={chartRef} className="h-48 w-full" />;
};

// Main Dashboard
const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useAuthContext();
  const [profileImage, setProfileImage] = useState(mockUser.profileImage);
  const [isUploading, setIsUploading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  // Ensures 'latest' is safely accessed for metrics
  const latest = mockProgressData[0] || {};

  // Set profile image from user data when available
  useEffect(() => {
    if (user?.profileImage) {
      setProfileImage(user.profileImage);
      // Don't store profile images in localStorage to avoid quota issues
    } else {
      // Profile images are now fetched from server, no localStorage fallback
      setProfileImage(null);
    }
  }, [user, user?.profileImage]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview image immediately
    const reader = new FileReader();
    reader.onload = () => {
      setProfileImage(reader.result);
      // Don't store in localStorage to avoid quota issues
    };
    reader.readAsDataURL(file);

    // Upload to backend
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('profileImage', file);

      // Get token from context or localStorage
      let authToken = token;
      if (!authToken) {
        // Fallback to localStorage if context doesn't have token
        authToken = localStorage.getItem('authToken_user');
      }

      if (!authToken) {
        alert('Session expired. Please login again.');
        navigate('/signin?role=user');
        return;
      }

      const response = await fetch('/api/uploaduser', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Profile photo uploaded successfully!');
        // Refresh user data from AuthContext to get the updated profileImage
        if (user?.id) {
          // Force a re-fetch of user details by triggering a page reload or context refresh
          window.location.reload();
        }
      } else {
        alert(`Upload failed: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload error occurred. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = () => {
    logout(); // Use context logout method
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Placeholder */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-2 lg:p-2">
        <h1 className="text-3xl lg:text-4xl font-bold text-teal-900 mb-6 border-b border-gray-200 pb-4">
          Welcome , {user?.name || mockUser.name}! 
        </h1>

        {/* Grid Layout (3 columns for large screens) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* 1. Profile Card (Consistent Styling) */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-emerald-600 flex flex-col items-center">
            <h3 className="text-xl font-bold text-teal-900 mb-5 text-center w-full">Your Profile</h3>

            <div className="relative mb-4">
              <img
                src={profileImage}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-emerald-600 cursor-pointer hover:opacity-80 transition"
                onClick={() => setShowImageModal(true)}
                onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/128?text=User'}
              />
              <label
                htmlFor="profileUpload"
                className="absolute bottom-0 right-0 bg-emerald-600 text-white rounded-full w-9 h-9 flex items-center justify-center cursor-pointer shadow hover:bg-emerald-700 transition"
                aria-label="Upload profile photo"
              >
                <i className="fas fa-camera text-sm"></i>
              </label>
              <input
                type="file"
                id="profileUpload"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={isUploading}
              />
            </div>

            <p className="text-xs text-gray-500 mb-4">
              {isUploading ? "Uploading..." : "Click camera to update photo"}
            </p>

            <p className="font-semibold text-lg text-gray-800">{user?.name || mockUser.name}</p>
            <p className="text-sm text-gray-600">Age: {user?.age || mockUser.age}</p>
            <p className="text-sm text-gray-600">Email: {user?.email || mockUser.email}</p>
            <p className="text-sm text-gray-600">Phone: {user?.phone || mockUser.phone}</p>
            <p className="text-sm text-gray-600 mb-4">{user?.address || mockUser.address}</p>

            <div className="flex gap-2 flex-wrap justify-center">
              <button
                onClick={() => navigate("/user/edit-profile")}
                className="flex items-center gap-1.5 px-4 py-2 border border-green-600 text-green-600 rounded-full text-sm font-medium hover:bg-green-600 hover:text-white transition"
              >
                <i className="fas fa-user-edit"></i> Edit Profile
              </button>
              <button
                onClick={() => navigate("/user/change-pass")}
                className="flex items-center gap-1.5 px-4 py-2 border border-gray-400 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-100 transition"
              >
                <i className="fas fa-lock"></i> Change Password
              </button>
            </div>

            <span className="mt-4 bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
              Active
            </span>
          </div>

          {/* 2. Progress & Metrics Card (Chart Integration) */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-emerald-600">
            <h3 className="text-xl font-bold text-teal-900 mb-5 text-center">Progress & Metrics</h3>

            {/* Metric Boxes */}
            <div className="grid grid-cols-3 gap-3 mb-5 text-center">
              <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                <p className="text-xs text-gray-600">Weight</p>
                <p className="font-bold text-emerald-700">{latest.weight || "N/A"} kg</p>
              </div>
              <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                <p className="text-xs text-gray-600">Goal</p>
                <p className="font-bold text-emerald-700">{latest.goal || "N/A"}</p>
              </div>
              <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                <p className="text-xs text-gray-600">Water</p>
                <p className="font-bold text-emerald-700">{latest.waterIntake || "N/A"} L</p>
              </div>
            </div>

            {/* Chart */}
            <div className="h-48 mb-5 -mx-6 px-6">
              <ProgressChart data={mockProgressData} />
            </div>

            <button
              onClick={() => navigate("/user/progress")}
              className="w-full bg-emerald-600 text-white font-semibold py-2.5 rounded-full hover:bg-emerald-700 transition shadow-md"
            >
              <i className="fas fa-chart-line mr-2"></i> View Full Progress
            </button>
          </div>

          {/* 3. Quick Actions Card (Consistent Button Styling) */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-blue-600">
            <h3 className="text-xl font-bold text-teal-900 mb-5 text-center">Quick Actions</h3>

            <div className="space-y-3">
              <button
                onClick={() => navigate("/user/dietitian-profiles")}
                className="w-full bg-amber-500 text-white font-semibold py-3 rounded-full hover:bg-amber-600 transition shadow flex items-center justify-center gap-2"
              >
                <i className="fas fa-calendar-alt"></i> Book Consultation
              </button>

              <button
                onClick={() => navigate("/user/progress")}
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-full hover:bg-blue-700 transition shadow flex items-center justify-center gap-2"
              >
                <i className="fas fa-chart-line"></i> My Progress
              </button>

              <button
                onClick={() => navigate("/user/get-plans")}
                className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-full hover:bg-emerald-700 transition shadow flex items-center justify-center gap-2"
              >
                <i className="fas fa-utensils"></i> Get Diet Plan
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
              <span>Your consultation with <span className="font-semibold text-gray-900">Dr. Sarah</span> is tomorrow at <span className="font-semibold text-gray-900">2:00 PM</span>.</span>
            </li>
            <li className="flex items-center gap-2 text-gray-700 p-2 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition">
              <i className="fas fa-calendar-alt text-blue-500"></i>
              <span>Your meal plan for this week has been <span className="font-semibold text-gray-900">updated</span>.</span>
            </li>
            <li className="flex items-center gap-2 text-gray-700 p-2 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition">
              <i className="fas fa-check-circle text-green-500"></i>
              <span>Great progress this week! You've completed <span className="font-semibold text-gray-900">4 out of 7 goals</span>.</span>
            </li>
          </ul>
        </div>

        {/* 5. Recent Activities (Consistent Card Styling) */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border-t-4 border-gray-400">
          <h3 className="text-xl font-bold text-teal-900 mb-5 text-center">Recent Activities</h3>

          <ul className="space-y-3">
            {mockProgressData.slice(0, 5).map((entry, i) => (
              <li key={i} className="flex justify-between items-center text-sm text-gray-700 p-2 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition">
                <span className="flex items-center gap-2 font-medium text-gray-800">
                  <i className="fas fa-dot-circle text-xs text-emerald-600"></i>
                  {new Date(entry.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="text-gray-600">
                  Weight: <strong className="font-semibold text-emerald-700">{entry.weight} kg</strong> • Water: <strong className="font-semibold text-blue-600">{entry.waterIntake} L</strong>
                </span>
              </li>
            ))}
          </ul>

          <div className="text-center mt-5">
            <button
              onClick={() => navigate("/user/progress")}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              View all activities →
            </button>
          </div>
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
              <div className="flex items-center justify-center bg-gray-100 p-8 h-96">
                <img
                  src={profileImage}
                  alt="Profile Full Size"
                  className="w-full h-full rounded-lg object-contain"
                  onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/400?text=User'}
                />
              </div>

              {/* Footer with user info */}
              <div className="bg-white p-6 border-t border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{user?.name || mockUser.name}</h2>
                <p className="text-gray-600 mb-4">{user?.email || mockUser.email}</p>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      setShowImageModal(false);
                      document.getElementById('profileUpload').click();
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-full font-medium hover:bg-emerald-700 transition"
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

export default UserDashboard;