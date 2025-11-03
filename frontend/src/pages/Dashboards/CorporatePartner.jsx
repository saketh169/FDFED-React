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
  const [partnerDetails, setPartnerDetails] = useState(mockPartner); // Store fetched partner details
  const [showImageModal, setShowImageModal] = useState(false);

  // Fetch profile details from backend on component mount
  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        const token = localStorage.getItem('authToken_corporatepartner');
        if (!token) return;

        const response = await fetch('/api/getcorporatepartnerdetails', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (data.success) {
          // Update partner details from API response
          setPartnerDetails({
            name: data.name || mockPartner.name,
            programName: data.programName || mockPartner.programName,
            contact: data.contact || mockPartner.contact,
            duration: data.duration || mockPartner.duration,
            totalLicenses: data.totalLicenses || mockPartner.totalLicenses,
            activeUsers: data.activeUsers || mockPartner.activeUsers,
            enrollmentRate: data.enrollmentRate || mockPartner.enrollmentRate,
            currentCommissionTier: data.currentCommissionTier || mockPartner.currentCommissionTier,
            lastPayout: data.lastPayout || mockPartner.lastPayout,
            nextContractDate: data.nextContractDate || mockPartner.nextContractDate
          });
          
          // Update partner logo
          if (data.profileImage) {
            setPartnerLogo(data.profileImage);
            localStorage.setItem('profileImage', data.profileImage);
          }
        }
      } catch (error) {
        console.error('Error fetching profile details:', error);
      }
    };

    fetchProfileDetails();
  }, []);

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Local preview
    const reader = new FileReader();
    reader.onload = () => {
      setPartnerLogo(reader.result);
      // Store in localStorage for header display
      localStorage.setItem('profileImage', reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to backend
    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      // Get token from localStorage
      const token = localStorage.getItem('authToken_corporatepartner');
      
      if (!token) {
        alert('Session expired. Please login again.');
        navigate('/signin?role=corporatepartner');
        return;
      }

      const res = await fetch('/api/uploadcorporatepartner', { 
        method: 'POST', 
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();

      if (data.success) {
        alert("Logo updated successfully!");
      } else {
        alert(`Upload failed: ${data.message || 'Unknown error'}`);
        setPartnerLogo(mockPartner.logoImage);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload error occurred.");
      setPartnerLogo(mockPartner.logoImage);
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
          👋 Welcome, {partnerDetails.name}!
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
                alt={`${partnerDetails.name} Logo`}
                className="w-32 h-32 object-contain border-4 border-emerald-600 p-2 bg-white rounded-xl cursor-pointer hover:opacity-80 transition"
                onClick={() => setShowImageModal(true)}
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

            <p className="font-semibold text-lg text-gray-800 text-center">{partnerDetails.programName}</p>
            <p className="text-sm text-gray-600 mb-2">Email: {partnerDetails.email}</p>
            <p className="text-sm text-gray-600 mb-4">Contact: {partnerDetails.contact}</p>

            {/* Key Agreement Status Boxes */}
            <div className="w-full space-y-2">
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-xs text-gray-600">Duration Left</p>
                    <p className="font-bold text-yellow-700">{partnerDetails.duration}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-xs text-gray-600">Commission Tier</p>
                    <p className="font-bold text-purple-700">{partnerDetails.currentCommissionTier}</p>
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
                <p className="font-bold text-blue-700">{partnerDetails.totalLicenses.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-xs text-gray-600">Active Users</p>
                <p className="font-bold text-green-700">{partnerDetails.activeUsers.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600">Enrollment Rate</p>
                <p className="font-bold text-gray-700">{partnerDetails.enrollmentRate}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-xs text-gray-600">Last Payout</p>
                <p className="font-bold text-purple-700">{partnerDetails.lastPayout}</p>
              </div>
            </div>

            {/* Renewal Call to Action */}
            <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg text-center">
                <p className="font-semibold text-red-800 mb-1">Contract Renewal Due:</p>
                <p className="text-lg font-extrabold text-red-900">{partnerDetails.nextContractDate}</p>
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

        {/* Image Modal */}
        {showImageModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
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
              <div className="flex items-center justify-center bg-gray-100 p-8">
                <img
                  src={partnerLogo}
                  alt="Partner Logo Full Size"
                  className="max-w-full max-h-96 object-contain"
                  onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/400?text=Partner'}
                />
              </div>

              {/* Footer with partner info */}
              <div className="bg-white p-6 border-t border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{mockPartner.name}</h2>
                <p className="text-gray-600 mb-4">{mockPartner.contact}</p>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      setShowImageModal(false);
                      document.getElementById('logoUpload').click();
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-full font-medium hover:bg-emerald-700 transition"
                  >
                    <i className="fas fa-camera"></i> Change Logo
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

export default CorporateDashboard;