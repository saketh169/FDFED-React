// src/components/ProfileHeaderCard.jsx
import React from "react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

// Helper function to render stars
const renderStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={`star-${i}`} />);
  }
  if (hasHalfStar) {
    stars.push(<FaStarHalfAlt key="half-star" />);
  }
  return stars;
};

export default function ProfileHeaderCard({ dietitian }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 text-center">
      <img
        src={dietitian.profileImage || "/images/default-profile.jpg"}
        alt={dietitian.name}
        className="w-40 h-40 rounded-full mx-auto border-4 border-primary-green object-cover"
      />
      <h2 className="text-2xl font-bold text-dark-accent mt-4">
        {dietitian.name || "Unknown Dietitian"}
      </h2>
      <p className="text-secondary-text text-lg">
        {dietitian.title || "Nutrition Specialist"}
      </p>
      <div className="flex justify-center items-center gap-1 mt-2 text-yellow-500 text-xl">
        {renderStars(dietitian.rating)}
        <span className="text-secondary-text text-base ml-2">
          ({dietitian.rating || "N/A"})
        </span>
      </div>
    </div>
  );
}
