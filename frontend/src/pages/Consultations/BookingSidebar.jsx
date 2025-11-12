import React, { useState, useEffect } from "react";

const BookingSidebar = ({
  isOpen,
  onClose,
  onProceedToPayment,
  dietitianId,
}) => {
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [selectedTime, setSelectedTime] = useState("");
  const [consultationType, setConsultationType] = useState("Online");
  const [availableSlots, setAvailableSlots] = useState({
    morning: [],
    afternoon: [],
    evening: [],
  });
  const [bookedSlots, setBookedSlots] = useState([]);
  const [message, setMessage] = useState("");

  // default date is set via initial state

  // Load mock available slots
  useEffect(() => {
    if (!selectedDate || !dietitianId) return;

    const loadSlots = () => {
      setMessage("");
      setAvailableSlots({ morning: [], afternoon: [], evening: [] });

      try {
        const now = new Date();
        const isToday =
          new Date(selectedDate).toDateString() === now.toDateString();
        const currentTime = now.getHours() * 60 + now.getMinutes();

        // Get available slots (hardcoded for now)
        const allSlots = [
          "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
          "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
          "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
          "18:00", "18:30", "19:00", "19:30", "20:00"
        ].filter((slot) => {
          if (!isToday) return true;
          const [hour, minute] = slot.split(":").map(Number);
          return hour * 60 + minute >= currentTime;
        });

        // Categorize slots
        setAvailableSlots({
          morning: allSlots.filter((s) => {
            const [hour] = s.split(":").map(Number);
            return hour < 12;
          }),
          afternoon: allSlots.filter((s) => {
            const [hour] = s.split(":").map(Number);
            return hour >= 12 && hour < 17;
          }),
          evening: allSlots.filter((s) => {
            const [hour] = s.split(":").map(Number);
            return hour >= 17;
          }),
        });

        setBookedSlots([]);
      } catch (error) {
        console.error("Error loading slots:", error);
        setMessage("Error loading slots");
      }
    };

    loadSlots();
  }, [selectedDate, dietitianId]);

  const handleSubmit = () => {
    if (!selectedDate || !selectedTime) {
      setMessage("Please select a date and time slot.");
      return;
    }
    onProceedToPayment({
      date: selectedDate,
      time: selectedTime,
      consultationType,
    });
  };

  const todayStr = new Date().toISOString().split("T")[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 21);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  return (
    <div
      className={`fixed top-16 right-0 w-[33%] max-h-[calc(100vh-4rem)] bg-white shadow-2xl transform transition-transform duration-300 z-50 overflow-y-auto ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-6 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b">
          <button
            onClick={onClose}
            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 text-xl font-light rounded-full w-8 h-8 flex items-center justify-center transition-colors mr-3"
            aria-label="Collapse sidebar"
          >
            ›
          </button>
          <h2 className="text-2xl font-bold text-dark-accent flex-1 text-center">
            Book Appointment
          </h2>
          <button
            onClick={onClose}
            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 text-2xl font-light rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            aria-label="Close sidebar"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {/* Consultation Type */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3 text-gray-700">
              Consultation Type
            </label>
            <div className="flex gap-3">
              {["Online", "In-person"].map((type) => (
                <button
                  key={type}
                  onClick={() => setConsultationType(type)}
                  className={`flex-1 px-4 py-2 rounded-lg transition font-medium ${
                    consultationType === type
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Date Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={todayStr}
              max={maxDateStr}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            />
          </div>

          {/* Time Slots */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3 text-gray-700">
              Available Time Slots
            </label>

            {availableSlots.morning.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-gray-600 mb-2 font-semibold uppercase tracking-wide">
                  Morning
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {availableSlots.morning.map((time) => {
                    const isBooked = bookedSlots.includes(time);
                    const isSelected = selectedTime === time;
                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => !isBooked && setSelectedTime(time)}
                        className={`px-4 py-2 rounded-lg transition font-medium text-center ${
                          isBooked
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
                            : isSelected
                            ? "bg-emerald-600 text-white shadow-md border-2 border-emerald-600"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200 border-2 border-transparent"
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {availableSlots.afternoon.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-gray-600 mb-2 font-semibold uppercase tracking-wide">
                  Afternoon
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {availableSlots.afternoon.map((time) => {
                    const isBooked = bookedSlots.includes(time);
                    const isSelected = selectedTime === time;
                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => !isBooked && setSelectedTime(time)}
                        className={`px-4 py-2 rounded-lg transition font-medium text-center ${
                          isBooked
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
                            : isSelected
                            ? "bg-emerald-600 text-white shadow-md border-2 border-emerald-600"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200 border-2 border-transparent"
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {availableSlots.evening.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-gray-600 mb-2 font-semibold uppercase tracking-wide">
                  Evening
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {availableSlots.evening.map((time) => {
                    const isBooked = bookedSlots.includes(time);
                    const isSelected = selectedTime === time;
                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => !isBooked && setSelectedTime(time)}
                        className={`px-4 py-2 rounded-lg transition font-medium text-center ${
                          isBooked
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
                            : isSelected
                            ? "bg-emerald-600 text-white shadow-md border-2 border-emerald-600"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200 border-2 border-transparent"
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {availableSlots.morning.length === 0 &&
              availableSlots.afternoon.length === 0 &&
              availableSlots.evening.length === 0 && (
                <p className="text-gray-600 text-sm">No slots available</p>
              )}
          </div>

          {/* Message */}
          {message && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {message}
            </div>
          )}

          {/* Selected Time Display */}
          {selectedTime && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm font-medium">
              Selected time: {selectedTime}
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-semibold"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedTime}
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSidebar;
