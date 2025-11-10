import React, { useState, useEffect, useCallback } from "react";
import BookingSidebar from "../components/BookingSidebar";
import PaymentModal from "../components/PaymentModal";
import Notification from "../components/Notification";
import DietitianCard from "../components/DietitianCard";
import { API_ENDPOINTS } from "../config/api";
import apiService from "../services/apiService";

const AllDietitiansPage = () => {
  const [allDietitians, setAllDietitians] = useState([]);
  const [filteredDietitians, setFilteredDietitians] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    mode: [],
    experience: [],
    fees: [],
    language: [],
    rating: [],
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
  const [_loading, setLoading] = useState(true);

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      3500
    );
  };

  // Fetch all dietitians from backend API
  useEffect(() => {
    const fetchDietitians = async () => {
      try {
        setLoading(true);
        const data = await apiService.get(
          API_ENDPOINTS.DIETITIANS.GET_ALL,
          {},
          false
        );
        if (data.success) {
          // Map the backend data structure to frontend structure
          const mappedData = data.data.map((d) => ({
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

          setAllDietitians(mappedData);
          setFilteredDietitians(mappedData);
        } else {
          showNotification("Error fetching dietitians", "error");
        }
      } catch (error) {
        console.error("Error fetching dietitians:", error);
        showNotification(
          "Error fetching dietitians: " + error.message,
          "error"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchDietitians();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = [...allDietitians];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(query) ||
          d.location?.toLowerCase().includes(query) ||
          d.specialties?.some((s) => s.toLowerCase().includes(query))
      );
    }

    // Mode filter
    if (filters.mode.length > 0) {
      result = result.filter((d) =>
        filters.mode.some((m) =>
          m === "online" ? d.onlineConsultation : d.offlineConsultation
        )
      );
    }

    // Experience filter
    if (filters.experience.length > 0) {
      result = result.filter((d) =>
        filters.experience.some((exp) => d.yearsOfExperience >= exp)
      );
    }

    // Fees filter
    if (filters.fees.length > 0) {
      result = result.filter((d) =>
        filters.fees.some((fee) => d.consultationFee <= fee)
      );
    }

    // Language filter
    if (filters.language.length > 0) {
      result = result.filter((d) =>
        d.languages?.some((lang) => filters.language.includes(lang))
      );
    }

    // Rating filter
    if (filters.rating.length > 0) {
      result = result.filter((d) => filters.rating.some((r) => d.rating >= r));
    }

    setFilteredDietitians(result);
  }, [filters, allDietitians, searchQuery]);

  const handleFilterChange = useCallback((filterName, value) => {
    setFilters((prevFilters) => {
      const currentValues = prevFilters[filterName];
      if (["experience", "fees", "rating"].includes(filterName)) {
        const newValues = currentValues.includes(value)
          ? currentValues.filter((v) => v !== value)
          : [...currentValues, value];
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
      mode: [],
      experience: [],
      fees: [],
      language: [],
      rating: [],
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

  // Handle payment submission and create booking with timestamp
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
          "Your consultation has been booked successfully! Booking timestamp recorded.",
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-5 mt-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-bold text-dark-accent mb-3">
            Search Dietitians
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            Expert Guidance for Your Unique Health Goals
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-green to-dark-accent mx-auto mt-4 rounded-full" />
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, location, or specialties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 text-gray-700 font-medium shadow-sm hover:shadow-md transition-all"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-dark-accent tracking-tight">
              Filters
            </h2>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition font-semibold text-sm"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Mode Filter */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700 tracking-tight">
                Consultation Mode
              </label>
              <div className="space-y-2">
                {["online", "offline"].map((mode) => (
                  <label
                    key={mode}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.mode.includes(mode)}
                      onChange={() => handleFilterChange("mode", mode)}
                      className="w-4 h-4 text-primary-green rounded"
                    />
                    <span className="text-gray-700 text-sm font-medium">
                      {mode === "online" ? "Online" : "In-person"}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Experience Filter */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700 tracking-tight">
                Experience
              </label>
              <div className="space-y-2">
                {[3, 5, 10].map((exp) => (
                  <button
                    key={exp}
                    onClick={() => handleFilterChange("experience", exp)}
                    className={`w-full px-3 py-2 rounded-lg transition text-sm font-medium ${
                      filters.experience.includes(exp)
                        ? "bg-primary-green text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {exp}+ years
                  </button>
                ))}
              </div>
            </div>

            {/* Fees Filter */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700 tracking-tight">
                Consultation Fees
              </label>
              <div className="space-y-2">
                {[1000, 1500, 2000].map((fee) => (
                  <button
                    key={fee}
                    onClick={() => handleFilterChange("fees", fee)}
                    className={`w-full px-3 py-2 rounded-lg transition text-sm font-medium ${
                      filters.fees.includes(fee)
                        ? "bg-primary-green text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    ₹{fee}
                  </button>
                ))}
              </div>
            </div>

            {/* Language Filter */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700 tracking-tight">
                Languages
              </label>
              <div className="space-y-2">
                {["English", "Hindi", "Telugu", "Tamil"].map((lang) => (
                  <label
                    key={lang}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.language.includes(lang)}
                      onChange={() => handleFilterChange("language", lang)}
                      className="w-4 h-4 text-primary-green rounded"
                    />
                    <span className="text-gray-700 text-sm font-medium">
                      {lang}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700 tracking-tight">
                Minimum Rating
              </label>
              <div className="space-y-2">
                {[4.5, 4.7, 4.9].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleFilterChange("rating", rating)}
                    className={`w-full px-3 py-2 rounded-lg transition text-sm font-medium ${
                      filters.rating.includes(rating)
                        ? "bg-primary-green text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {rating} Stars
                  </button>
                ))}
              </div>
            </div>
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

        {/* Results Grid */}
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
                No dietitians found
              </p>
              <p className="text-gray-500">
                Try adjusting your search or filters
              </p>
            </div>
          )}
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

export default AllDietitiansPage;
