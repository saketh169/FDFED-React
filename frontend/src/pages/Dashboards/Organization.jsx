import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar"; // Assuming a Sidebar component exists

// --- Mock Data & API Call Simulation ---
const mockOrganization = {
  org_name: "Wellness Pro Labs",
  email: "contact@wellnesspro.com",
  phone: "+91 77665 54433",
  address: "123 Health Ave, Bangalore, IN",
  profileImage:
    "https://img.freepik.com/free-vector/modern-city-skyline-logo-template_23-2148408453.jpg?w=740&t=st=1701476000~exp=1701477000~hmac=5c6a1d8a1c93a0b388b39d73d9e0f63e9f4e2c0e8f7f2b1c2b5d4911d9a0d8c7",
};

const mockRecentDietitians = [
  { name: "Suresh K.", verificationStatus: { finalReport: "Verified" }, createdAt: '2025-10-25T10:00:00Z' },
  { name: "Priya V.", verificationStatus: { finalReport: "Rejected" }, createdAt: '2025-10-24T10:00:00Z' },
  { name: "Rajesh M.", verificationStatus: { finalReport: "Received" }, createdAt: '2025-10-23T10:00:00Z' },
];

// Mock function to simulate fetching organization status
const mockCheckOrganizationStatus = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // Possible statuses: 'Not Received', 'Received', 'Verified', 'Rejected'
  const mockStatus = "Verified"; // Change this to test different states

  return { success: true, finalReportStatus: mockStatus };
};

// Mock function to simulate fetching recent dietitians (sorted by createdAt)
const mockFetchRecentDietitians = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  // Simulate sorting and limiting
  return mockRecentDietitians.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);
};

// --- Sub-Components ---

const VerificationStatusCard = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Checking");
  const [report, setReport] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const data = await mockCheckOrganizationStatus(); // Replace with actual API call
        if (data.success) {
          setStatus(data.finalReportStatus);
          setReport(data);
        } else {
          setStatus("Error");
          setReport({ message: data.message || "Unknown error" });
        }
      } catch (error) {
        setStatus(`${error}`);
        setReport({ message: "Network error occurred." });
      } finally {
        setIsLoading(false);
      }
    };
    checkStatus();
  }, []);

  const getStatusDisplay = () => {
    switch (status) {
      case "Verified":
        return {
          bg: "bg-green-100 text-green-800",
          icon: "fas fa-check-circle",
          message: "Your organization has been **verified** by NutriConnect. You can now verify dietitians.",
          button: (
            <button
              className="mt-3 px-4 py-2 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition shadow"
              onClick={() => navigate("/verify_diet")}
            >
              <i className="fas fa-file-signature"></i> Proceed to Verify Dietitian
            </button>
          ),
        };
      case "Rejected":
        return {
          bg: "bg-red-100 text-red-800",
          icon: "fas fa-times-circle",
          message: "Your application has been **rejected**. View the reason in the final report.",
          button: (
            <button
              className="mt-3 px-4 py-2 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition shadow"
              onClick={() => navigate("/recieved_org")}
            >
              <i className="fas fa-eye"></i> View Verification Status
            </button>
          ),
        };
      case "Not Received":
      case "Received":
        return {
          bg: "bg-yellow-100 text-yellow-800",
          icon: "fas fa-spinner fa-spin",
          message: "Your documents are **under review** by NutriConnect.",
          button: null,
        };
      case "Checking":
      case "Error":
      default:
        return {
          bg: "bg-gray-100 text-gray-700",
          icon: "fas fa-exclamation-circle",
          message: isLoading ? "Checking verification status..." : `Error: Failed to load status. ${report.message || ""}`,
          button: null,
        };
    }
  };

  const display = getStatusDisplay();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-emerald-600 h-full flex flex-col justify-center">
      <h3 className="text-xl font-bold text-teal-900 mb-5 text-center">
        Organization Verification
      </h3>
      <div className="grow flex flex-col justify-center items-center text-center">
        <div className={`p-3 rounded-lg w-full max-w-sm ${display.bg}`}>
          <i className={`${display.icon} mr-2 text-lg`}></i>
          <span className="font-bold text-base">{status}</span>
        </div>
        <p className="mt-3 text-gray-600 font-medium max-w-xs" dangerouslySetInnerHTML={{ __html: display.message }} />
        {status !== 'Checking' && (
            <p className="text-sm text-gray-500 mb-2">
                Final report status: <strong>{status}</strong>
            </p>
        )}
        {display.button}
      </div>
    </div>
  );
};

const RecentDietitiansTable = () => {
  const [dietitians, setDietitians] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDietitians = async () => {
      try {
        const data = await mockFetchRecentDietitians(); // Replace with actual API call
        setDietitians(data);
      } catch (error) {
        console.error("Failed to fetch recent dietitians:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDietitians();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Verified":
        return "bg-green-500 text-white";
      case "Rejected":
        return "bg-red-500 text-white";
      case "Received":
      case "Not Received":
      default:
        return "bg-yellow-500 text-white";
    }
  };

  const getStatusText = (status) => {
    return status === "Not Received" ? "Pending" : status;
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
        case 'Verified': return 'fas fa-check-circle';
        case 'Rejected': return 'fas fa-times-circle';
        default: return 'fas fa-hourglass-half';
    }
  }

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-green-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Dietitian Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Verification Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {isLoading ? (
            <tr>
              <td colSpan="2" className="px-6 py-4 text-center text-sm text-gray-500">
                <i className="fas fa-spinner fa-spin mr-2"></i> Loading recent dietitians...
              </td>
            </tr>
          ) : dietitians.length === 0 ? (
            <tr>
              <td colSpan="2" className="px-6 py-4 text-center text-sm text-gray-500">
                No recent dietitian verifications found.
              </td>
            </tr>
          ) : (
            dietitians.map((dietitian, index) => {
              const status = dietitian.verificationStatus?.finalReport || "Not Received";
              const badgeClass = getStatusBadge(status);
              const statusText = getStatusText(status);

              return (
                <tr key={index} className="hover:bg-green-50 transition duration-150 cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {dietitian.name || "Unknown Dietitian"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${badgeClass}`}>
                       <i className={`${getStatusIcon(status)} mr-1`}></i> {statusText}
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


// --- Main Dashboard Component ---
const OrganizationDashboard = () => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(mockOrganization.profileImage);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Client-side validation (matching your JS)
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      alert('Only JPEG or PNG images are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB.');
      return;
    }

    // 1. Local Preview
    const reader = new FileReader();
    reader.onload = () => setProfileImage(reader.result);
    reader.readAsDataURL(file);

    // 2. Mock API Upload (replace with actual fetch to /uploadorganization)
    alert("Profile photo updated successfully!"); 
    // In a real app, you would fetch and handle the server response here.
  };

  const handleLogout = () => {
    localStorage.removeItem("organizationAuthToken"); 
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Placeholder for your Organization Sidebar component */}
      <Sidebar /> 

      {/* Main Content */}
      <div className="flex-1 p-6 lg:p-10">
        <h1 className="text-3xl lg:text-4xl font-bold text-green-900 mb-8 border-b border-gray-200 pb-4">
          Welcome, {mockOrganization.org_name}! 🏢
        </h1>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. Profile Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-green-600 flex flex-col items-center">
            <h3 className="text-xl font-bold text-teal-900 mb-5 text-center w-full">
              Organization Profile
            </h3>

            <div className="relative mb-4">
              <img
                src={profileImage}
                alt={`${mockOrganization.org_name} Logo`}
                className="w-32 h-32 rounded-full object-cover border-4 border-green-600 cursor-pointer"
                onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/128?text=Org'}
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
                accept="image/jpeg, image/png"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>

            <p className="text-xs text-gray-500 mb-4">Click camera to update photo</p>

            <h5 className="font-semibold text-lg text-gray-800 text-center">{mockOrganization.org_name}</h5>
            <p className="text-sm text-gray-600">Email: {mockOrganization.email}</p>
            <p className="text-sm text-gray-600">Phone: {mockOrganization.phone}</p>
            <p className="text-sm text-gray-600 mb-4 text-center">{mockOrganization.address}</p>

            <div className="flex gap-2 flex-wrap justify-center mt-auto">
              <button
                onClick={() => navigate("/organization_dash/edit-profile")}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-600 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-600 hover:text-white transition"
              >
                <i className="fas fa-user-edit"></i> Edit Profile
              </button>
              <button
                onClick={() => navigate("/organization_dash/change-pass")}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-400 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-100 transition"
              >
                <i className="fas fa-lock"></i> Change Password
              </button>
            </div>

            <span className="mt-4 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
              Active
            </span>
          </div>

          {/* 2. Verification Status Card (Dynamic content) */}
          <VerificationStatusCard />

          {/* 3. Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-blue-600 h-full">
            <h3 className="text-xl font-bold text-teal-900 mb-5 text-center">
              Quick Actions
            </h3>

            <div className="space-y-3">
              <button
                onClick={() => navigate("/recieved_org")}
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-full hover:bg-blue-700 transition shadow flex items-center justify-center gap-2"
              >
                <i className="fas fa-shield-check"></i> View My Verification Status
              </button>

              <button
                onClick={() => navigate("/verify_diet")}
                className="w-full bg-amber-500 text-white font-semibold py-3 rounded-full hover:bg-amber-600 transition shadow flex items-center justify-center gap-2"
              >
                <i className="fas fa-file-signature"></i> Verify Dietitian
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

        {/* 4. Recent Dietitian Verifications Table */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border-t-4 border-gray-400">
          <h3 className="text-xl font-bold text-teal-900 mb-5 text-center">
            Recent Dietitian Verifications
          </h3>
          <RecentDietitiansTable />
        </div>
      </div>
    </div>
  );
};

export default OrganizationDashboard;