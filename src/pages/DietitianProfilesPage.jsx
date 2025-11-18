// src/pages/DietitianProfilesPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import FilterSidebar from "../components/FilterSidebar";
import BookingSidebar from "../components/BookingSidebar";
import PaymentModal from "../components/PaymentModal";
import Notification from "../components/Notification";
import DietitianCard from "../components/DietitianCard";
import { API_ENDPOINTS } from "../config/api";
import apiService from "../services/apiService";

// Helper to get specialization filters based on the page type
const getSpecializationData = (specializationType) => {
  const specializations = {
    "skin-hair": {
      title: "Find a Skin & Hair Care Nutritionist",
      subtitle: "Transform Your Complexion, Revitalize Your Locks",
      filters: [
        { value: "Acne Management", label: "Acne Management" },
        { value: "Hair Loss", label: "Hair Loss" },
        { value: "Skin Glow", label: "Skin Glow" },
        { value: "Anti-Aging", label: "Anti-Aging" },
        { value: "Hair Strength", label: "Hair Strength" },
        { value: "Scalp Health", label: "Scalp Health" },
        { value: "Skin Elasticity", label: "Skin Elasticity" },
      ],
    },
    "womens-health": {
      title: "Find a Women's Health Nutritionist",
      subtitle: "Empower Your Wellness Journey",
      filters: [
        { value: "PCOS", label: "PCOS" },
        { value: "Pregnancy Nutrition", label: "Pregnancy Nutrition" },
        { value: "Menopause", label: "Menopause" },
        { value: "Fertility", label: "Fertility" },
        { value: "Hormonal Balance", label: "Hormonal Balance" },
        { value: "Breastfeeding Support", label: "Breastfeeding Support" },
        { value: "Post-Partum Diet", label: "Post-Partum Diet" },
      ],
    },
    "weight-management": {
      title: "Find a Weight Management Nutritionist",
      subtitle: "Achieve Your Goal Weight, Embrace Your Best Self",
      filters: [
        { value: "Weight Loss", label: "Weight Loss" },
        { value: "Weight Gain", label: "Weight Gain" },
        { value: "Obesity Management", label: "Obesity Management" },
        { value: "Metabolic Health", label: "Metabolic Health" },
        { value: "Mindful Eating", label: "Mindful Eating" },
        { value: "Sports Nutrition", label: "Sports Nutrition" },
        { value: "Holistic Nutrition", label: "Holistic Nutrition" },
      ],
    },
    "gut-health": {
      title: "Find a Gut Health Nutritionist",
      subtitle: "Heal Your Gut, Transform Your Life",
      filters: [
        { value: "IBS Management", label: "IBS Management" },
        { value: "GERD", label: "GERD" },
        { value: "Gut Microbiome", label: "Gut Microbiome" },
        { value: "Food Sensitivities", label: "Food Sensitivities" },
        { value: "Gut Inflammation", label: "Gut Inflammation" },
        { value: "Leaky Gut Syndrome", label: "Leaky Gut Syndrome" },
        { value: "IBD", label: "IBD" },
        { value: "Food Intolerances", label: "Food Intolerances" },
      ],
    },
    "diabetes-thyroid": {
      title: "Find a Diabetes & Thyroid Care Specialist",
      subtitle: "Balance Your Health, Control Your Numbers",
      filters: [
        { value: "Type 2 Diabetes", label: "Type 2 Diabetes" },
        { value: "Type 1 Diabetes", label: "Type 1 Diabetes" },
        { value: "Hypothyroidism", label: "Hypothyroidism" },
        { value: "Hyperthyroidism", label: "Hyperthyroidism" },
      ],
    },
    "cardiac-health": {
      title: "Find a Cardiac Health Nutritionist",
      subtitle: "Nourish Your Heart, Extend Your Life",
      filters: [
        { value: "Cholesterol Management", label: "Cholesterol Management" },
        { value: "Hypertension", label: "Hypertension" },
        { value: "Post-Cardiac Surgery", label: "Post-Cardiac Surgery" },
      ],
    },
    all: {
      title: "Find a Nutritionist Near You",
      subtitle: "Expert Guidance for Your Unique Health Goals",
      filters: [],
    },
  };
  return specializations[specializationType] || specializations["all"];
};

const DietitianProfilesPage = ({ specializationType = "all" }) => {
  const [allDietitians, setAllDietitians] = useState([]);
  const [filteredDietitians, setFilteredDietitians] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    specialization: [],
    mode: [],
    experience: [],
    fees: [],
    language: [],
    rating: [],
    location: "",
  });
  const [isBookingSidebarOpen, setIsBookingSidebarOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [currentDietitian, setCurrentDietitian] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [loading, setLoading] = useState(true);

  const specializationData = getSpecializationData(specializationType);

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3500);
  };

  // ✅ FIXED: Fetch from backend API instead of using mock data
  useEffect(() => {
    const fetchDietitians = async () => {
      try {
        setLoading(true);
        console.log("Fetching dietitians...");
        const data = await apiService.get(
          API_ENDPOINTS.DIETITIANS.GET_ALL,
          {},
          false
        );

        console.log("Data received:", data);

        if (data.success) {
          console.log("Raw data count:", data.data.length);
          // Map the backend data structure to frontend structure
          let initialData = data.data.map((d) => ({
            _id: d._id,
            id: d._id,
            name: d.name,
            specialties:
              typeof d.specialization === "string"
                ? d.specialization.split(" ").filter((s) => s)
                : Array.isArray(d.specialization)
                ? d.specialization
                : [],
            yearsOfExperience: d.experience || 0,
            experience: d.experience || 0,
            consultationFee: d.fees || 0,
            languages:
              typeof d.languages === "string"
                ? d.languages.split(" ").filter((l) => l)
                : Array.isArray(d.languages)
                ? d.languages
                : [],
            location: d.location || "",
            rating: d.rating || 0,
            onlineConsultation: d.online || false,
            offlineConsultation: d.offline || false,
            photo: null, // Skip image conversion for now
            description: d.about || "",
            education:
              typeof d.education === "string"
                ? d.education.split(" ").filter((e) => e)
                : Array.isArray(d.education)
                ? d.education
                : [],
          }));

          console.log("Mapped data count:", initialData.length);

          // Filter by specialization if not 'all'
          if (specializationType !== "all") {
            const specializationFilters = specializationData.filters.map(
              (f) => f.value
            );
            initialData = initialData.filter((d) =>
              d.specialties?.some((s) => specializationFilters.includes(s))
            );
          }

          setAllDietitians(initialData);
          setFilteredDietitians(initialData);
          console.log("State updated successfully");
        } else {
          console.error("API returned success: false");
          showNotification("Error fetching dietitians", "error");
          setAllDietitians([]);
        }
      } catch (error) {
        console.error("Error fetching dietitians:", error);
        showNotification(
          "Error fetching dietitians: " + error.message,
          "error"
        );
        setAllDietitians([]);
      } finally {
        setLoading(false);
        console.log("Loading complete");
      }
    };

    fetchDietitians();
  }, [specializationType, specializationData.filters]);

  // Apply filters and search whenever they change
  useEffect(() => {
    let result = [...allDietitians];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.name?.toLowerCase().includes(query) ||
          d.location?.toLowerCase().includes(query) ||
          d.specialties?.some((s) => s.toLowerCase().includes(query))
      );
    }

    if (filters.specialization.length > 0) {
      result = result.filter((d) =>
        d.specialties?.some((s) => filters.specialization.includes(s))
      );
    }

    if (filters.mode.length > 0) {
      result = result.filter((d) =>
        filters.mode.some(
          (m) =>
            (m === "online" && d.onlineConsultation) ||
            (m === "offline" && d.offlineConsultation)
        )
      );
    }

    if (filters.experience.length > 0) {
      result = result.filter((d) =>
        filters.experience.some((exp) => d.yearsOfExperience >= exp)
      );
    }

    if (filters.fees.length > 0) {
      result = result.filter((d) =>
        filters.fees.some((fee) => d.consultationFee <= fee)
      );
    }

    if (filters.language.length > 0) {
      result = result.filter((d) =>
        d.languages?.some((lang) => filters.language.includes(lang))
      );
    }

    if (filters.rating.length > 0) {
      result = result.filter((d) => filters.rating.some((r) => d.rating >= r));
    }

    if (filters.location) {
      result = result.filter((d) =>
        d.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    setFilteredDietitians(result);
  }, [filters, allDietitians, searchQuery]);

  const handleFilterChange = useCallback((filterName, value) => {
    setFilters((prevFilters) => {
      if (filterName === "location") {
        return { ...prevFilters, location: value };
      }

      const currentValues = prevFilters[filterName];

      if (["experience", "fees", "rating"].includes(filterName)) {
        const newValues = currentValues.includes(value) ? [] : [value];
        return { ...prevFilters, [filterName]: newValues };
      }

      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return { ...prevFilters, [filterName]: newValues };
    });
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      specialization: [],
      mode: [],
      experience: [],
      fees: [],
      language: [],
      rating: [],
      location: "",
    });
    setSearchQuery("");
  }, []);

  const handleBookAppointment = (dietitian) => {
    setCurrentDietitian(dietitian);
    setIsBookingSidebarOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingSidebarOpen(false);
    setCurrentDietitian(null);
    setBookingDetails(null);
  };

  const handleProceedToPayment = (details) => {
    setBookingDetails(details);
    setPaymentDetails({
      amount: currentDietitian.consultationFee,
      dietitianName: currentDietitian.name,
      date: details.date,
      time: details.time,
      type: details.consultationType,
    });
    setIsPaymentModalOpen(true);
    setIsBookingSidebarOpen(false);
  };

  // ✅ FIXED: Call real API instead of simulating
  const handlePaymentSubmit = async (paymentData) => {
    try {
      const bookingPayload = {
        userId:
          localStorage.getItem("userId") || sessionStorage.getItem("userId"),
        username:
          localStorage.getItem("username") ||
          sessionStorage.getItem("username"),
        dietitianId: currentDietitian._id,
        date: bookingDetails.date,
        time: bookingDetails.time,
        consultationType: bookingDetails.consultationType,
        paymentId: paymentData.transactionId || "PAYMENT_" + Date.now(),
        amount: paymentData.amount,
        paymentMethod: paymentData.paymentMethod,
      };

      const result = await apiService.post(
        API_ENDPOINTS.BOOKINGS.CREATE,
        bookingPayload
      );

      if (result.success) {
        setIsPaymentModalOpen(false);
        showNotification(
          "✨ Your consultation has been booked successfully! Booking timestamp recorded.",
          "success"
        );
        setTimeout(() => {
          setCurrentDietitian(null);
          setBookingDetails(null);
          setPaymentDetails(null);
        }, 500);
      } else {
        showNotification("Booking failed: " + result.error, "error");
      }
    } catch (error) {
      console.error("Booking failed:", error);
      showNotification("Booking failed: " + error.message, "error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-600">Loading dietitians...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-5 mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-bold text-dark-accent mb-3">
            {specializationData.title}
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            {specializationData.subtitle}
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-green to-dark-accent mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-72">
            <div className="sticky top-32">
              <FilterSidebar
                specializations={specializationData.filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                filters={filters}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, location, or specialities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 text-gray-700 font-medium shadow-sm hover:shadow-md transition-all"
                />
                <span className="absolute right-5 top-4 text-gray-400 text-xl">
                  🔍
                </span>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600 font-medium">
                Found{" "}
                <span className="text-primary-green font-bold text-lg">
                  {filteredDietitians.length}
                </span>{" "}
                dietitian{filteredDietitians.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Results Grid - VERTICAL LAYOUT */}
            <div className="space-y-5">
              {filteredDietitians.length > 0 ? (
                filteredDietitians.map((dietitian) => (
                  <DietitianCard
                    key={dietitian._id}
                    dietitian={dietitian}
                    onBookAppointment={handleBookAppointment}
                  />
                ))
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300">
                  <p className="text-2xl text-gray-600 font-semibold mb-2">
                    😔 No dietitians found
                  </p>
                  <p className="text-gray-500">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Sidebar */}
      <BookingSidebar
        isOpen={isBookingSidebarOpen}
        onClose={handleCloseBooking}
        onProceedToPayment={handleProceedToPayment}
        dietitianId={currentDietitian?._id}
      />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSubmit={handlePaymentSubmit}
        paymentDetails={paymentDetails}
      />

      {/* Notification */}
      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
      />
    </div>
  );
};

export default DietitianProfilesPage;
