import React from "react";
import { useNavigate } from "react-router-dom";

const RatingStars = ({ rating }) => {
  const full = Math.floor(rating);
  const part = rating - full;
  const empty = 5 - Math.ceil(rating);

  return (
    <span className="flex items-center gap-1">
      {Array(full)
        .fill(null)
        .map((_, i) => (
          <i key={i} className="fas fa-star text-green-600"></i>
        ))}
      {part > 0 && <i className="fas fa-star-half-alt text-green-600"></i>}
      {Array(empty)
        .fill(null)
        .map((_, i) => (
          <i key={i + empty} className="far fa-star text-gray-300"></i>
        ))}
      <span className="text-gray-600 font-medium ml-1">
        {rating.toFixed(1)}
      </span>
    </span>
  );
};

const DietitianCard = ({ dietitian, onBookAppointment }) => {
  const navigate = useNavigate();
  const {
    _id: id,
    photo,
    name,
    specialties = [],
    experience = 0,
    fees: consultationFee = 0,
    languages = [],
    location,
    rating = 0,
    online: onlineConsultation,
    offline: offlineConsultation,
  } = dietitian;

  const handleCardClick = () => {
    // Store current scroll position before navigating
    sessionStorage.setItem('dietitianListScrollPosition', window.scrollY.toString());
    navigate(`/user/dietitian-profiles/${id}`, { state: { dietitian } });
  };

  const handleBookClick = (e) => {
    e.stopPropagation(); // Prevent card click when booking
    onBookAppointment(dietitian);
  };

  const handleViewProfileClick = (e) => {
    e.stopPropagation(); // Prevent card click
    // Store current scroll position before navigating
    sessionStorage.setItem('dietitianListScrollPosition', window.scrollY.toString());
    navigate(`/user/dietitian-profiles/${id}`, { state: { dietitian } });
  };

  return (
    <div 
      className="rounded-2xl shadow-lg bg-white p-6 mb-6 flex flex-col gap-4 hover:shadow-xl transition-all duration-300 border-t-4 border-emerald-600 hover:border-emerald-700 cursor-pointer group"
      onClick={handleCardClick}
    >
      <div className="flex gap-6 items-start">
        <div className="relative">
          <img
            src={photo || "https://via.placeholder.com/128?text=Dietitian"}
            alt={name}
            className="rounded-xl object-cover shrink transition-transform duration-300 group-hover:scale-105 border-4 border-emerald-600"
            style={{
              width: 100,
              height: 100,
            }}
            onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/128?text=Dietitian'}
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-2xl mb-2 group-hover:text-emerald-600 transition-colors text-teal-900">
            {name}
          </h2>

          <div className="flex items-center gap-3 mb-3">
            <RatingStars rating={rating} />
            <span className="text-sm text-emerald-600 font-medium">({experience}+ years)</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {specialties.slice(0, 3).map((specialty, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200"
              >
                {specialty}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
              <div className="flex items-center gap-2 mb-1">
                <i className="fas fa-briefcase text-emerald-600 text-sm"></i>
                <div className="text-gray-600 text-sm font-medium">
                  EXPERIENCE
                </div>
              </div>
              <div className="text-emerald-700 font-bold">
                {experience} years
              </div>
            </div>

            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
              <div className="flex items-center gap-2 mb-1">
                <i className="fas fa-rupee-sign text-emerald-600 text-sm"></i>
                <div className="text-gray-600 text-sm font-medium">
                  CONSULTATION FEE
                </div>
              </div>
              <div className="text-emerald-700 font-bold">
                ₹{consultationFee}
              </div>
            </div>

            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
              <div className="flex items-center gap-2 mb-1">
                <i className="fas fa-language text-emerald-600 text-sm"></i>
                <div className="text-gray-600 text-sm font-medium">
                  LANGUAGES
                </div>
              </div>
              <div className="text-gray-700">{languages.join(", ")}</div>
            </div>

            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
              <div className="flex items-center gap-2 mb-1">
                <i className="fas fa-video text-emerald-600 text-sm"></i>
                <div className="text-gray-600 text-sm font-medium">
                  CONSULTATION MODE
                </div>
              </div>
              <div className="text-gray-700">
                {onlineConsultation && offlineConsultation
                  ? "Online & In-person"
                  : onlineConsultation
                  ? "Online only"
                  : "In-person only"}
              </div>
            </div>
          </div>

          <div className="p-3 mt-3 mb-2 flex items-center gap-2 bg-emerald-50 rounded-lg text-teal-900">
            <i className="fas fa-map-marker-alt text-emerald-600"></i>
            {location}
          </div>

          <div className="flex gap-3 mt-2">
            <button
              className="bg-emerald-600 text-white font-bold rounded-full py-3 text-base flex-1 border-none outline-none cursor-pointer hover:bg-emerald-700 transition-colors shadow-md"
              onClick={handleBookClick}
            >
              Book Appointment
            </button>
            <button
              className="border-2 border-emerald-600 text-teal-900 bg-white font-bold rounded-full py-3 text-base flex-1 cursor-pointer hover:bg-emerald-50 transition-colors"
              onClick={handleViewProfileClick}
            >
              View Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DietitianCard;
