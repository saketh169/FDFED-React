import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// --- Constants ---
const PRIMARY_GREEN = '#28a745';
const DARK_GREEN = '#218838';
const RED = '#dc3545';

// --- Data Fetching Functions ---

const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) return 'N/A';
        return parsedDate.toISOString().split('T')[0];
    } catch {
        return 'N/A';
    }
};

const formatDisplayDate = (date) => {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const formatDisplayMonth = (date) => {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
};

const getDateRanges = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailyDates = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dailyDates.push({
            date: formatDate(date),
            displayDate: formatDisplayDate(date)
        });
    }

    const monthlyPeriods = [];
    for (let i = 0; i < 6; i++) {
        const date = new Date(today);
        date.setMonth(today.getMonth() - i);
        date.setDate(1);
        monthlyPeriods.push({
            start: formatDate(date),
            displayMonth: formatDisplayMonth(date),
            year: date.getFullYear(),
            month: date.getMonth() + 1
        });
    }

    const yearlyPeriods = [];
    for (let i = 0; i < 4; i++) {
        const year = today.getFullYear() - i;
        yearlyPeriods.push({
            year,
            start: `${year}-01-01`,
            end: `${year}-12-31`
        });
    }

    return { dailyDates, monthlyPeriods, yearlyPeriods };
};

// Simplified fetch utility using axios
const fetchAPI = async (url) => {
    try {
        // Authorization token would be included here: 
        // headers: { Authorization: `Bearer ${localStorage.getItem('adminAuthToken')}` }
        const response = await axios.get(url, { withCredentials: true });
        
        // Assuming API returns { data: [...] } or just [...]
        return response.data.data || response.data; 
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'Network Error';
        if (error.response?.status === 401) {
            console.error('Unauthorized access. Redirecting.');
            // Implement navigation to login page here in a real app
        }
        throw new Error(message);
    }
};

// --- Dashboard Component ---

const Analytics = () => {
    const navigate = useNavigate();
    const [membershipRevenue, setMembershipRevenue] = useState({ daily: 0, monthly: 0, yearly: 0 });
    const [userStats, setUserStats] = useState({ totalRegistered: 0, totalUsers: 0, totalDietitians: 0, verifyingOrganizations: 0, activeDietPlans: 0 });
    const [consultationRevenue, setConsultationRevenue] = useState({ dailyPeriods: [], monthlyPeriods: [], yearlyPeriods: [] });
    const [subscriptions, setSubscriptions] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [expandedSubscriptionId, setExpandedSubscriptionId] = useState(null);

    const toggleDetails = (id) => {
        setExpandedSubscriptionId(expandedSubscriptionId === id ? null : id);
    };

    const runAnalytics = async () => {
        setErrorMessage(null);
        try {
            const [usersRes, dietitiansRes, organizationsRes, dietPlansRes, subscriptionsRes, consultationRes] = await Promise.all([
                fetchAPI('/users-list'),
                fetchAPI('/dietitian-list'),
                fetchAPI('/verifying-organizations'),
                fetchAPI('/active-diet-plans'),
                fetchAPI('/subscriptions'),
                fetchAPI('/consultation-revenue')
            ]);
            
            // --- 1. User Statistics ---
            const totalRegistered = (usersRes.length || 0) + (dietitiansRes.length || 0);
            setUserStats({
                totalRegistered,
                totalUsers: usersRes.length || 0,
                totalDietitians: dietitiansRes.length || 0,
                verifyingOrganizations: organizationsRes.length || 0, // Assuming this endpoint returns an array
                activeDietPlans: dietPlansRes.length || 0, // Assuming this endpoint returns an array
            });

            // --- 2. Membership Revenue Calculation ---
            const validSubscriptions = subscriptionsRes.filter(sub => sub.status === 'success' && sub.amount > 0);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const dailyRevenue = validSubscriptions
                .filter(sub => new Date(sub.createdAt).setHours(0,0,0,0) === today.getTime())
                .reduce((sum, sub) => sum + sub.amount, 0);

            const monthlyRevenue = validSubscriptions
                .filter(sub => new Date(sub.createdAt).getMonth() === today.getMonth() && new Date(sub.createdAt).getFullYear() === today.getFullYear())
                .reduce((sum, sub) => sum + sub.amount, 0);

            const yearlyRevenue = validSubscriptions
                .filter(sub => new Date(sub.createdAt).getFullYear() === today.getFullYear())
                .reduce((sum, sub) => sum + sub.amount, 0);

            setMembershipRevenue({ daily: dailyRevenue, monthly: monthlyRevenue, yearly: yearlyRevenue });
            
            // --- 3. Consultation Revenue Calculation ---
            const adminFeePercentage = 0.2;
            const { dailyDates, monthlyPeriods, yearlyPeriods } = getDateRanges();
            
            // Daily Consultation Revenue
            const dailyConsultationRevenue = dailyDates.map(day => {
                const revenue = consultationRes
                    .filter(con => formatDate(con.date) === day.date)
                    .reduce((sum, con) => sum + (con.amount * adminFeePercentage), 0);
                return { ...day, revenue };
            }).reverse();

            // Monthly Consultation Revenue
            const monthlyConsultationRevenue = monthlyPeriods.map(period => {
                const revenue = consultationRes
                    .filter(con => {
                        const conDate = new Date(con.date);
                        return conDate.getFullYear() === period.year && conDate.getMonth() === period.month - 1;
                    })
                    .reduce((sum, con) => sum + (con.amount * adminFeePercentage), 0);
                return { month: period.displayMonth, revenue };
            }).reverse();

            // Yearly Consultation Revenue
            const yearlyConsultationRevenue = yearlyPeriods.map(period => {
                const revenue = consultationRes
                    .filter(con => new Date(con.date).getFullYear() === period.year)
                    .reduce((sum, con) => sum + (con.amount * adminFeePercentage), 0);
                return { year: period.year, revenue };
            }).reverse();
            
            setConsultationRevenue({ 
                dailyPeriods: dailyConsultationRevenue, 
                monthlyPeriods: monthlyConsultationRevenue, 
                yearlyPeriods: yearlyConsultationRevenue 
            });

            // --- 4. Subscriptions Table Data ---
            const formattedSubscriptions = subscriptionsRes.filter(sub => sub.userId && sub.userId.name).map(sub => ({
                id: sub._id,
                name: sub.userId.name || 'Unknown',
                plan: sub.name || 'N/A',
                cycle: sub.billingType || 'N/A',
                startDate: formatDate(sub.createdAt),
                revenue: sub.amount || 0,
                paymentMethod: sub.paymentMethod || 'N/A',
                transactionId: sub.transactionId || 'N/A',
                expiresAt: formatDate(sub.expiresAt)
            }));
            setSubscriptions(formattedSubscriptions);


        } catch (error) {
            setErrorMessage(error.message);
            console.error('Initialization Error:', error);
        }
    };

    useEffect(() => {
        runAnalytics();
    }, []);
    
    // --- Aggregated Totals ---
    const dailyConsultationTotal = consultationRevenue.dailyPeriods.reduce((sum, p) => sum + p.revenue, 0);
    const monthlyConsultationTotal = consultationRevenue.monthlyPeriods.reduce((sum, p) => sum + p.revenue, 0);
    const yearlyConsultationTotal = consultationRevenue.yearlyPeriods.reduce((sum, p) => sum + p.revenue, 0);

    const totalRevenue = membershipRevenue.yearly + yearlyConsultationTotal;
    const totalMonthlyRevenue = membershipRevenue.monthly + monthlyConsultationTotal;
    const totalYearlyRevenue = membershipRevenue.yearly + yearlyConsultationTotal;


    // --- UI Renderers ---
    
    const RevenueTable = ({ data, periodKey, total }) => (
        <table className="table min-w-full">
            <thead>
                <tr>
                    <th>{periodKey}</th>
                    <th className="text-right">Revenue</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item, index) => (
                    <tr key={index}>
                        <td>{item[periodKey]}</td>
                        <td className="text-right">₹{item.revenue.toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
            <tfoot>
                <tr>
                    <td>Total</td>
                    <td className="text-right">₹{total.toFixed(2)}</td>
                </tr>
            </tfoot>
        </table>
    );

    const renderSubscriptionTable = () => (
        <table className="table subscription-table min-w-full">
            <thead>
                <tr>
                    <th>Name</th>
                    <th className="w-1/4">Start Date</th>
                    <th className="w-1/5 text-center">Actions</th>
                </tr>
            </thead>
            <tbody id="usersTableBody">
                {subscriptions.map(sub => (
                    <React.Fragment key={sub.id}>
                        <tr className="hover:bg-gray-50 transition-colors">
                            <td>{sub.name}</td>
                            <td>{sub.startDate}</td>
                            <td className="text-end">
                                <button 
                                    style={{
                                        backgroundColor: expandedSubscriptionId === sub.id ? '#6B7280' : PRIMARY_GREEN,
                                        color: 'white',
                                        padding: '0.5rem 0.75rem',
                                        borderRadius: '9999px',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => { if (expandedSubscriptionId !== sub.id) e.target.style.backgroundColor = DARK_GREEN; }}
                                    onMouseLeave={(e) => { if (expandedSubscriptionId !== sub.id) e.target.style.backgroundColor = PRIMARY_GREEN; }}
                                    onClick={() => toggleDetails(sub.id)}
                                >
                                    <i className="fas fa-eye mr-2"></i> 
                                    {expandedSubscriptionId === sub.id ? 'Hide Details' : 'View Details'}
                                </button>
                            </td>
                        </tr>
                        {expandedSubscriptionId === sub.id && (
                            <tr>
                                <td colSpan="3" className="p-0">
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
        <div className="min-h-screen p-2 sm:p-4 bg-gray-100" style={{ paddingTop: '0.5rem' }}>
            {/* Back Button */}
            <div onClick={() => navigate(-1)} style={{ color: PRIMARY_GREEN, cursor: 'pointer' }} className="fixed top-4 left-4 text-4xl hover:opacity-80 transition-opacity z-50" onMouseEnter={(e) => e.currentTarget.style.color = DARK_GREEN} onMouseLeave={(e) => e.currentTarget.style.color = PRIMARY_GREEN}>
                <i className="fa-solid fa-xmark"></i>
            </div>

            <div className="max-w-7xl mx-auto">
                {/* Logo and Title */}
                <div className="flex justify-center items-center my-2">
                    <div className="flex items-center font-bold text-3xl text-gray-800">
                        <div style={{ backgroundColor: PRIMARY_GREEN }} className="flex items-center justify-center w-10 h-10 rounded-full mr-2">
                            <i className="fas fa-leaf text-xl text-white"></i>
                        </div>
                        <span>
                            <span style={{ color: PRIMARY_GREEN }}>N</span>utri
                            <span style={{ color: PRIMARY_GREEN }}>C</span>onnect
                        </span>
                    </div>
                </div>
                <h1 style={{ color: PRIMARY_GREEN }} className="text-4xl font-extrabold text-center mb-4">Analytics Dashboard</h1>
                
                {/* Error Message */}
                {errorMessage && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-lg text-center mb-6">{errorMessage}</div>
                )}

                <div className="grid grid-cols-1 gap-6">
                    {/* --- Card 1: Revenue from Memberships --- */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-green-500 hover:shadow-xl transition-all duration-300">
                        <h2 style={{ color: PRIMARY_GREEN }} className="text-xl font-bold mb-4">
                            <i style={{ color: PRIMARY_GREEN }} className="fas fa-chart-line mr-2"></i> Revenue from Memberships
                        </h2>
                        <div className="revenue-table">
                            <table className="table min-w-full">
                                <thead>
                                    <tr>
                                        <th>Period</th>
                                        <th className="text-right">Revenue</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Daily (Today)</td>
                                        <td className="text-right">₹{membershipRevenue.daily.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td>Monthly (This Month)</td>
                                        <td className="text-right">₹{membershipRevenue.monthly.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td>Yearly (This Year)</td>
                                        <td className="text-right">₹{membershipRevenue.yearly.toFixed(2)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* --- Card 2: User Statistics --- */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-green-500 hover:shadow-xl transition-all duration-300">
                        <h2 style={{ color: PRIMARY_GREEN }} className="text-xl font-bold mb-4">
                            <i style={{ color: PRIMARY_GREEN }} className="fas fa-users mr-2"></i> User Statistics
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <table className="table min-w-full">
                                <tbody>
                                    <tr><td>Total Registered</td><td className="text-right">{userStats.totalRegistered}</td></tr>
                                    <tr><td>Active Clients</td><td className="text-right">{userStats.totalUsers}</td></tr>
                                    <tr><td>Active Dietitians</td><td className="text-right">{userStats.totalDietitians}</td></tr>
                                </tbody>
                            </table>
                            <table className="table min-w-full">
                                <tbody>
                                    <tr><td>Organizations</td><td className="text-right">{userStats.verifyingOrganizations}</td></tr>
                                    <tr><td>Active Diet Plans</td><td className="text-right">{userStats.activeDietPlans}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* --- Card 3: Revenue from Consultations (Full Width) --- */}
                <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-green-500 hover:shadow-xl transition-all duration-300 mt-6">
                    <h2 style={{ color: PRIMARY_GREEN }} className="text-xl font-bold mb-4">
                        <i style={{ color: PRIMARY_GREEN }} className="fas fa-stethoscope mr-2"></i> Revenue from Consultations (Admin Fee Share)
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
                <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-green-500 hover:shadow-xl transition-all duration-300 mt-6">
                    <h2 className={`text-xl font-bold text-gray-700 mb-4`}>
                        <i className={`fas fa-chart-bar text-gray-700 mr-2`}></i> Total Platform Revenue Summary (Membership + Consultation Fee)
                    </h2>
                    <div className="revenue-table">
                        <table className="table min-w-full">
                            <thead>
                                <tr>
                                    <th>Period</th>
                                    <th className="text-right">Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Total (Lifetime/Yearly Basis)</td>
                                    <td className="text-right font-bold text-xl">₹{totalRevenue.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td>Monthly (Avg./Current)</td>
                                    <td className="text-right">₹{totalMonthlyRevenue.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td>Yearly (Current)</td>
                                    <td className="text-right">₹{totalYearlyRevenue.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* --- Card 5: Subscriptions Detail Table (Full Width) --- */}
                <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-green-500 hover:shadow-xl transition-all duration-300 mt-6 mb-8">
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
