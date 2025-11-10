// src/components/ContactInfoCard.jsx
import React from "react";
import {
  FaMapMarkerAlt,
  FaLanguage,
  FaVideo,
  FaBuilding,
  FaRupeeSign,
} from "react-icons/fa";

const InfoLine = ({ icon, text }) => (
  <div className="flex items-start gap-3">
    <span className="text-primary-green text-xl mt-0.5">{icon}</span>
    <p className="text-secondary-text">{text}</p>
  </div>
);

export default function ContactInfoCard({ dietitian }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-dark-accent mb-5">
        Contact Information
      </h3>
      <div className="space-y-4">
        <InfoLine
          icon={<FaMapMarkerAlt />}
          text={dietitian.location || "Not specified"}
        />
        <InfoLine
          icon={<FaLanguage />}
          text={dietitian.languages.join(", ") || "Not specified"}
        />
        <InfoLine
          icon={<FaVideo />}
          text={
            dietitian.online
              ? "Online Consultation Available"
              : "Online Consultation Not Available"
          }
        />
        <InfoLine
          icon={<FaBuilding />}
          text={
            dietitian.offline
              ? "Offline Consultation Available"
              : "Offline Consultation Not Available"
          }
        />
        <InfoLine
          icon={<FaRupeeSign />}
          text={`₹${dietitian.fees || "N/A"} per session`}
        />
      </div>
    </div>
  );
}
