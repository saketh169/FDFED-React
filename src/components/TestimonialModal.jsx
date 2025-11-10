import React, { useState, useRef, useEffect } from "react";

export default function TestimonialModal({
  isOpen,
  onClose,
  onSubmit,
  initialRating = 0,
}) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const starsContainerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setRating(initialRating);
      setText("");
      setError("");
      setSubmitting(false);
      setUploaded(false);
    }
  }, [isOpen, initialRating]);

  // Simple, direct star click handler
  const handleStarClick = (e) => {
    if (!starsContainerRef.current) return;

    const container = starsContainerRef.current;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;

    // Calculate which star was clicked (0-5)
    const starIndex = Math.floor(x / (rect.width / 5));

    // Ensure value is between 0 and 5
    let newRating = starIndex;
    if (x % (rect.width / 5) > rect.width / 5 / 2) {
      newRating = starIndex + 0.5;
    }

    // Clamp to 0-5
    newRating = Math.max(0.5, Math.min(5, newRating));

    setRating(newRating);
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(
          <span
            key={i}
            className="text-yellow-400 text-5xl cursor-pointer hover:text-yellow-300"
          >
            ★
          </span>
        );
      } else if (rating >= i - 0.5) {
        stars.push(
          <span
            key={i}
            className="text-yellow-400 text-5xl cursor-pointer hover:text-yellow-300"
          >
            ☆
          </span>
        );
      } else {
        stars.push(
          <span
            key={i}
            className="text-gray-300 text-5xl cursor-pointer hover:text-gray-200"
          >
            ★
          </span>
        );
      }
    }
    return stars;
  };

  const isMeaningfulText = (s) => {
    if (!s) return false;
    const trimmed = s.trim();
    if (trimmed.length < 20) return false;
    const words = trimmed.split(/\s+/).filter(Boolean);
    if (words.length < 3) return false;
    const uniqChars = new Set(trimmed.replace(/\s+/g, ""));
    if (uniqChars.size < 3) return false;
    return true;
  };

  const validate = () => {
    if (rating < 0.5) {
      setError("Please give a rating of at least 0.5 stars.");
      return false;
    }
    if (!isMeaningfulText(text)) {
      setError(
        "Please write a meaningful testimonial (at least 20 characters and 3 words)."
      );
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async () => {
    if (submitting) return;
    if (!validate()) return;

    try {
      setSubmitting(true);
      await Promise.resolve(onSubmit({ text: text.trim(), rating }));
      setUploaded(true);
      setSubmitting(false);

      setTimeout(() => {
        setUploaded(false);
        onClose();
      }, 900);
    } catch (err) {
      setError(err?.message || "Failed to submit testimonial.");
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blur Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm z-40 transition-all duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div className="relative z-50 bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 border border-gray-100">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-dark-accent">
            Share Your Experience
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 text-2xl font-light"
          >
            ✕
          </button>
        </div>

        {/* Success State */}
        {uploaded && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 rounded-lg">
            <p className="text-green-800 font-semibold text-center">
              ✓ Thank you for your testimonial!
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 rounded-lg">
            <p className="text-red-800 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Rating Section */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            How would you rate this consultation?
          </label>

          {/* Stars - Interactive */}
          <div
            ref={starsContainerRef}
            onClick={handleStarClick}
            className="flex gap-2 justify-center mb-4 cursor-pointer"
            style={{ width: "100%", height: "80px" }}
          >
            {renderStars()}
          </div>

          {/* Rating Display - ACCURATE */}
          <p className="text-center text-xl font-bold text-gray-800 mb-2">
            {rating === 0 ? "Select a rating" : `${rating} out of 5 stars`}
          </p>
        </div>

        {/* Text Area */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Write your testimonial
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your experience with this nutritionist (minimum 20 characters)..."
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary-green focus:ring-2 focus:ring-primary-green/30 resize-none"
            rows="5"
          />
          <p className="text-xs text-gray-500 mt-1">{text.length} characters</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={submitting}
            className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || !rating}
            className="flex-1 px-4 py-3 bg-primary-green text-white rounded-lg hover:bg-dark-accent transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <span className="animate-spin">⏳</span>
                Submitting...
              </>
            ) : (
              "Submit Review"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
