import React from "react";

const FilterSidebar = ({
  specializations,
  onFilterChange,
  onClearFilters,
  filters,
}) => {
  const renderStars = (rating) => {
    return "★".repeat(Math.floor(rating)) + (rating % 1 !== 0 ? "☆" : "");
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 sticky top-32">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-300">
        <h2
          className="text-base font-bold text-dark-accent"
          style={{
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            letterSpacing: "-0.5px",
          }}
        >
          Filters
        </h2>
        <button
          onClick={onClearFilters}
          className="text-xs text-red-600 hover:text-red-800 font-semibold hover:bg-red-50 px-2 py-1 rounded transition"
          style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
        >
          Clear
        </button>
      </div>

      {/* Specialization Filter */}
      {specializations && specializations.length > 0 && (
        <div className="mb-6">
          <label
            className="block text-xs font-semibold text-gray-800 mb-3 uppercase tracking-wide"
            style={{
              fontFamily: "'Inter', 'Segoe UI', sans-serif",
              letterSpacing: "0.5px",
            }}
          >
            Specializations
          </label>
          <div className="space-y-2">
            {specializations.map((spec) => (
              <label
                key={spec.value}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition"
              >
                <input
                  type="checkbox"
                  checked={filters.specialization.includes(spec.value)}
                  onChange={() => onFilterChange("specialization", spec.value)}
                  className="w-4 h-4 text-primary-green rounded accent-primary-green cursor-pointer"
                />
                <span
                  className="text-sm text-gray-700"
                  style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
                >
                  {spec.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Mode Filter */}
      <div className="mb-6">
        <label
          className="block text-xs font-semibold text-gray-800 mb-3 uppercase tracking-wide"
          style={{
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            letterSpacing: "0.5px",
          }}
        >
          Consultation Mode
        </label>
        <div className="space-y-2">
          {["online", "offline"].map((mode) => (
            <label
              key={mode}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition"
            >
              <input
                type="checkbox"
                checked={filters.mode.includes(mode)}
                onChange={() => onFilterChange("mode", mode)}
                className="w-4 h-4 text-primary-green rounded accent-primary-green cursor-pointer"
              />
              <span
                className="text-sm text-gray-700"
                style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
              >
                {mode === "online" ? "Online" : "In-person"}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Experience Filter */}
      <div className="mb-6">
        <label
          className="block text-xs font-semibold text-gray-800 mb-3 uppercase tracking-wide"
          style={{
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            letterSpacing: "0.5px",
          }}
        >
          Experience
        </label>
        <div className="space-y-2">
          {[3, 5, 10].map((exp) => (
            <label
              key={exp}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition"
            >
              <input
                type="radio"
                name="experience"
                value={exp}
                checked={filters.experience.includes(exp)}
                onChange={() => onFilterChange("experience", exp)}
                className="w-4 h-4 text-primary-green cursor-pointer accent-primary-green"
              />
              <span
                className="text-sm text-gray-700"
                style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
              >
                {exp}+ years
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Fees Filter */}
      <div className="mb-6">
        <label
          className="block text-xs font-semibold text-gray-800 mb-3 uppercase tracking-wide"
          style={{
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            letterSpacing: "0.5px",
          }}
        >
          Consultation Fees
        </label>
        <div className="space-y-2">
          {[1000, 1500, 2000].map((fee) => (
            <label
              key={fee}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition"
            >
              <input
                type="radio"
                name="fees"
                value={fee}
                checked={filters.fees.includes(fee)}
                onChange={() => onFilterChange("fees", fee)}
                className="w-4 h-4 text-primary-green cursor-pointer accent-primary-green"
              />
              <span
                className="text-sm text-gray-700"
                style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
              >
                ₹{fee}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Language Filter */}
      <div className="mb-6">
        <label
          className="block text-xs font-semibold text-gray-800 mb-3 uppercase tracking-wide"
          style={{
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            letterSpacing: "0.5px",
          }}
        >
          Languages
        </label>
        <div className="space-y-2">
          {["English", "Hindi", "Telugu", "Tamil"].map((lang) => (
            <label
              key={lang}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition"
            >
              <input
                type="checkbox"
                checked={filters.language.includes(lang)}
                onChange={() => onFilterChange("language", lang)}
                className="w-4 h-4 text-primary-green rounded accent-primary-green cursor-pointer"
              />
              <span
                className="text-sm text-gray-700"
                style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
              >
                {lang}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating Filter - WITH STARS - NEW RATINGS */}
      <div>
        <label
          className="block text-xs font-semibold text-gray-800 mb-3 uppercase tracking-wide"
          style={{
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            letterSpacing: "0.5px",
          }}
        >
          Minimum Rating
        </label>
        <div className="space-y-2">
          {[3, 3.5, 4, 4.5].map((rating) => (
            <label
              key={rating}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition"
            >
              <input
                type="radio"
                name="rating"
                value={rating}
                checked={filters.rating.includes(rating)}
                onChange={() => onFilterChange("rating", rating)}
                className="w-4 h-4 text-primary-green cursor-pointer accent-primary-green"
              />
              <span
                className="text-sm text-gray-700 flex items-center gap-1"
                style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
              >
                <span className="text-yellow-500 font-bold text-lg">
                  {renderStars(rating)}
                </span>
                <span className="text-gray-500">{rating}</span>
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
