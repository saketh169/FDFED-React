import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Chart from "chart.js/auto";
import Sidebar from "../../components/Sidebar/Sidebar"; 

// --- Mock Data ---
const mockPartner = {
  name: "Global Wellness Inc.",
  programName: "Enterprise Wellness Program",
  contact: "hr@globalwell.com",
  duration: "45 Days Remaining",
  totalLicenses: 5000,
  activeUsers: 4520,
  enrollmentRate: "90.4%",
  currentCommissionTier: "Volume Gold",
  lastPayout: "₹2,54,800.00",
  nextContractDate: "Jan 1, 2026",
  logoImage: "https://img.freepik.com/free-vector/modern-city-skyline-logo-template_23-2148408453.jpg?w=740&t=st=1701476000~exp=1701477000~hmac=5c6a1d8a1c93a0b388b39d73d9e0f63e9f4e2c0e8f7f2b1c2b5d4911d9a0d8c7",
};

const mockEngagementData = {
  labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
  sessionCount: [1500, 1800, 2200, 1900, 2500, 2800],
  consultationBookings: [30, 45, 55, 60, 75, 85],
};

// --- Sub-Component: Metrics Chart (Same logic as ProgressChart, updated visuals) ---
const EngagementChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current || data.sessionCount.length === 0) return;

    const ctx = chartRef.current.getContext("2d");
    if (chartInstance.current) chartInstance.current.destroy();

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.labels,
        datasets: [
          {
            label: "Employee Sessions",
            data: data.sessionCount,
            borderColor: "#27AE60",
            backgroundColor: "rgba(39, 174, 96, 0.1)",
            borderWidth: 3,
            pointBackgroundColor: "#27AE60",
            pointRadius: 5,
            tension: 0.4,
            yAxisID: "y-sessions",
            fill: true,
          },
          {
            label: "Consultations Booked",
            data: data.consultationBookings,
            borderColor: "#0070c0", // Blue
            backgroundColor: "rgba(0, 112, 192, 0.5)",
            type: 'bar',
            yAxisID: "y-bookings",
            borderRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'bottom' },
          tooltip: { backgroundColor: "#1A4A40", titleColor: "#fff", bodyColor: "#fff" },
        },
        scales: {
          "y-sessions": {
            position: 'left',
            beginAtZero: true,
            title: { display: true, text: 'Sessions' },
            grid: { color: "#e5e7eb" },
          },
          "y-bookings": {
            position: 'right',
            beginAtZero: true,
            title: { display: true, text: 'Bookings' },
            grid: { drawOnChartArea: false },
            ticks: { color: "#4b5563" },
          },
        },
      },
    });

    return () => chartInstance.current?.destroy();
  }, [data]);

  return <canvas ref={chartRef} className="h-96 w-full" />;
};


// --- Main Corporate Dashboard Component ---
const CorporateDashboard = () => {
  const navigate = useNavigate();
  const [partnerLogo, setPartnerLogo] = useState(mockPartner.logoImage);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPartnerLogo(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("corporateAuthToken");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 lg:p-10">
        <h1 className="text-3xl lg:text-4xl font-bold text-teal-900 mb-8 border-b border-gray-200 pb-4">
          👋 Welcome, {mockPartner.name}!
        </h1>

        {/* Grid Layout (Profile, Metrics, Quick Actions) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* 1. Profile Card (Partner Identity and Key Status) - LEFT COLUMN */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-emerald-600 flex flex-col items-center">
            <h3 className="text-xl font-bold text-teal-900 mb-5 text-center w-full">Partner Profile</h3>

            {/* Logo Upload Area */}
            <div className="relative mb-4">
              <img
                src={partnerLogo}
                alt={`${mockPartner.name} Logo`}
                className="w-32 h-32 object-contain border-4 border-emerald-600 p-2 bg-white rounded-xl"
                onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/128?text=Logo'}
              />
              <label
                htmlFor="logoUpload"
                className="absolute bottom-0 right-0 bg-emerald-600 text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer shadow hover:bg-emerald-700 transition"
                aria-label="Upload partner logo"
              >
                <i className="fas fa-camera text-sm"></i>
              </label>
              <input
                type="file"
                id="logoUpload"
                accept="image/*"
                className="hidden"
                onChange={handleLogoUpload}
              />
            </div>

            <p className="font-semibold text-lg text-gray-800 text-center">{mockPartner.programName}</p>
            <p className="text-sm text-gray-600 mb-4">{mockPartner.contact}</p>

            {/* Key Agreement Status Boxes */}
            <div className="w-full space-y-2">
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-xs text-gray-600">Duration Left</p>
                    <p className="font-bold text-yellow-700">{mockPartner.duration}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-xs text-gray-600">Commission Tier</p>
                    <p className="font-bold text-purple-700">{mockPartner.currentCommissionTier}</p>
                </div>
            </div>

            <span className="mt-4 bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
              Active Partner
            </span>
          </div>

          {/* 2. Key Metrics & Licensing Status - CENTER COLUMN */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-blue-600">
            <h3 className="text-xl font-bold text-teal-900 mb-5 text-center">Licensing & Financial Status</h3>

            {/* Metric Boxes (Similar to User Dashboard's progress metrics) */}
            <div className="grid grid-cols-2 gap-3 mb-5 text-center">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-gray-600">Total Licenses</p>
                <p className="font-bold text-blue-700">{mockPartner.totalLicenses.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-xs text-gray-600">Active Users</p>
                <p className="font-bold text-green-700">{mockPartner.activeUsers.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600">Enrollment Rate</p>
                <p className="font-bold text-gray-700">{mockPartner.enrollmentRate}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-xs text-gray-600">Last Payout</p>
                <p className="font-bold text-purple-700">{mockPartner.lastPayout}</p>
              </div>
            </div>

            {/* Renewal Call to Action */}
            <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg text-center">
                <p className="font-semibold text-red-800 mb-1">Contract Renewal Due:</p>
                <p className="text-lg font-extrabold text-red-900">{mockPartner.nextContractDate}</p>
            </div>

            <button
              onClick={() => navigate("/contract_renewal")}
              className="w-full bg-red-600 text-white font-semibold py-2.5 rounded-full hover:bg-red-700 transition shadow-md mt-4"
            >
              <i className="fas fa-file-contract mr-2"></i> Start Renewal Process
            </button>
          </div>

          {/* 3. Quick Actions Card - RIGHT COLUMN */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-amber-500">
            <h3 className="text-xl font-bold text-teal-900 mb-5 text-center">Quick Actions</h3>

            <div className="space-y-3">
              <button
                onClick={() => navigate("/partner_licensing_management")}
                className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-full hover:bg-emerald-700 transition shadow flex items-center justify-center gap-2"
              >
                <i className="fas fa-box"></i> Manage Bulk Licenses
              </button>

              <button
                onClick={() => navigate("/partner_payouts")}
                className="w-full bg-amber-500 text-white font-semibold py-3 rounded-full hover:bg-amber-600 transition shadow flex items-center justify-center gap-2"
              >
                <i className="fas fa-money-check-alt"></i> View Commissions
              </button>

              <button
                onClick={() => navigate("/program_reports")}
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-full hover:bg-blue-700 transition shadow flex items-center justify-center gap-2"
              >
                <i className="fas fa-chart-bar"></i> Download ROI Report
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

        {/* 4. Engagement Chart (Detailed Data View) - FULL WIDTH */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border-t-4 border-gray-400">
          <h3 className="text-xl font-bold text-teal-900 mb-5 text-center">Engagement & Booking Trend</h3>

          <div className="h-96 mb-5 -mx-6 px-6">
            <EngagementChart data={mockEngagementData} />
          </div>

          <div className="text-center mt-5">
            <button
              onClick={() => navigate("/partner_analytics")}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              View Detailed Analytics →
            </button>
          </div>
        </div>

        {/* 5. Notifications/Alerts (Detailed Data View) - FULL WIDTH (Example card for consistency) */}
         <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border-t-4 border-red-500">
            <h3 className="text-xl font-bold text-[#1A4A40] mb-5 text-center">Program Alerts & Notifications</h3>
            <ul className="space-y-3">
              <li className="flex justify-between items-center text-sm text-gray-700 p-2 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition">
                <span className="flex items-center gap-2 font-medium text-red-700">
                  <i className="fas fa-exclamation-triangle text-lg"></i>
                  **High Priority:** Commission Tier review is due next month.
                </span>
                <span className="text-gray-600">
                  **Action:** Review Financials
                </span>
              </li>
              <li className="flex justify-between items-center text-sm text-gray-700 p-2 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition">
                <span className="flex items-center gap-2 font-medium text-green-700">
                  <i className="fas fa-check-circle text-lg"></i>
                  **Success:** 15 bulk consultation blocks added today.
                </span>
                <span className="text-gray-600">
                  **Usage:** 2%
                </span>
              </li>
            </ul>
        </div>
      </div>
    </div>
  );
};

export default CorporateDashboard;