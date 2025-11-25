import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const transactionId = searchParams.get('transactionId');
  const { token, isAuthenticated } = useAuth('user');
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/role');
      return;
    }

    if (!transactionId) {
      navigate('/user/home');
      return;
    }

    const fetchPaymentDetails = async () => {
      try {
        const response = await axios.get(
          `/api/payments/verify/${transactionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data.success) {
          setPaymentDetails(response.data.payment);
        }
      } catch (error) {
        console.error('Error fetching payment details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [transactionId, token, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4" style={{ borderColor: '#27AE60' }}></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center mb-8">
            <div className="mb-6">
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100">
                <svg
                  className="h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style={{ color: '#27AE60' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4" style={{ color: '#27AE60' }}>
              Payment Successful!
            </h1>
            <p className="text-xl mb-6" style={{ color: '#2F4F4F' }}>
              Thank you for your subscription
            </p>
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: '#27AE60', color: 'white' }}>
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Subscription Active
            </div>
          </div>

          {/* Payment Details */}
          {paymentDetails && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#1A4A40' }}>
                Payment Details
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Transaction ID</span>
                  <span className="font-semibold" style={{ color: '#1A4A40' }}>
                    {paymentDetails.transactionId}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Order ID</span>
                  <span className="font-semibold" style={{ color: '#1A4A40' }}>
                    {paymentDetails.orderId}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Plan</span>
                  <span className="font-semibold capitalize" style={{ color: '#1A4A40' }}>
                    {paymentDetails.planType} Plan
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Billing Cycle</span>
                  <span className="font-semibold capitalize" style={{ color: '#1A4A40' }}>
                    {paymentDetails.billingCycle}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Amount Paid</span>
                  <span className="font-bold text-2xl" style={{ color: '#27AE60' }}>
                    ₹{paymentDetails.amount}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Subscription Start Date</span>
                  <span className="font-semibold" style={{ color: '#1A4A40' }}>
                    {new Date(paymentDetails.subscriptionStartDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Subscription End Date</span>
                  <span className="font-semibold" style={{ color: '#1A4A40' }}>
                    {new Date(paymentDetails.subscriptionEndDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Plan Features */}
          {paymentDetails?.features && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#1A4A40' }}>
                Your Plan Features
              </h2>
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-green-50 rounded-lg">
                  <svg className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#27AE60' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span style={{ color: '#2F4F4F' }}>
                    {paymentDetails.features?.monthlyBookings === -1 
                      ? 'Unlimited Monthly Consultations' 
                      : `${paymentDetails.features?.monthlyBookings || 0} Consultations per Month`}
                  </span>
                </div>
                <div className="flex items-center p-4 bg-green-50 rounded-lg">
                  <svg className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#27AE60' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span style={{ color: '#2F4F4F' }}>
                    Book up to {paymentDetails.features?.advanceBookingDays || 0} days in advance
                  </span>
                </div>
                <div className="flex items-center p-4 bg-green-50 rounded-lg">
                  <svg className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#27AE60' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span style={{ color: '#2F4F4F' }}>
                    {paymentDetails.features?.monthlyMealPlans === -1 
                      ? 'Unlimited Meal Plans' 
                      : `${paymentDetails.features?.monthlyMealPlans || 0} Meal Plans per Month`}
                  </span>
                </div>
                <div className="flex items-center p-4 bg-green-50 rounded-lg">
                  <svg className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#27AE60' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span style={{ color: '#2F4F4F' }}>
                    {paymentDetails.features?.chatbotDailyQueries === -1 
                      ? 'Unlimited AI Chatbot Queries' 
                      : `${paymentDetails.features?.chatbotDailyQueries || 0} Chatbot Queries per Day`}
                  </span>
                </div>
                <div className="flex items-center p-4 bg-green-50 rounded-lg">
                  <svg className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#27AE60' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span style={{ color: '#2F4F4F' }}>
                    {paymentDetails.features?.monthlyBlogPosts === -1 
                      ? 'Unlimited Blog Posts' 
                      : `${paymentDetails.features?.monthlyBlogPosts || 0} Blog Posts per Month`}
                  </span>
                </div>
                <div className="flex items-center p-4 bg-green-50 rounded-lg">
                  <svg className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#27AE60' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span style={{ color: '#2F4F4F' }}>Unlimited Chat & Video Calls</span>
                </div>
                <div className="flex items-center p-4 bg-green-50 rounded-lg">
                  <svg className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#27AE60' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span style={{ color: '#2F4F4F' }}>
                    {paymentDetails.features?.supportLevel === '24/7' ? '24/7 Priority Support' : 
                     paymentDetails.features?.supportLevel === 'priority' ? 'Priority Email Support' : 'Email Support'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/user/home')}
              className="px-8 py-4 rounded-xl font-semibold text-lg text-white transition-all shadow-lg hover:shadow-xl"
              style={{ backgroundColor: '#27AE60' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#1A4A40'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#27AE60'}
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => navigate('/user/profile')}
              className="px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
              style={{ backgroundColor: '#f3f4f6', color: '#2F4F4F' }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#e5e7eb';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#f3f4f6';
              }}
            >
              View Profile
            </button>
          </div>

          {/* Help Section */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 mb-2">
              Need help? Contact our support team
            </p>
            <button
              onClick={() => navigate('/user/contact-us')}
              className="text-sm font-semibold hover:underline"
              style={{ color: '#27AE60' }}
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default PaymentSuccess;
