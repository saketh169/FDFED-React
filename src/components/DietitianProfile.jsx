// src/pages/DietitianProfile.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import ProfileHeaderCard from "./ProfileHeaderCard";
import ContactInfoCard from "./ContactInfoCard";
import TestimonialModal from "./TestimonialModal";
import BookingSidebar from "./BookingSidebar";
import { API_ENDPOINTS } from "../config/api";
import apiService from "../services/apiService";

// Fallback mock data
const mockDietitianData = {
  _id: "123",
  name: "Dr. Emily Carter",
  title: "Certified Clinical Nutritionist",
  photo: "https://via.placeholder.com/200",
  rating: 4.5,
  location: "New York, USA",
  languages: ["English", "Spanish"],
  onlineConsultation: true,
  offlineConsultation: true,
  consultationFee: 80,
  description:
    "With over 10 years of experience, I specialize in holistic nutrition and lifestyle coaching to help you achieve your wellness goals. My approach is patient-centered and science-based.",
  specialties: [
    "Weight Management",
    "Sports Nutrition",
    "Pediatric Nutrition",
    "Gut Health",
  ],
  education: [
    "M.S. in Clinical Nutrition - New York University",
    "B.S. in Dietetics - Cornell University",
  ],
  expertise: [
    "Personalized Meal Planning",
    "Holistic Wellness Coaching",
    "Digestive Health Management",
  ],
  certifications: [
    {
      name: "Registered Dietitian Nutritionist (RDN)",
      issuer: "CDN",
      year: "2012",
    },
    {
      name: "Certified Nutrition Specialist (CNS)",
      issuer: "CNS Board",
      year: "2014",
    },
  ],
  testimonials: [
    {
      id: "t_1",
      author: "Jane D.",
      rating: 4.5,
      text: "Emily helped me transform my relationship with food. Highly recommend!",
    },
    {
      id: "t_2",
      author: "Mark S.",
      rating: 5,
      text: "Very knowledgeable and supportive.",
    },
  ],
};

// Helper function to render stars with 0.1 precision
const renderStarRating = (rating) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (rating >= i + 1) {
      // Full star
      stars.push(
        <span key={i} className="text-lg" style={{ color: "#27AE60" }}>
          ★
        </span>
      );
    } else if (rating > i) {
      // Partial star
      const percentage = (rating - i) * 100;
      stars.push(
        <span
          key={i}
          className="text-lg relative inline-block"
          style={{ color: "#2F4F4F" }}
        >
          <span style={{ color: "#2F4F4F" }}>★</span>
          <span
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: `${percentage}%`,
              overflow: "hidden",
              color: "#27AE60",
            }}
          >
            ★
          </span>
        </span>
      );
    } else {
      // Empty star
      stars.push(
        <span key={i} className="text-lg" style={{ color: "#2F4F4F" }}>
          ★
        </span>
      );
    }
  }
  return stars;
};

export default function DietitianProfile() {
  const { id } = useParams();
  const [dietitian, setDietitian] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testimonials, setTestimonials] = useState([]);
  const [isBookingSidebarOpen, setIsBookingSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ FIXED: Fetch from backend API
  useEffect(() => {
    const fetchDietitian = async () => {
      try {
        setLoading(true);
        if (!id) {
          throw new Error("No dietitian ID provided");
        }

        const data = await apiService.get(
          API_ENDPOINTS.DIETITIANS.GET_BY_ID(id)
        );

        if (data.success && data.data) {
          setDietitian(data.data);
          setTestimonials(data.data.testimonials || []);
        } else {
          console.warn("No dietitian found, using mock data");
          setDietitian(mockDietitianData);
          setTestimonials(mockDietitianData.testimonials || []);
        }
      } catch (error) {
        console.error("Error fetching dietitian:", error);
        // Fallback to mock data
        setDietitian(mockDietitianData);
        setTestimonials(mockDietitianData.testimonials || []);
      } finally {
        setLoading(false);
      }
    };

    fetchDietitian();
  }, [id]);

  const currentUserId = localStorage.getItem("userId") || "user_temp";

  const handleSubmitTestimonial = async ({ text, rating }) => {
    const newTestimonial = {
      id: `t_${Date.now()}`,
      authorId: currentUserId,
      author: "You",
      rating,
      text,
    };
    setTestimonials((prev) => [newTestimonial, ...prev]);
    alert("Testimonial submitted successfully!");
  };

  const handleDeleteTestimonial = (testimonyId) => {
    const t = testimonials.find((x) => x.id === testimonyId);
    if (!t) return;
    if (t.authorId !== currentUserId) {
      alert("You can only delete testimonials you have posted.");
      return;
    }
    const confirmed = window.confirm("Delete this testimonial?");
    if (!confirmed) return;
    setTestimonials((prev) => prev.filter((x) => x.id !== testimonyId));
  };

  const handleBookingSubmit = (bookingData) => {
    console.log("Booking data:", bookingData);
    setIsBookingSidebarOpen(false);
    // Payment will be handled by PaymentModal in BookingSidebar
  };

  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ color: "#2F4F4F" }}
      >
        <p className="text-xl">Loading profile...</p>
      </div>
    );
  }

  if (!dietitian) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ color: "#2F4F4F" }}
      >
        <p className="text-xl">Error loading profile</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F5F5" }}>
      {/* Header Section */}
      <div
        className="border-b"
        style={{ backgroundColor: "#FFFFFF", borderColor: "#E0E0E0" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-8">
          <ProfileHeaderCard dietitian={dietitian} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <div
              className="rounded-lg p-6"
              style={{
                backgroundColor: "#FFFFFF",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              <h2
                className="text-xl font-bold mb-4"
                style={{ color: "#1A4A40" }}
              >
                About
              </h2>
              <p className="leading-relaxed" style={{ color: "#2F4F4F" }}>
                {dietitian.description}
              </p>
            </div>

            {/* Specialties Section */}
            <div
              className="rounded-lg p-6"
              style={{
                backgroundColor: "#FFFFFF",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              <h2
                className="text-xl font-bold mb-4"
                style={{ color: "#1A4A40" }}
              >
                Specialties
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {dietitian.specialties?.map((specialty, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-lg"
                    style={{
                      backgroundColor: "#F5F5F5",
                      borderLeft: "4px solid #27AE60",
                    }}
                  >
                    <span className="font-bold" style={{ color: "#27AE60" }}>
                      ✓
                    </span>
                    <span style={{ color: "#2F4F4F" }}>{specialty}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Expertise Section */}
            <div
              className="rounded-lg p-6"
              style={{
                backgroundColor: "#FFFFFF",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              <h2
                className="text-xl font-bold mb-4"
                style={{ color: "#1A4A40" }}
              >
                Areas of Expertise
              </h2>
              <ul className="space-y-3">
                {dietitian.expertise?.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span
                      className="font-bold text-lg mt-0"
                      style={{ color: "#27AE60" }}
                    >
                      ✓
                    </span>
                    <span style={{ color: "#2F4F4F" }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Education Section */}
            <div
              className="rounded-lg p-6"
              style={{
                backgroundColor: "#FFFFFF",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              <h2
                className="text-xl font-bold mb-4"
                style={{ color: "#1A4A40" }}
              >
                Education
              </h2>
              <div className="space-y-3">
                {dietitian.education?.map((edu, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg border-l-4"
                    style={{
                      backgroundColor: "#F5F5F5",
                      borderColor: "#27AE60",
                    }}
                  >
                    <p style={{ color: "#2F4F4F" }}>{edu}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications Section */}
            <div
              className="rounded-lg p-6"
              style={{
                backgroundColor: "#FFFFFF",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              <h2
                className="text-xl font-bold mb-4"
                style={{ color: "#1A4A40" }}
              >
                Certifications
              </h2>
              <div className="space-y-3">
                {dietitian.certifications?.map((cert, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg border-l-4"
                    style={{
                      backgroundColor: "#F5F5F5",
                      borderColor: "#27AE60",
                    }}
                  >
                    <h4 className="font-bold mb-1" style={{ color: "#1A4A40" }}>
                      {cert.name}
                    </h4>
                    <p className="text-sm" style={{ color: "#2F4F4F" }}>
                      Issued by {cert.issuer} • {cert.year}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials Section */}
            <div
              className="rounded-lg overflow-hidden"
              style={{
                backgroundColor: "#FFFFFF",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              <div
                className="px-6 py-4 flex items-center justify-between"
                style={{ backgroundColor: "#27AE60" }}
              >
                <h3 className="text-lg font-bold" style={{ color: "#FFFFFF" }}>
                  Client Testimonials ({testimonials.length})
                </h3>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all hover:opacity-90"
                  style={{ backgroundColor: "#1A4A40", color: "#FFFFFF" }}
                >
                  <FaPlus size={14} /> Add Review
                </button>
              </div>

              <div className="p-6 space-y-4">
                {testimonials.length === 0 ? (
                  <p className="text-center py-8" style={{ color: "#2F4F4F" }}>
                    No testimonials yet. Be the first to share your experience!
                  </p>
                ) : (
                  testimonials.map((testimonial) => (
                    <div
                      key={testimonial.id}
                      className="p-4 rounded-lg border"
                      style={{
                        backgroundColor: "#F5F5F5",
                        borderColor: "#E0E0E0",
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p
                            className="font-semibold mb-2"
                            style={{ color: "#1A4A40" }}
                          >
                            {testimonial.author}
                          </p>
                          <div className="flex gap-0.5">
                            {renderStarRating(testimonial.rating)}
                          </div>
                          <p
                            className="text-xs mt-1"
                            style={{ color: "#2F4F4F" }}
                          >
                            {testimonial.rating.toFixed(1)}/5 stars
                          </p>
                        </div>
                        {testimonial.authorId === currentUserId && (
                          <button
                            onClick={() =>
                              handleDeleteTestimonial(testimonial.id)
                            }
                            className="text-sm font-semibold hover:opacity-70 transition-opacity"
                            style={{ color: "#1A4A40" }}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "#2F4F4F" }}
                      >
                        {testimonial.text}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-6">
              {/* Contact Information Card */}
              <div
                className="rounded-lg overflow-hidden"
                style={{
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  className="px-6 py-4"
                  style={{ backgroundColor: "#27AE60" }}
                >
                  <h3 className="font-bold" style={{ color: "#FFFFFF" }}>
                    Contact Information
                  </h3>
                </div>
                <div className="p-6">
                  <ContactInfoCard dietitian={dietitian} />
                </div>
              </div>

              {/* Booking Button */}
              <button
                onClick={() => setIsBookingSidebarOpen(true)}
                className="w-full py-4 rounded-lg font-bold text-lg transition-all hover:opacity-90"
                style={{ backgroundColor: "#27AE60", color: "#FFFFFF" }}
              >
                Book Consultation
              </button>

              {/* Consultation Fee Card */}
              <div
                className="rounded-lg p-6"
                style={{
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                }}
              >
                <p
                  className="text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: "#2F4F4F" }}
                >
                  Consultation Fee
                </p>
                <p className="text-4xl font-bold" style={{ color: "#27AE60" }}>
                  ₹{dietitian.consultationFee}
                </p>
                <p className="text-xs mt-2" style={{ color: "#2F4F4F" }}>
                  per session
                </p>
              </div>

              {/* Stats Card */}
              <div
                className="rounded-lg p-6"
                style={{
                  backgroundColor: "#F5F5F5",
                  border: "1px solid #E0E0E0",
                }}
              >
                <div className="space-y-4">
                  <div
                    className="text-center pb-4 border-b"
                    style={{ borderColor: "#E0E0E0" }}
                  >
                    <p
                      className="text-xs font-semibold mb-1"
                      style={{ color: "#2F4F4F" }}
                    >
                      EXPERIENCE
                    </p>
                    <p
                      className="text-2xl font-bold"
                      style={{ color: "#1A4A40" }}
                    >
                      {dietitian.yearsOfExperience || 10}+ Years
                    </p>
                  </div>

                  <div
                    className="text-center pb-4 border-b"
                    style={{ borderColor: "#E0E0E0" }}
                  >
                    <p
                      className="text-xs font-semibold mb-1"
                      style={{ color: "#2F4F4F" }}
                    >
                      RATING
                    </p>
                    <div className="flex justify-center mb-1">
                      {renderStarRating(dietitian.rating || 4.5)}
                    </div>
                    <p className="text-xs" style={{ color: "#2F4F4F" }}>
                      {(dietitian.rating || 4.5).toFixed(1)} out of 5
                    </p>
                  </div>

                  <div className="text-center">
                    <p
                      className="text-xs font-semibold mb-1"
                      style={{ color: "#2F4F4F" }}
                    >
                      CONSULTATIONS
                    </p>
                    <p
                      className="text-2xl font-bold"
                      style={{ color: "#27AE60" }}
                    >
                      {testimonials.length}+
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial Modal */}
      <TestimonialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitTestimonial}
      />

      {/* Booking Sidebar */}
      <BookingSidebar
        isOpen={isBookingSidebarOpen}
        onClose={() => setIsBookingSidebarOpen(false)}
        onProceedToPayment={handleBookingSubmit}
        dietitianId={dietitian._id}
      />
    </div>
  );
}
