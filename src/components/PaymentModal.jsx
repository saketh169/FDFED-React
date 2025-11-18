import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Validation Schema with proper UPI, Card, and PayPal validations
const validationSchema = yup.object().shape({
  paymentMethod: yup.string().required("Please select a payment method"),
  cardNumber: yup.string().when("paymentMethod", {
    is: "Credit Card",
    then: (schema) =>
      schema
        .required("Card Number is required")
        .matches(/^\d{16}$/, "Card number must be 16 digits")
        .typeError("Card number must contain only digits"),
  }),
  expiryDate: yup.string().when("paymentMethod", {
    is: "Credit Card",
    then: (schema) =>
      schema
        .required("Expiry Date is required")
        .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "Format should be MM/YY"),
  }),
  cvv: yup.string().when("paymentMethod", {
    is: "Credit Card",
    then: (schema) =>
      schema
        .required("CVV is required")
        .matches(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
  }),
  upiId: yup.string().when("paymentMethod", {
    is: "UPI",
    then: (schema) =>
      schema
        .required("UPI ID is required")
        .matches(
          /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/,
          "Valid UPI ID format: username@bankname (e.g., john@okhdfcbank)"
        )
        .typeError("Please enter a valid UPI ID"),
  }),
  paypalEmail: yup.string().when("paymentMethod", {
    is: "PayPal",
    then: (schema) =>
      schema
        .required("PayPal email is required")
        .email("Please enter a valid email address")
        .matches(
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          "Please enter a valid PayPal email"
        ),
  }),
});

const PaymentModal = ({ isOpen, onClose, onSubmit, paymentDetails }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      paymentMethod: "UPI",
    },
  });

  const paymentMethod = watch("paymentMethod");

  if (!isOpen) return null;

  const inputClasses =
    "w-full px-4 py-3 border-2 border-gray-300 rounded-lg transition-all duration-200 " +
    "focus:outline-none focus:border-primary-green focus:ring-2 focus:ring-primary-green/30 " +
    "text-gray-700 font-medium placeholder-gray-400";

  const labelClasses = "block mb-2 font-semibold text-gray-700 text-sm";

  const errorClasses = "text-red-600 text-xs mt-1 font-medium";

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
                className={`${inputClasses} ${
                  errors.cardNumber
                    ? "border-red-500 focus:ring-red-500/30"
                    : ""
                }`}
              />
              {errors.cardNumber && (
                <span className={errorClasses}>
                  {errors.cardNumber.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className={labelClasses}>Expiry Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  maxLength="5"
                  {...register("expiryDate")}
                  className={`${inputClasses} ${
                    errors.expiryDate
                      ? "border-red-500 focus:ring-red-500/30"
                      : ""
                  }`}
                />
                {errors.expiryDate && (
                  <span className={errorClasses}>
                    {errors.expiryDate.message}
                  </span>
                )}
              </div>
              <div>
                <label className={labelClasses}>CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  maxLength="4"
                  {...register("cvv")}
                  className={`${inputClasses} ${
                    errors.cvv ? "border-red-500 focus:ring-red-500/30" : ""
                  }`}
                />
                {errors.cvv && (
                  <span className={errorClasses}>{errors.cvv.message}</span>
                )}
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
              className={`${inputClasses} ${
                errors.upiId ? "border-red-500 focus:ring-red-500/30" : ""
              }`}
            />
            {errors.upiId && (
              <span className={errorClasses}>{errors.upiId.message}</span>
            )}
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
              className={`${inputClasses} ${
                errors.paypalEmail ? "border-red-500 focus:ring-red-500/30" : ""
              }`}
            />
            {errors.paypalEmail && (
              <span className={errorClasses}>{errors.paypalEmail.message}</span>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const handleFormSubmit = async (data) => {
    setIsProcessing(true);
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onSubmit(data);
      reset();
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Glassmorphism Blur Background */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm z-40 transition-all duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Card with Glassmorphism Effect */}
      <div className="relative z-50 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-md w-full p-8 border border-white/20">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-dark-accent">
            Complete Payment
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 text-2xl font-light hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Booking Details */}
        <div className="mb-6 p-4 bg-gradient-to-br from-primary-green/5 to-primary-green/10 rounded-xl border border-primary-green/20">
          <h3 className="font-semibold text-dark-accent mb-4 text-sm uppercase tracking-wide">
            Booking Summary
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Amount:</span>
              <span className="font-bold text-primary-green text-lg">
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
          {/* Payment Method Selection */}
          <div className="mb-6">
            <label className={labelClasses}>Payment Method</label>
            <select
              {...register("paymentMethod")}
              className={`${inputClasses} cursor-pointer bg-white`}
            >
              <option value="UPI">💳 UPI</option>
              <option value="Credit Card">💰 Credit/Debit Card</option>
              <option value="PayPal">🔐 PayPal</option>
            </select>
            {errors.paymentMethod && (
              <span className={errorClasses}>
                {errors.paymentMethod.message}
              </span>
            )}
          </div>

          {/* Dynamic Payment Fields */}
          {renderPaymentDetails()}

          {/* Security Notice */}
          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700 flex items-center gap-2">
              <span>🔒</span>
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
              className="flex-1 px-4 py-3 bg-primary-green text-white rounded-lg hover:bg-dark-accent transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <span className="animate-spin">⏳</span>
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
  );
};

export default PaymentModal;
