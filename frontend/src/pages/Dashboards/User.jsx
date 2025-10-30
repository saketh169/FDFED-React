import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Chart from "chart.js/auto";
import Sidebar from "../../components/Sidebar/Sidebar";

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
  const [profileImage, setProfileImage] = useState(mockUser.profileImage);
  // Ensures 'latest' is safely accessed for metrics
  const latest = mockProgressData[0] || {}; 

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      // Optimistic UI update
      reader.onload = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);

      // In a real app, you would include an asynchronous fetch call here
      // to upload the image file to the backend server.
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Placeholder */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 lg:p-10">
        <h1 className="text-3xl lg:text-4xl font-bold text-teal-900 mb-8 border-b border-gray-200 pb-4">
          Hello, {mockUser.name}! Your Wellness Dashboard
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
                className="w-32 h-32 rounded-full object-cover border-4 border-emerald-600"
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
              />
            </div>

            <p className="text-xs text-gray-500 mb-4">Click camera to update photo</p>

            <p className="font-semibold text-lg text-gray-800">{mockUser.name}</p>
            <p className="text-sm text-gray-600">Age: {mockUser.age} • Phone: {mockUser.phone}</p>
            <p className="text-sm text-gray-600">{mockUser.email}</p>
            <p className="text-sm text-gray-600 mb-4">{mockUser.address}</p>

            <div className="mt-5 flex gap-2 flex-wrap justify-center">
              <button
                onClick={() => navigate("/user_dash/edit-profile")}
                className="flex items-center gap-1.5 px-4 py-2 border border-emerald-600 text-emerald-600 rounded-full text-sm font-medium hover:bg-emerald-600 hover:text-white transition"
              >
                <i className="fas fa-user-edit"></i> Edit Profile
              </button>
              <button
                onClick={() => navigate("/user_dash/change-pass")}
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
              onClick={() => navigate("/user-progress")}
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
                onClick={() => navigate("/dietitian-profiles")}
                className="w-full bg-amber-500 text-white font-semibold py-3 rounded-full hover:bg-amber-600 transition shadow flex items-center justify-center gap-2"
              >
                <i className="fas fa-calendar-alt"></i> Book Consultation
              </button>

              <button
                onClick={() => navigate("/user-consultations")}
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-full hover:bg-blue-700 transition shadow flex items-center justify-center gap-2"
              >
                <i className="fas fa-user-md"></i> My Dietitians
              </button>

              <button
                onClick={() => navigate("/user-meal-plans")}
                className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-full hover:bg-emerald-700 transition shadow flex items-center justify-center gap-2"
              >
                <i className="fas fa-utensils"></i> View Diet Plan
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

        {/* 4. Recent Activities (Consistent Card Styling) */}
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
              onClick={() => navigate("/user-progress")}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              View all activities →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;