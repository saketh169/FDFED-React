import React from "react";
import { useNavigate } from "react-router-dom";

// Color palette
const COLORS = {
  GREEN: "#27AE60",
  DARK: "#1A4A40",
  TEXT: "#2F4F4F",
  WHITE: "#fff",
  LIGHT: "#F5F5F5",
};

const RatingStars = ({ rating }) => {
  const full = Math.floor(rating);
  const part = rating - full;
  const empty = 5 - Math.ceil(rating);

  return (
    <span className="flex items-center gap-1">
      {Array(full)
        .fill(null)
        .map((_, i) => (
          <span key={i} style={{ color: "#FFC107" }}>
            ★
          </span>
        ))}
      {part > 0 && <span style={{ color: "#FFC107" }}>✩</span>}
      {Array(empty)
        .fill(null)
        .map((_, i) => (
          <span key={i + empty} style={{ color: "#E0E0E0" }}>
            ★
          </span>
        ))}
      <span style={{ color: COLORS.TEXT, fontWeight: 500, marginLeft: 2 }}>
        {rating.toFixed(1)}
      </span>
    </span>
  );
};

const DietitianCard = ({ dietitian, onBookAppointment }) => {
  const navigate = useNavigate();
  const {
    id,
    photo,
    name,
    specialties = [],
    experience = 0,
    consultationFee = 0,
    languages = [],
    location,
    rating = 0,
    onlineConsultation,
    offlineConsultation,
  } = dietitian;

  return (
    <div
      className="rounded-2xl shadow bg-white p-6 mb-6 flex flex-col gap-2"
      style={{
        minHeight: 0,
        boxShadow: "0 4px 16px rgba(39,174,96,0.08)",
        border: "none",
      }}
    >
      <div className="flex gap-5 items-start">
        <img
          src={photo || "avatar-placeholder.png"}
          alt={name}
          className="rounded-lg object-cover flex-shrink-0"
          style={{
            width: 100,
            height: 100,
            border: `3px solid ${COLORS.GREEN}`,
          }}
        />
        <div className="flex-1">
          <h2
            className="font-bold text-2xl"
            style={{
              color: COLORS.DARK,
              lineHeight: 1.1,
            }}
          >
            {name}
          </h2>

          <div className="flex items-center gap-2 mt-1">
            <RatingStars rating={rating} />
          </div>

          <div
            style={{
              color: COLORS.TEXT,
              fontWeight: 500,
              fontSize: 14,
              marginTop: 3,
            }}
          >
            {specialties.join(", ")}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <div
          style={{
            background: COLORS.LIGHT,
            borderRadius: 8,
          }}
          className="p-3"
        >
          <div style={{ color: COLORS.TEXT, fontSize: 13, fontWeight: 500 }}>
            EXPERIENCE
          </div>
          <div style={{ color: COLORS.GREEN, fontWeight: 700 }}>
            {experience} years
          </div>
        </div>

        <div
          style={{
            background: COLORS.LIGHT,
            borderRadius: 8,
          }}
          className="p-3"
        >
          <div style={{ color: COLORS.TEXT, fontSize: 13, fontWeight: 500 }}>
            CONSULTATION FEE
          </div>
          <div style={{ color: COLORS.GREEN, fontWeight: 700 }}>
            ₹{consultationFee}
          </div>
        </div>

        <div
          style={{
            background: COLORS.LIGHT,
            borderRadius: 8,
          }}
          className="p-3"
        >
          <div style={{ color: COLORS.TEXT, fontSize: 13, fontWeight: 500 }}>
            LANGUAGES
          </div>
          <div style={{ color: COLORS.TEXT }}>{languages.join(", ")}</div>
        </div>

        <div
          style={{
            background: COLORS.LIGHT,
            borderRadius: 8,
          }}
          className="p-3"
        >
          <div style={{ color: COLORS.TEXT, fontSize: 13, fontWeight: 500 }}>
            CONSULTATION MODE
          </div>
          <div style={{ color: COLORS.TEXT }}>
            {onlineConsultation && offlineConsultation
              ? "Online & In-person"
              : onlineConsultation
              ? "Online only"
              : "In-person only"}
          </div>
        </div>
      </div>

      <div
        className="p-3 mt-3 mb-2"
        style={{
          background: "#EAF6F0",
          borderRadius: 8,
          color: COLORS.DARK,
        }}
      >
        <span role="img" aria-label="pin">
          📍
        </span>{" "}
        {location}
      </div>

      <div className="flex gap-3 mt-2">
        <button
          style={{
            background: COLORS.GREEN,
            color: COLORS.WHITE,
            fontWeight: "bold",
            borderRadius: 8,
            padding: "12px 0",
            fontSize: 16,
            flex: 1,
            border: "none",
            outline: "none",
            cursor: "pointer",
          }}
          onClick={() => onBookAppointment(dietitian)}
        >
          Book Appointment
        </button>
        <button
          style={{
            border: `2px solid ${COLORS.GREEN}`,
            color: COLORS.DARK,
            background: COLORS.WHITE,
            fontWeight: "bold",
            borderRadius: 8,
            fontSize: 16,
            flex: 1,
            padding: "12px 0",
            cursor: "pointer",
          }}
          onClick={() => navigate(`/dietitian-profiles/${id}`)}
        >
          View Profile
        </button>
      </div>
    </div>
  );
};

export default DietitianCard;
