import React, { useState } from "react";
import { useForm } from "react-hook-form";

const PaymentNotificationModal = ({
  isOpen,
  onClose,
  onSubmit,
  paymentDetails
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
  } = useForm({
    defaultValues: {
      paymentMethod: "UPI",
      email: "",
    },
  });

  const paymentMethod = watch("paymentMethod");

  if (!isOpen) return null;

  const inputClasses =
    "w-full px-4 py-3 border-2 border-gray-300 rounded-lg transition-all duration-200 " +
    "focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 " +
    "text-gray-700 font-medium placeholder-gray-400";

  const labelClasses = "block mb-2 font-semibold text-gray-700 text-sm";

  const renderPaymentDetails = () => {
    switch (paymentMethod) {
      case "Credit Card":
        return (
          <>
            <div className="mb-5">
              <label className={labelClasses}>Card Number</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                maxLength="16"
                {...register("cardNumber")}
                className={`${inputClasses}`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className={labelClasses}>Expiry Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  maxLength="5"
                  {...register("expiryDate")}
                  className={`${inputClasses}`}
                />
              </div>
              <div>
                <label className={labelClasses}>CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  maxLength="4"
                  {...register("cvv")}
                  className={`${inputClasses}`}
                />
              </div>
            </div>
          </>
        );

      case "UPI":
        return (
          <div className="mb-5">
            <label className={labelClasses}>UPI ID</label>
            <p className="text-xs text-gray-500 mb-2">
              Format: username@bankname (e.g., john@okhdfcbank)
            </p>
            <input
              type="text"
              placeholder="yourname@okhdfcbank"
              {...register("upiId")}
              className={`${inputClasses}`}
            />
          </div>
        );

      case "PayPal":
        return (
          <div className="mb-5">
            <label className={labelClasses}>PayPal Email</label>
            <input
              type="email"
              placeholder="yourname@gmail.com"
              {...register("paypalEmail")}
              className={`${inputClasses}`}
            />
          </div>
        );

      default:
        return null;
    }
  };

  const handleFormSubmit = async () => {
    setIsProcessing(true);
    try {
      // Validate email
      const email = watch("email");
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Please enter a valid email address");
        setIsProcessing(false);
        return;
      }

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Call onSubmit with email data
      if (onSubmit) {
        onSubmit({ email, paymentMethod: watch("paymentMethod"), amount: paymentDetails?.amount, transactionId: "PAYMENT_" + Date.now() });
      }

      // Close modal
      onClose();

      // Reset form
      reset();

    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment processing failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* Payment Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        {/* Glassmorphism Blur Background */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300"
          onClick={onClose}
        ></div>

        {/* Modal Card with Glassmorphism Effect */}
        <div className="relative bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-2xl w-full max-h-[550px] overflow-y-auto p-6 border border-white/20">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-dark-accent">
              Complete Payment
            </h2>
            <button
              onClick={onClose}
              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 text-2xl font-light rounded-full w-8 h-8 flex items-center justify-center transition-colors"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>

          {/* Booking Details */}
          <div className="mb-6 p-4 bg-linear-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
            <h3 className="font-semibold text-dark-accent mb-4 text-sm uppercase tracking-wide">
              Booking Summary
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Amount:</span>
                <span className="font-bold text-emerald-600 text-lg">
                  ₹{paymentDetails?.amount}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Dietitian:</span>
                <span className="font-medium text-gray-800 text-sm">
                  {paymentDetails?.dietitianName}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Date:</span>
                <span className="font-medium text-gray-800 text-sm">
                  {paymentDetails?.date}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Time:</span>
                <span className="font-medium text-gray-800 text-sm">
                  {paymentDetails?.time}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Type:</span>
                <span className="font-medium text-gray-800 text-sm">
                  {paymentDetails?.type}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            {/* Email Field */}
            <div className="mb-6">
              <label className={labelClasses}>Email Address *</label>
              <p className="text-xs text-gray-500 mb-2">
                Booking confirmation will be sent to this email
              </p>
              <input
                type="email"
                placeholder="your.email@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email"
                  }
                })}
                className={`${inputClasses}`}
              />
              {watch("email") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(watch("email")) && (
                <p className="text-red-500 text-xs mt-1">Please enter a valid email address</p>
              )}
            </div>

            {/* Payment Method Selection */}
            <div className="mb-6">
              <label className={labelClasses}>Payment Method</label>
              <select
                {...register("paymentMethod")}
                className={`${inputClasses} cursor-pointer bg-white`}
              >
                <option value="UPI">� UPI</option>
                <option value="Credit Card">� Credit/Debit Card</option>
                <option value="PayPal">� PayPal</option>
              </select>
            </div>

            {/* Dynamic Payment Fields */}
            {renderPaymentDetails()}

            {/* Security Notice */}
            <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
              <p className="text-xs text-emerald-700 flex items-center gap-2">
                <span className="text-emerald-600">🔒</span>
                Your payment information is secure and encrypted
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <span className="animate-spin text-emerald-600">⏳</span>
                    Processing...
                  </>
                ) : (
                  "Confirm Payment"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PaymentNotificationModal;