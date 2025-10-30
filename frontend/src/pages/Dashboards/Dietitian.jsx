import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar"; // Assuming a Sidebar component exists

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

// Mock API Call Function (Simulates the /dietitian-doc/check-status endpoint)
const mockCheckVerificationStatus = async () => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Possible statuses: 'Not Received', 'Received', 'Verified', 'Rejected'
  const mockStatus = "Verified"; // Change this to test different states

  return { success: true, finalReportStatus: mockStatus };
};

// --- Verification Status Component ---
const VerificationStatusCard = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Checking"); // Initial status
  const [report, setReport] = useState({});

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const data = await mockCheckVerificationStatus(); // Replace with actual API call
        if (data.success) {
          setStatus(data.finalReportStatus);
          setReport(data);
        } else {
          setStatus("Error");
          setReport({ message: data.message || "Unknown error" });
        }
      } catch (error) {
        console.error("Error fetching verification status:", error);
        setStatus("Error");
        setReport({ message: "Network error occurred." });
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
          message:
            "Your documents have been verified by Nutri Connect. Proceed to complete your profile.",
          button: (
            <button
              className="mt-3 px-4 py-2 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition shadow"
              onClick={() => navigate("/dietitian-setup")}
            >
              <i className="fas fa-arrow-right"></i> Proceed to Setup
            </button>
          ),
        };
      case "Rejected":
        return {
          bg: "bg-red-100 text-red-800",
          icon: "fas fa-times-circle",
          message:
            "Your application has been rejected. Please review and resubmit your documents.",
          button: (
            <button
              className="mt-3 px-4 py-2 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition shadow"
              onClick={() => navigate("/recieved_diet")}
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
          message: "Your documents are under review by Nutri Connect.",
          button: null,
        };
      case "Checking":
        return {
          bg: "bg-gray-100 text-gray-700",
          icon: "fas fa-spinner fa-spin",
          message: "Checking verification status...",
          button: null,
        };
      case "Error":
      default:
        return {
          bg: "bg-red-200 text-red-900",
          icon: "fas fa-exclamation-circle",
          message: `Error: Failed to load status. ${report.message || ""}`,
          button: null,
        };
    }
  };

  const display = getStatusDisplay();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-emerald-600 h-full flex flex-col justify-between">
      <h3 className="text-xl font-bold text-teal-900 mb-5 text-center">
        Document Verification
      </h3>
      <div className="grow flex flex-col justify-center items-center text-center">
        <div className={`p-3 rounded-lg w-full ${display.bg}`}>
          <i className={`${display.icon} mr-2 text-lg`}></i>
          <span className="font-bold text-base">{status}</span>
        </div>
        <p className="mt-3 text-gray-600">{display.message}</p>
        <p className="text-sm text-gray-500 mb-2">
          Final report status: <strong>{status}</strong>
        </p>
        {display.button}
      </div>
    </div>
  );
};

// --- Main Dashboard Component ---
const DietitianDashboard = () => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(mockDietitian.profileImage);
  const fileInputRef = React.useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 1. Local Preview
    const reader = new FileReader();
    reader.onload = () => setProfileImage(reader.result);
    reader.readAsDataURL(file);

    // 2. Mock API Upload (replace with actual fetch)
    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      // const res = await fetch('/uploaddietitian', { method: 'POST', body: formData });
      // const data = await res.json();
      // Mock Success:
      const data = { success: true };

      if (data.success) {
        // In a real app, you would update the state with the new image URL/base64 from the server response
        alert("Profile photo updated successfully!");
        // window.location.reload(); // Only if necessary to fetch new base64 image from server
      } else {
        alert("Upload failed: Check console for details.");
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
      <div className="flex-1 p-6 lg:p-10">
        <h1 className="text-3xl lg:text-4xl font-bold text-green-900 mb-8 border-b border-gray-200 pb-4">
          Welcome, {mockDietitian.name}! 👋
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
                alt={`${mockDietitian.name}'s Profile`}
                className="w-32 h-32 rounded-full object-cover border-4 border-green-600 cursor-pointer"
                onClick={() => {
                  /* Logic to open modal/lightbox for image */
                }}
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
              {mockDietitian.name}
            </h5>
            <p className="text-sm text-gray-600">Age: {mockDietitian.age}</p>
            <p className="text-sm text-gray-600">{mockDietitian.email}</p>
            <p className="text-sm text-gray-600 mb-3">
              Contact: {mockDietitian.phone}
            </p>

            <div className="flex gap-2 flex-wrap justify-center mt-auto">
              <button
                onClick={() => navigate("/dietitian_dash/edit-profile")}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-600 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-600 hover:text-white transition"
              >
                <i className="fas fa-user-edit"></i> Edit Profile
              </button>
              <button
                onClick={() => navigate("/dietitian_dash/change-pass")}
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
          <VerificationStatusCard />

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
            <li className="flex items-center gap-2 text-gray-700 p-2 border-b">
              <i className="fas fa-bell text-yellow-500"></i>
              You have a **new client request**.
            </li>
            <li className="flex items-center gap-2 text-gray-700 p-2 border-b">
              <i className="fas fa-calendar-alt text-blue-500"></i>
              Your appointment with **[Client Name]** is scheduled for tomorrow.
            </li>
            <li className="flex items-center gap-2 text-gray-700 p-2">
              <i className="fas fa-check-circle text-green-500"></i>
              Your documents have been **successfully verified**.
            </li>
          </ul>
        </div>

        {/* 5. Recent Activities */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border-t-4 border-gray-400">
          <h3 className="text-xl font-bold text-teal-900 mb-5 text-center">
            Recent Activities
          </h3>

          <ul className="space-y-3">
            <li className="flex items-center gap-2 text-gray-700 p-2 border-b">
              <i className="fas fa-circle text-xs text-gray-500"></i>
              Logged in today at **10:00 AM**
            </li>
            <li className="flex items-center gap-2 text-gray-700 p-2 border-b">
              <i className="fas fa-circle text-xs text-gray-500"></i>
              Created a new meal plan for **[Client Name]**
            </li>
            <li className="flex items-center gap-2 text-gray-700 p-2">
              <i className="fas fa-circle text-xs text-gray-500"></i>
              Uploaded **new certification documents**
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DietitianDashboard;