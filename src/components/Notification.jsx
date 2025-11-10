// src/components/Notification.js
import React, { useEffect } from "react";

const Notification = ({ show, message, type }) => {
  useEffect(() => {
    if (show) {
      // Ensure notification is visible
      console.log("Notification shown:", message, type);
    }
  }, [show, message, type]);

  if (!show) return null;

  const borderColor =
    type === "success" ? "border-green-600" : "border-red-600";
  const icon = type === "success" ? "✓" : "✕";
  const bgGradient =
    type === "success"
      ? "from-green-400 to-green-600"
      : "from-red-400 to-red-600";

  return (
    <div
      className={`fixed top-24 right-6 max-w-sm w-full md:w-96 z-50 animate-bounce`}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        className={`bg-gradient-to-r ${bgGradient} ${borderColor} border-2 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 backdrop-blur-sm`}
      >
        <span className="text-2xl font-bold flex-shrink-0">{icon}</span>
        <div className="flex-1">
          <p className="text-sm md:text-base font-semibold">{message}</p>
        </div>
        <div className="w-1 h-1 bg-white rounded-full flex-shrink-0 animate-pulse"></div>
      </div>
    </div>
  );
};

export default Notification;
