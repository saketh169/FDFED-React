import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Chart from "chart.js/auto";
import Sidebar from "../../components/Sidebar/Sidebar"; // Assuming a Sidebar component exists

// --- Mock Data & API Call Simulation ---
const mockAdmin = {
  name: "Super Admin",
  email: "admin@nutriconnect.com",
  phone: "+91 80000 80000",
  profileImage:
    "https://img.freepik.com/free-vector/administrator-concept-illustration_114360-1533.jpg?w=740&t=st=1701475000~exp=1701476000~hmac=6b9e25d4e11c69c9b13c7d6b80302b115a31a98072120e2e2a8657662886f34e",
};

const mockOrganizations = [
  { org_name: "Wellness Corp", verificationStatus: { finalReport: "Verified" } },
  { org_name: "Healthy Life India", verificationStatus: { finalReport: "Received" } },
  { org_name: "FitFast Centers", verificationStatus: { finalReport: "Rejected" } },
  { org_name: "NutriClinic Pvt Ltd", verificationStatus: { finalReport: "Not Received" } },
];

const mockStats = {
  clients: new Array(50).fill(0), // Mock 50 clients
  dietitians: new Array(15).fill(0), // Mock 15 dietitians
  activePlans: 35,
};

// Mock function to simulate fetching organizations
const mockFetchOrganizations = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockOrganizations;
};

// Mock function to simulate fetching statistics
const mockFetchStatistics = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockStats;
};

// Mock function to simulate revenue data (simplified for chart/stats)
const mockRevenueData = {
  labels: ["Nov 2024", "Dec 2024", "Jan 2025", "Feb 2025", "Mar 2025", "Apr 2025", "May 2025"],
  subscriptions: [15000, 18000, 25000, 22000, 30000, 35000, 42000],
  consultations: [3000, 4500, 6000, 5500, 8000, 9500, 11000], // Admin share (20%)
  users: [65, 80, 105, 120, 150, 175, 200], // Total Users
};
// Calculate Yearly Revenue from the last data point for simplicity
const YEARLY_SUB_REVENUE = mockRevenueData.subscriptions.reduce((a, b) => a + b, 0);
const YEARLY_CON_REVENUE = mockRevenueData.consultations.reduce((a, b) => a + b, 0);

// --- Chart Component ---
const GrowthChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !data) return;

    const ctx = chartRef.current.getContext("2d");
    if (chartInstance.current) chartInstance.current.destroy();

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.labels,
        datasets: [
          {
            label: "Subscription Revenue (₹)",
            data: data.subscriptions,
            backgroundColor: "rgba(40, 167, 69, 0.2)",
            borderColor: "#28a745",
            borderWidth: 2,
            yAxisID: "y-revenue",
            tension: 0.3,
          },
          {
            label: "Consultation Revenue (₹)",
            data: data.consultations,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "#4bc0c0",
            borderWidth: 2,
            yAxisID: "y-revenue",
            tension: 0.3,
          },
          {
            label: "Total Users",
            data: data.users,
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "#ff6384",
            borderWidth: 2,
            yAxisID: "y-users",
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          "y-revenue": {
            beginAtZero: true,
            title: { display: true, text: "Revenue (₹)", color: "#28a745" },
            position: "left",
          },
          "y-users": {
            beginAtZero: true,
            title: { display: true, text: "Users", color: "#ff6384" },
            position: "right",
            grid: { drawOnChartArea: false },
          },
        },
        plugins: {
          legend: { position: 'bottom' },
          tooltip: { mode: 'index', intersect: false },
        },
      },
    });

    return () => chartInstance.current?.destroy();
  }, [data]);

  return <canvas ref={chartRef} className="h-96 w-full" />;
};

// --- Organization Table Component ---
const OrganizationTable = ({ organizations }) => {
  const navigate = useNavigate();

  const getStatusClass = (status) => {
    switch (status) {
      case "Verified": return "bg-green-100 text-green-800";
      case "Rejected": return "bg-red-100 text-red-800";
      case "Received":
      case "Not Received":
      default: return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusText = (status) => {
    return status === "Not Received" ? "Pending" : status;
  };

  const handleRowClick = (orgName) => {
    // Navigate to a detail page for verification
    navigate(`/verify_org/${encodeURIComponent(orgName)}`);
  };

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-green-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Organization Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Verification Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {organizations.length === 0 ? (
            <tr>
              <td colSpan="2" className="px-6 py-4 text-center text-sm text-gray-500">
                No organizations found.
              </td>
            </tr>
          ) : (
            organizations.map((org, index) => {
              const overallStatus = org.verificationStatus?.finalReport || "Not Received";
              const statusClass = getStatusClass(overallStatus);
              const statusText = getStatusText(overallStatus);

              return (
                <tr
                  key={index}
                  className="hover:bg-green-50 transition duration-150 cursor-pointer"
                  onClick={() => handleRowClick(org.org_name)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {org.org_name || "Unknown Organization"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}>
                      <i className={`fas fa-${overallStatus === 'Verified' ? 'check-circle' : overallStatus === 'Rejected' ? 'times-circle' : 'hourglass-half'} mr-1`}></i>
                      {statusText}
                    </span>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};


// --- Main Admin Dashboard Component ---
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ clients: 0, dietitians: 0, activePlans: 0 });
  const [organizations, setOrganizations] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      const fetchedStats = await mockFetchStatistics();
      setStats({
        clients: fetchedStats.clients.length,
        dietitians: fetchedStats.dietitians.length,
        activePlans: fetchedStats.activePlans,
      });

      const fetchedOrgs = await mockFetchOrganizations();
      setOrganizations(fetchedOrgs);
    };

    loadData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Placeholder for your Admin Sidebar component */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 lg:p-10">
        <h1 className="text-3xl lg:text-4xl font-bold text-green-900 mb-8 border-b border-gray-200 pb-4">
          Welcome, {mockAdmin.name}! 👑
        </h1>

        {/* Admin Info & Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* 1. Profile Card using Reusable Component */}
          <ProfileImageSection
            role="admin"
            name={mockAdmin.name}
            email={mockAdmin.email}
            phone={mockAdmin.phone}
            additionalInfo="Role: Super Admin"
            onEditClick={() => navigate("/admin_dash/edit-profile")}
            onPasswordClick={() => navigate("/admin_dash/change-pass")}
            statusText="Active"
            statusColor="bg-green-600"
          />

          {/* 2. Quick Stats & Revenue (Merged into one large section) */}
          <div className="col-span-1 lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard title="Total Clients" value={stats.clients} icon="fas fa-users" color="text-blue-600" desc="Registered clients on the platform." />
              <StatCard title="Total Dietitians" value={stats.dietitians} icon="fas fa-user-md" color="text-green-600" desc="Registered dietitians on the platform." />
              <StatCard title="Active Plans" value={stats.activePlans} icon="fas fa-utensils" color="text-yellow-600" desc="Active diet plans on the platform." />
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-green-700">
              <h3 className="text-xl font-bold text-teal-900 mb-5 border-b pb-3">
                Revenue Overview (YTD)
              </h3>
              <RevenueBox title="Subscriptions Revenue" value={YEARLY_SUB_REVENUE} />
              <RevenueBox title="Consultations Revenue (Admin Share)" value={YEARLY_CON_REVENUE} />
              <RevenueBox title="Total Revenue" value={YEARLY_SUB_REVENUE + YEARLY_CON_REVENUE} isTotal={true} />
            </div>
          </div>
        </div>

        {/* 3. Platform Growth Chart */}
        <div className="card mt-8 bg-white rounded-2xl shadow-lg p-6 border-t-4 border-blue-600">
          <h3 className="text-xl font-bold text-teal-900 mb-5">
            Platform Growth Statistics
          </h3>
          <div className="h-96">
            <GrowthChart data={mockRevenueData} />
          </div>
        </div>
        

        {/* 4. Organization Listing Section */}
        <div className="card mt-8 bg-white rounded-2xl shadow-lg p-6 border-t-4 border-gray-600">
          <h3 className="text-xl font-bold text-teal-900 mb-5">
            Organization Verification Status
          </h3>
          <OrganizationTable organizations={organizations} />
          <div className="mt-4 text-right">
            <button
              onClick={() => navigate("/verify_org")}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              View all for verification →
            </button>
          </div>
        </div>

        {/* 5. Quick Actions / Logout */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white font-semibold px-6 py-2.5 rounded-full hover:bg-red-700 transition shadow flex items-center gap-2"
          >
            <i className="fas fa-sign-out-alt"></i> Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Helper Components ---
const StatCard = ({ title, value, icon, color, desc }) => (
  <div className="bg-white rounded-xl shadow p-5 border-l-4 border-gray-300 hover:shadow-md transition">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className={`text-3xl font-bold ${color}`}>{value}</h3>
      </div>
      <i className={`${icon} ${color} text-3xl opacity-70`}></i>
    </div>
    <p className="text-xs text-gray-400 mt-2">{desc}</p>
  </div>
);

const RevenueBox = ({ title, value, isTotal = false }) => (
  <div className={`flex items-center justify-between p-3 rounded-lg mb-3 ${isTotal ? 'bg-green-600 text-white font-bold' : 'bg-green-50'}`}>
    <h3 className={`m-0 ${isTotal ? 'text-lg' : 'text-sm text-gray-700'}`}>{title}</h3>
    <span className={`text-xl font-extrabold ${isTotal ? 'text-white' : 'text-green-700'}`}>
      ₹{value.toFixed(2)}
    </span>
  </div>
);

export default AdminDashboard;