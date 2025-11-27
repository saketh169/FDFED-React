import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';


const SubscriptionDashboard = () => {
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth('user');
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/role');
      return;
    }

    const fetchSubscriptionData = async () => {
      try {
        // Fetch active subscription
        const subResponse = await axios.get('/api/payments/subscription/active', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (subResponse.data.success && subResponse.data.hasActiveSubscription) {
          setSubscription(subResponse.data.subscription);
        }

        // Fetch payment history
        const historyResponse = await axios.get('/api/payments/history?limit=5', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (historyResponse.data.success) {
          setPaymentHistory(historyResponse.data.payments || []);
        }
      } catch (error) {
        console.error('Error fetching subscription data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [token, isAuthenticated, navigate]);

  const handleCancelSubscription = async () => {
    setCancelling(true);
    try {
      const response = await axios.post(
        '/api/payments/subscription/cancel',
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        alert('Subscription cancelled successfully');
        setSubscription(null);
        setShowCancelModal(false);
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      alert(error.response?.data?.message || 'Failed to cancel subscription');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4" style={{ borderColor: '#27AE60' }}></div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, #f0fdf4, #ffffff)' }}>
        <div className="pt-18 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl font-bold" style={{ color: '#1A4A40' }}>
                My Subscription
              </h1>
              <button
                onClick={() => navigate('/user/pricing')}
                className="px-6 py-3 rounded-lg font-semibold text-white transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                style={{ backgroundColor: '#27AE60' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#1A4A40'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#27AE60'}
              >
                <i className="fas fa-chevron-left"></i>
                Back to Pricing
              </button>
            </div>

            {/* Active Subscription */}
            {subscription ? (
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-t-4" style={{ borderColor: '#27AE60' }}>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2" style={{ color: '#1A4A40' }}>
                      Active Subscription
                    </h2>
                    <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: '#27AE60', color: 'white' }}>
                      <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Active
                    </div>
                  </div>
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                  >
                    Cancel Subscription
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Plan Type</p>
                    <p className="text-xl font-bold capitalize" style={{ color: '#1A4A40' }}>
                      {subscription.planType} Plan
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Billing Cycle</p>
                    <p className="text-xl font-bold capitalize" style={{ color: '#1A4A40' }}>
                      {subscription.billingCycle}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Start Date</p>
                    <p className="text-lg font-semibold" style={{ color: '#2F4F4F' }}>
                      {new Date(subscription.subscriptionStartDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">End Date</p>
                    <p className="text-lg font-semibold" style={{ color: '#2F4F4F' }}>
                      {new Date(subscription.subscriptionEndDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Plan Features */}
                {subscription.features && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="text-lg font-bold mb-4" style={{ color: '#1A4A40' }}>
                      Your Benefits
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center p-3 bg-green-50 rounded-lg">
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#27AE60' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm" style={{ color: '#2F4F4F' }}>
                          {subscription.features?.monthlyBookings === -1 
                            ? 'Unlimited Consultations' 
                            : `${subscription.features?.monthlyBookings || 0} Consultations/Month`}
                        </span>
                      </div>
                      <div className="flex items-center p-3 bg-green-50 rounded-lg">
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#27AE60' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm" style={{ color: '#2F4F4F' }}>
                          Book {subscription.features?.advanceBookingDays || 0} days ahead
                        </span>
                      </div>
                      <div className="flex items-center p-3 bg-green-50 rounded-lg">
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#27AE60' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm" style={{ color: '#2F4F4F' }}>
                          {subscription.features?.monthlyMealPlans === -1 
                            ? 'Unlimited User Daily Progress Plans' 
                            : `${subscription.features?.monthlyMealPlans || 0} User Daily Progress Plans/Month`}
                        </span>
                      </div>
                      <div className="flex items-center p-3 bg-green-50 rounded-lg">
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#27AE60' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm" style={{ color: '#2F4F4F' }}>
                          {subscription.features?.chatbotDailyQueries === -1 
                            ? 'Unlimited Chatbot' 
                            : `${subscription.features?.chatbotDailyQueries || 0} Chatbot/Day`}
                        </span>
                      </div>
                      <div className="flex items-center p-3 bg-green-50 rounded-lg">
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#27AE60' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm" style={{ color: '#2F4F4F' }}>
                          {subscription.features?.monthlyBlogPosts === -1 
                            ? 'Unlimited Blogs' 
                            : `${subscription.features?.monthlyBlogPosts || 0} Blogs/Month`}
                        </span>
                      </div>
                      <div className="flex items-center p-3 bg-green-50 rounded-lg">
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#27AE60' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm" style={{ color: '#2F4F4F' }}>Unlimited Chat & Video</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 text-center">
                <div className="mb-4">
                  <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: '#1A4A40' }}>
                  No Active Subscription
                </h2>
                <p className="text-gray-600 mb-6">
                  Subscribe to unlock premium features and benefits
                </p>
                <button
                  onClick={() => navigate('/user/pricing')}
                  className="px-8 py-3 rounded-lg font-semibold text-white transition-all"
                  style={{ backgroundColor: '#27AE60' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#1A4A40'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#27AE60'}
                >
                  View Plans
                </button>
              </div>
            )}

            {/* Payment History */}
            {paymentHistory.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold mb-6" style={{ color: '#1A4A40' }}>
                  Payment History
                </h2>
                <div className="space-y-4">
                  {paymentHistory.map((payment) => (
                    <div
                      key={payment.transactionId}
                      className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <p className="font-semibold" style={{ color: '#1A4A40' }}>
                          {payment.planType.charAt(0).toUpperCase() + payment.planType.slice(1)} Plan
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(payment.createdAt).toLocaleDateString()} • {payment.transactionId}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold" style={{ color: '#27AE60' }}>
                          ₹{payment.amount}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            payment.paymentStatus === 'success'
                              ? 'bg-green-100 text-green-600'
                              : payment.paymentStatus === 'failed'
                              ? 'bg-red-100 text-red-600'
                              : 'bg-yellow-100 text-yellow-600'
                          }`}
                        >
                          {payment.paymentStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cancel Subscription Modal - Beautiful Transparent Overlay */}
            {showCancelModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Semi-transparent backdrop */}
                <div
                  className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                  onClick={() => !cancelling && setShowCancelModal(false)}
                ></div>

                {/* Modal Card */}
                <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-auto">
                  <h3 className="text-2xl font-bold mb-4" style={{ color: '#1A4A40' }}>
                    Cancel Subscription?
                  </h3>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    Are you sure you want to cancel your subscription? 
                    You will lose access to all premium features at the end of your current billing period.
                  </p>

                  <div className="flex gap-4">
                    <button
                      onClick={handleCancelSubscription}
                      disabled={cancelling}
                      className="flex-1 px-6 py-3 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
                    </button>
                    <button
                      onClick={() => setShowCancelModal(false)}
                      disabled={cancelling}
                      className="flex-1 px-6 py-3 rounded-xl font-semibold bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      style={{ color: '#2F4F4F' }}
                    >
                      Keep Subscription
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      
    </>
  );
};

export default SubscriptionDashboard;