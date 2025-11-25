import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchUserStats,
  fetchMembershipRevenue,
  fetchConsultationRevenue,
  fetchSubscriptions,
  setExpandedSubscriptionId,
} from '../../redux/slices/analyticsSlice';

// --- Constants ---
const THEME = {
  primary: '#27AE60',      // Primary green
  secondary: '#1E6F5C',    // Darker green
  light: '#E8F5E9',        // Light green background
  lightBg: '#F0F9F7',      // Very light green
  success: '#27AE60',      // Success green
  danger: '#DC3545',       // Red for errors
  warning: '#FFC107',      // Yellow for warning
  info: '#17A2B8',         // Blue for info
  dark: '#1A4A40',         // Dark gray
  lightGray: '#F8F9FA',    // Light gray background
  borderColor: '#E0E0E0',  // Border color
};// --- Dashboard Component ---

const Analytics = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Get data from Redux state
    const {
        userStats,
        membershipRevenue,
        consultationRevenue,
        subscriptions,
        expandedSubscriptionId,
        isLoading,
        error: errorMessage
    } = useSelector(state => state.analytics);

    const toggleDetails = (id) => {
        dispatch(setExpandedSubscriptionId(expandedSubscriptionId === id ? null : id));
    };

    useEffect(() => {
        // Dispatch all analytics data fetching actions
        dispatch(fetchUserStats());
        dispatch(fetchMembershipRevenue());
        dispatch(fetchConsultationRevenue());
        dispatch(fetchSubscriptions());
    }, [dispatch]);
    
    // --- Aggregated Totals ---
    const dailyConsultationTotal = consultationRevenue.dailyPeriods.reduce((sum, p) => sum + p.revenue, 0);
    const monthlyConsultationTotal = consultationRevenue.monthlyPeriods.reduce((sum, p) => sum + p.revenue, 0);
    const yearlyConsultationTotal = consultationRevenue.yearlyPeriods.reduce((sum, p) => sum + p.revenue, 0);

    const totalRevenue = membershipRevenue.yearly + yearlyConsultationTotal;
    const totalMonthlyRevenue = membershipRevenue.monthly + monthlyConsultationTotal;
    const totalYearlyRevenue = membershipRevenue.yearly + yearlyConsultationTotal;


    // --- UI Renderers ---
    
    const RevenueTable = ({ data, periodKey, total }) => (
        <table className="min-w-full divide-y divide-gray-200 shadow-md rounded-lg overflow-hidden border-collapse">
            <thead style={{ backgroundColor: THEME.primary }} className="text-white">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">{periodKey}</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">Revenue</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item, index) => (
                    <tr key={`revenue-${periodKey}-${index}`} className="hover:bg-green-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item[periodKey]}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">₹{item.revenue.toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
            <tfoot className="bg-gray-50">
                <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Total</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">₹{total.toFixed(2)}</td>
                </tr>
            </tfoot>
        </table>
    );

    const renderSubscriptionTable = () => (
        <table className="min-w-full divide-y divide-gray-200 shadow-md rounded-lg overflow-hidden border-collapse">
            <thead style={{ backgroundColor: THEME.primary }} className="text-white">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Start Date</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider w-48">Actions</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {subscriptions.map((sub, index) => (
                    <React.Fragment key={`subscription-${sub.id}-${index}`}>
                        <tr className="hover:bg-green-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sub.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sub.startDate}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                <button 
                                    style={{
                                        backgroundColor: expandedSubscriptionId === sub.id ? '#6B7280' : THEME.primary,
                                        color: 'white',
                                        padding: '0.5rem 0.75rem',
                                        borderRadius: '9999px',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => { if (expandedSubscriptionId !== sub.id) e.target.style.backgroundColor = THEME.secondary; }}
                                    onMouseLeave={(e) => { if (expandedSubscriptionId !== sub.id) e.target.style.backgroundColor = THEME.primary; }}
                                    onClick={() => toggleDetails(sub.id)}
                                >
                                    <i className="fas fa-eye mr-2"></i> 
                                    {expandedSubscriptionId === sub.id ? 'Hide Details' : 'View Details'}
                                </button>
                            </td>
                        </tr>
                        {expandedSubscriptionId === sub.id && (
                            <tr key={`expanded-${sub.id}`}>
                                <td colSpan="3" className="px-6 py-0">
                                    <div className="bg-gray-50 p-4 border-l-4 border-green-500">
                                        <p><strong>Plan:</strong> {sub.plan} ({sub.cycle})</p>
                                        <p><strong>Revenue Generated:</strong> ₹{sub.revenue.toFixed(2)}</p>
                                        <p><strong>Mode of Payment:</strong> {sub.paymentMethod}</p>
                                        <p><strong>Expire Date:</strong> {sub.expiresAt}</p>
                                        <p><strong>Transaction ID:</strong> {sub.transactionId}</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}
            </tbody>
        </table>
    );

    return (
        <div className="min-h-screen p-2 sm:p-4 bg-green-50" style={{ paddingTop: '0.5rem' }}>
            {/* Back Button */}
            <div onClick={() => navigate(-1)} style={{ color: THEME.primary, cursor: 'pointer' }} className="fixed top-4 left-4 text-4xl hover:opacity-80 transition-opacity z-50" onMouseEnter={(e) => e.currentTarget.style.color = THEME.secondary} onMouseLeave={(e) => e.currentTarget.style.color = THEME.primary}>
                <i className="fa-solid fa-xmark"></i>
            </div>

            <div className="max-w-7xl mx-auto">
                {/* Logo and Title */}
                <div className="flex justify-center items-center my-2">
                    <div className="flex items-center font-bold text-3xl text-gray-800">
                        <div style={{ backgroundColor: THEME.primary }} className="flex items-center justify-center w-10 h-10 rounded-full mr-2">
                            <i className="fas fa-leaf text-xl text-white"></i>
                        </div>
                        <span>
                            <span style={{ color: THEME.primary }}>N</span>utri
                            <span style={{ color: THEME.primary }}>C</span>onnect
                        </span>
                    </div>
                </div>
                <h1 style={{ color: THEME.primary }} className="text-4xl font-extrabold text-center mb-4">Analytics Dashboard</h1>
                
                {/* Loading Indicator */}
                {isLoading && (
                    <div className="bg-blue-100 text-blue-700 p-3 rounded-lg text-center mb-6">
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Loading analytics data...
                    </div>
                )}
                
                {/* Error Message */}
                {errorMessage && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-lg text-center mb-6">{errorMessage}</div>
                )}

                <div className="grid grid-cols-1 gap-6">
                    {/* --- Card 1: Revenue from Memberships --- */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border-b-4 border-green-500 hover:shadow-2xl transition-all duration-300">
                        <h2 style={{ color: THEME.primary }} className="text-xl font-bold mb-4">
                            <i style={{ color: THEME.primary }} className="fas fa-chart-line mr-2"></i> Revenue from Memberships
                        </h2>
                        <div className="revenue-table">
                            <table className="min-w-full divide-y divide-gray-200 shadow-md rounded-lg overflow-hidden border-collapse">
                                <thead style={{ backgroundColor: THEME.primary }} className="text-white">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Period</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">Revenue</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    <tr className="hover:bg-green-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Daily (Today)</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">₹{membershipRevenue.daily.toFixed(2)}</td>
                                    </tr>
                                    <tr className="hover:bg-green-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Monthly (This Month)</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">₹{membershipRevenue.monthly.toFixed(2)}</td>
                                    </tr>
                                    <tr className="hover:bg-green-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Yearly (This Year)</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">₹{membershipRevenue.yearly.toFixed(2)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* --- Card 2: User Statistics --- */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border-b-4 border-green-500 hover:shadow-2xl transition-all duration-300">
                        <h2 style={{ color: THEME.primary }} className="text-xl font-bold mb-4">
                            <i style={{ color: THEME.primary }} className="fas fa-users mr-2"></i> User Statistics
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <table className="min-w-full divide-y divide-gray-200 shadow-md rounded-lg overflow-hidden border-collapse">
                                <thead style={{ backgroundColor: THEME.primary }} className="text-white">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Metric</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">Count</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    <tr className="hover:bg-green-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Total Registered</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{userStats.totalRegistered}</td>
                                    </tr>
                                    <tr className="hover:bg-green-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Active Clients</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{userStats.totalUsers}</td>
                                    </tr>
                                    <tr className="hover:bg-green-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Active Dietitians</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{userStats.totalDietitians}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <table className="min-w-full divide-y divide-gray-200 shadow-md rounded-lg overflow-hidden border-collapse">
                                <thead style={{ backgroundColor: THEME.primary }} className="text-white">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Metric</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">Count</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    <tr className="hover:bg-green-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Verifying Organizations</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{userStats.totalOrganizations}</td>
                                    </tr>
                                    <tr className="hover:bg-green-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Corporate Partners</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{userStats.totalCorporatePartners}</td>
                                    </tr>
                                    <tr className="hover:bg-green-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Active Diet Plans</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{userStats.activeDietPlans}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* --- Card 3: Revenue from Consultations (Full Width) --- */}
                <div className="bg-white p-6 rounded-xl shadow-lg border-b-4 border-green-500 hover:shadow-2xl transition-all duration-300 mt-6">
                    <h2 style={{ color: THEME.primary }} className="text-xl font-bold mb-4">
                        <i style={{ color: THEME.primary }} className="fas fa-stethoscope mr-2"></i> Revenue from Consultations (Admin Fee Share)
                    </h2>
                    
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <h4 className="text-lg font-semibold mb-2">Daily Revenue (Last 7 Days)</h4>
                            <RevenueTable data={consultationRevenue.dailyPeriods} periodKey="displayDate" total={dailyConsultationTotal} />
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-2">Monthly Revenue (Last 6 Months)</h4>
                            <RevenueTable data={consultationRevenue.monthlyPeriods} periodKey="month" total={monthlyConsultationTotal} />
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-2">Yearly Revenue (Last 4 Years)</h4>
                            <RevenueTable data={consultationRevenue.yearlyPeriods} periodKey="year" total={yearlyConsultationTotal} />
                        </div>
                    </div>
                </div>

                {/* --- Card 4: Total Revenue Summary (Full Width) --- */}
                <div className="bg-white p-6 rounded-xl shadow-lg border-b-4 border-green-500 hover:shadow-2xl transition-all duration-300 mt-6">
                    <h2 className={`text-xl font-bold text-gray-700 mb-4`}>
                        <i className={`fas fa-chart-bar text-gray-700 mr-2`}></i> Total Platform Revenue Summary (Membership + Consultation Fee)
                    </h2>
                    <div className="revenue-table">
                        <table className="min-w-full divide-y divide-gray-200 shadow-md rounded-lg overflow-hidden border-collapse">
                            <thead style={{ backgroundColor: THEME.primary }} className="text-white">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Period</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">Revenue</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                <tr className="hover:bg-green-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Total (Lifetime/Yearly Basis)</td>
                                    <td className="px-6 py-4 whitespace-nowrap  font-bold text-sm text-gray-900 text-right">₹{totalRevenue.toFixed(2)}</td>
                                </tr>
                                <tr className="hover:bg-green-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Monthly (Avg./Current)</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">₹{totalMonthlyRevenue.toFixed(2)}</td>
                                </tr>
                                <tr className="hover:bg-green-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Yearly (Current)</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">₹{totalYearlyRevenue.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* --- Card 5: Subscriptions Detail Table (Full Width) --- */}
                <div className="bg-white p-6 rounded-xl shadow-lg border-b-4 border-green-500 hover:shadow-2xl transition-all duration-300 mt-6 mb-8">
                    <h2 className={`text-xl font-bold text-gray-700 mb-4`}>
                        <i className={`fas fa-list-alt text-gray-700 mr-2`}></i> Users and Their Subscription Plans
                    </h2>
                    <div className="overflow-x-auto">
                        {renderSubscriptionTable()}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Analytics;
