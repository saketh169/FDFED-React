import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Chart from "chart.js/auto";

// --- Mock Data ---
const mockUser = {
  name: 'Jane Doe',
  age: 32,
  email: 'jane.doe@example.com',
  phone: '+91 98765 43210',
  address: '45 Green St, Chennai, IN',
  profileImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2TgOv9CMmsUzYKCcLGWPvqcpUk6HXp2mnww&s',
};

// Mock data structure matching EJS reference
const mockProgressData = [
  { createdAt: '2025-10-01', weight: 75, goal: 'Loss', waterIntake: 1.5 },
  { createdAt: '2025-10-08', weight: 74.5, goal: 'Loss', waterIntake: 1.8 },
  { createdAt: '2025-10-15', weight: 73.8, goal: 'Loss', waterIntake: 2.0 },
  { createdAt: '2025-10-22', weight: 73.5, goal: 'Loss', waterIntake: 2.2 },
].reverse(); // Reverse for chronologically descending order

// --- Chart Component ---
const ProgressChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const labels = data.slice(-10).map(entry => new Date(entry.createdAt).toLocaleDateString('en-US'));
    const weightValues = data.slice(-10).map(entry => entry.weight);

    chartInstance.current = new Chart(chartRef.current, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Weight (kg)',
          data: weightValues,
          borderColor: '#28a745', // Primary Green
          backgroundColor: 'rgba(40, 167, 69, 0.2)',
          borderWidth: 2,
          tension: 0.3,
          fill: true,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: false,
            suggestedMin: Math.min(...weightValues) - 1,
            suggestedMax: Math.max(...weightValues) + 1,
            grid: { color: '#e9ecef' }
          },
          x: {
            grid: { display: false }
          }
        }
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return <canvas ref={chartRef} className="h-[200px] w-full" />;
};

// --- Main Dashboard Component ---
const UserDashboard = () => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(mockUser.profileImage);
  const latestProgress = mockProgressData.length ? mockProgressData[0] : {};

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result);
        alert('Photo updated (Mock)! Ready to upload to backend.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* --- Sidebar (Themed Correction) --- */}
      <div className="hidden md:block w-64 bg-white text-gray-800 p-5 shadow-lg border-r border-gray-200 sidebar">
        <h4 className="text-xl font-extrabold mb-4 text-[#1E6F5C]">Dashboard Menu</h4>
        <nav className="space-y-1">
          <a href="/user" className="hover:bg-[#28a745] hover:text-white text-gray-700 font-medium flex items-center gap-3 rounded p-3 transition-all duration-200"><i className="fas fa-home"></i> Home</a>
          <a href="/user-guide" className="hover:bg-[#28a745] hover:text-white text-gray-700 font-medium flex items-center gap-3 rounded p-3 transition-all duration-200"><i className="fas fa-book"></i> Guide</a>
          <a href="/user-consultations" className="hover:bg-[#28a745] hover:text-white text-gray-700 font-medium flex items-center gap-3 rounded p-3 transition-all duration-200"><i className="fas fa-user-clock"></i> Appointments</a>
          <a href="/pricing" className="hover:bg-[#28a745] hover:text-white text-gray-700 font-medium flex items-center gap-3 rounded p-3 transition-all duration-200"><i className="fas fa-crown"></i> Pricing</a>
          <a href="/blog" className="hover:bg-[#28a745] hover:text-white text-gray-700 font-medium flex items-center gap-3 rounded p-3 transition-all duration-200"><i className="fas fa-blog"></i> Blog</a>
          <a href="/user-meal-plans" className="hover:bg-[#28a745] hover:text-white text-gray-700 font-medium flex items-center gap-3 rounded p-3 transition-all duration-200"><i className="fas fa-utensils"></i> Meal Plans</a>
          <a href="/user-schedule" className="hover:bg-[#28a745] hover:text-white text-gray-700 font-medium flex items-center gap-3 rounded p-3 transition-all duration-200"><i className="fas fa-calendar-check"></i> My Schedule</a>
        </nav>
        
        {/* Contact Section */}
        <div className="mt-8 p-4 border border-gray-300 rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold text-[#1E6F5C] mb-3">Support</h3>
          <p className="text-sm text-gray-700">Email: <a href="mailto:nutriconnect6@gmail.com" className="text-blue-600 hover:text-blue-800">support@nutriconnect.com</a></p>
          <p className="text-sm text-gray-700">Phone: <a href="tel:+917075783143" className="text-blue-600 hover:text-blue-800">+91 70757 83143</a></p>
          
          <h3 className="text-lg font-semibold text-[#1E6F5C] mt-4 mb-3">Follow Us</h3>
          {/* CORRECTED: Social icons are now bold green */}
          <div className="flex justify-start gap-4 text-[#28a745]">
            {['facebook', 'instagram', 'x-twitter', 'linkedin'].map((brand, index) => (
              <a key={index} href={`#${brand}`} className="hover:text-[#1E6F5C] transition-colors"><i className={`fa-brands fa-${brand} fa-xl font-bold`}></i></a>
            ))}
          </div>
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="flex-1 p-4 md:p-8">
        <h2 className="text-3xl font-extrabold text-[#1A4A40] mb-8 border-b pb-3 border-gray-200">Hello, {mockUser.name}! Your Wellness Overview</h2>
        
        {/* CORRECTED: Changed grid to ensure 3 columns on large screens for Profile, Progress, and Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* 1. User Info Card (Column 1) */}
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center border-t-4 border-[#28a745]">
            <h3 className="text-xl font-bold text-[#1A4A40] mb-4 w-full text-center">Your Profile</h3>
            
            <div className="relative mb-3">
              <img src={profileImage} className="w-36 h-36 rounded-full object-cover border-4 border-[#28a745] cursor-pointer" alt="User Profile" data-bs-toggle="modal" data-bs-target="#imageModal" />
              <label htmlFor="profileUpload" className="absolute bottom-1 right-1 bg-[#28a745] text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer shadow-md hover:bg-[#218838]">
                <i className="fas fa-camera text-sm"></i>
              </label>
              <input type="file" id="profileUpload" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </div>
            <p className="text-xs text-gray-500 mb-4">Click camera icon to update photo</p>
            
            <p className="font-semibold text-lg">{mockUser.name}</p>
            <p className="text-sm">**Age:** {mockUser.age} | **Phone:** {mockUser.phone}</p>
            <p className="text-sm">**Email:** {mockUser.email}</p>
            <p className="text-sm">**Address:** {mockUser.address}</p>
            
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <button onClick={() => navigate('/user_dash/edit-profile')} className="text-[#28a745] border border-[#28a745] hover:bg-green-50 transition-colors rounded-full px-4 py-1 text-sm font-medium">
                <i className="fas fa-user-edit mr-1"></i> Edit Profile
              </button>
              <button onClick={() => navigate('/user_dash/change-pass')} className="text-gray-600 border border-gray-400 hover:bg-gray-50 transition-colors rounded-full px-4 py-1 text-sm font-medium">
                <i className="fas fa-lock mr-1"></i> Change Password
              </button>
            </div>
            <span className="bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full mt-3">Active</span>
          </div>
          
          {/* 2. Progress Tracking Card (Column 2) - Occupies full space on mobile/mid, one column on large */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-[#28a745]">
            <h3 className="text-xl font-bold text-[#1A4A40] mb-4 w-full text-center">Your Progress & Metrics</h3>
            <div className="grid grid-cols-3 gap-4 mb-4 text-center text-sm font-medium">
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">**Weight:** {latestProgress.weight || 'N/A'} kg</div>
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">**Goal:** {latestProgress.goal || 'N/A'}</div>
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">**Water Intake:** {latestProgress.waterIntake || 'N/A'} L/day</div>
            </div>

            <div className="h-[200px] mb-4">
              <ProgressChart data={mockProgressData} />
            </div>
            
            <button onClick={() => navigate('/user-progress')} className="mt-4 bg-[#28a745] text-white hover:bg-[#218838] transition-colors rounded-full px-6 py-2 text-md w-full font-semibold">
              Update Progress & View Full Analytics
            </button>
          </div>
          
          {/* 3. Quick Actions Card (Column 3) */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500">
            <h3 className="text-xl font-bold text-[#1A4A40] mb-4 w-full text-center">Quick Actions</h3>
            <div className="flex flex-col gap-3">
              <button onClick={() => navigate('/dietitian-profiles')} className="bg-yellow-500 text-white hover:bg-yellow-600 rounded-full px-4 py-3 font-semibold shadow-md">
                <i className="fas fa-calendar-alt mr-2"></i> **Book Consultation**
              </button>
              <button onClick={() => navigate('/user-consultations')} className="bg-blue-600 text-white hover:bg-blue-700 rounded-full px-4 py-3 font-semibold shadow-md">
                <i className="fas fa-user-md mr-2"></i> **My Dietitians**
              </button>
              <button onClick={() => navigate('/user-meal-plans')} className="bg-[#28a745] text-white hover:bg-[#218838] rounded-full px-4 py-3 font-semibold shadow-md">
                <i className="fas fa-utensils mr-2"></i> **View Diet Plan**
              </button>
              <button onClick={handleLogout} className="bg-red-600 text-white hover:bg-red-700 rounded-full px-4 py-3 font-semibold shadow-md mt-4">
                <i className="fas fa-sign-out-alt mr-2"></i> **Log Out**
              </button>
            </div>
          </div>
        </div>
        
        {/* 4. Recent Activities Card (Across bottom) */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6 lg:col-span-3 border-t-4 border-gray-400">
          <h3 className="text-xl font-bold text-[#1A4A40] mb-4 w-full text-center">Recent Activities & Progress Logs</h3>
          <ul className="divide-y divide-gray-100">
            {mockProgressData.slice(0, 5).map((entry, index) => (
              <li key={index} className="py-3 text-gray-700 text-base flex items-center justify-between">
                <span className='font-semibold'>
                  <i className="fas fa-circle text-xs text-[#28a745] mr-3"></i>
                  Updated on {new Date(entry.createdAt).toLocaleDateString('en-US')}
                </span>
                <span className="text-sm">
                  Weight: **{entry.weight} kg** | Water: **{entry.waterIntake} L/day**
                </span>
              </li>
            ))}
          </ul>
          <div className="text-center mt-4">
               <button onClick={() => navigate('/user-progress')} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View all activities →
              </button>
          </div>
        </div>
      </div>
      
      {/* --- Custom Styling for Navbar Logo and General UI --- */}
      <style>{`
        /* The main navbar styling (assuming outside this component) should be light or contrasting */
        .logo {
          background-color: #D2F0C8 !important;
          color: #1E6F5C !important;
          padding: 8px 12px;
          border-radius: 10px;
        }
        .navbar {
          background-color: #343a40 !important; /* Kept dark for contrast if used as fixed header */
        }
        
        /* Sidebar Styling Corrections */
        .sidebar {
          height: 100vh;
          position: sticky;
          top: 0;
          overflow-y: auto;
        }
        
        /* Mobile Contact Footer (Mocked) */
        .contact-footer {
          display: none;
        }
        @media (max-width: 768px) {
             .sidebar { display: none; }
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;