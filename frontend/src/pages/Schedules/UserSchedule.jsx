import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import axios from 'axios';

// --- Theme Colors ---
const PRIMARY_GREEN = '#27AE60'; // Main green (matching home and dashboard pages)
const DARK_GREEN = '#1e8449';    // Secondary/Dark green
const ACCENT_GREEN = '#229954';  // Medium green
const WARNING_COLOR = '#81C784'; // Light green
const CARD_FOLLOWUP_COLOR = '#F44336'; // Red for follow-ups

// --- Helper Functions (Converted to JS for React use) ---

/**
 * Generates the next 7 days starting from today.
 * @returns {Object} Map of dayName (e.g., 'monday') to day information.
 */
const generateWeekDates = () => {
    const today = new Date();
    const weekDates = {};
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dayKey = days[date.getDay()].toLowerCase(); // Use day name as key for simple rendering
        const fullDateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD for matching backend data

        weekDates[dayKey] = {
            name: dayKey.charAt(0).toUpperCase() + dayKey.slice(1),
            fullDate: date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
            shortDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            dateObj: date,
            fullDateKey: fullDateKey,
        };
    }
    return weekDates;
};

/**
 * Converts time (e.g., "10:30 AM") to 24-hour minutes for sorting.
 */
const convertTimeTo24Hour = (time) => {
    if (!time) return 0;
    const [timePart, modifier] = time.split(' ');
    if (!timePart || !modifier) return 0;
    let [hours, minutes] = timePart.split(':').map(Number);

    if (hours === 12) {
        hours = 0;
    }

    if (modifier.toUpperCase() === 'PM') {
        hours += 12;
    }

    return hours * 100 + minutes + minutes; // Using minutes for precise sorting
};

// --- Mock Data Structure (Replace with props or API call in real app) ---
const MOCK_BOOKINGS = {
    '2025-11-04': [
        { time: '10:00 AM', consultationType: 'Consultation', specialization: 'Weight Loss', dietitianName: 'Dr. Jane Doe', profileImage: null },
        { time: '02:30 PM', consultationType: 'Followup', specialization: 'Diabetes Management', dietitianName: 'Dr. Alex Smith', profileImage: 'https://via.placeholder.com/30/1E6F5C/ffffff' },
    ],
    '2025-11-05': [
        { time: '11:00 AM', consultationType: 'Group', specialization: 'Gut Health Workshop', dietitianName: 'Nutri Team', profileImage: null },
    ],
    // The date keys must match the YYYY-MM-DD format from generateWeekDates().fullDateKey
};


const UserSchedule = () => {
    const navigate = useNavigate();
    const { user, token } = useAuthContext();
    
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const weekDates = useMemo(() => generateWeekDates(), []);
    const sortedDays = useMemo(() => Object.entries(weekDates).sort((a, b) => a[1].dateObj - b[1].dateObj), [weekDates]);

    const initialDay = sortedDays.find(([, dayInfo]) => dayInfo.dateObj.toDateString() === new Date().toDateString())?.[0] || sortedDays[0]?.[0];

    const [activeDayKey, setActiveDayKey] = useState(initialDay);
    const [searchDietitian, setSearchDietitian] = useState('');
    const [filterDate, setFilterDate] = useState('');

    // Fetch user bookings from API
    useEffect(() => {
        const fetchBookings = async () => {
            // Get userId from localStorage (same as used in BookingSidebar)
            const userId = localStorage.getItem('userId') || user?.id;
            
            if (!userId) {
                console.error('No user ID available');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                console.log('Fetching bookings for userId:', userId);
                
                const config = token ? {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                } : {};

                const response = await axios.get(`/api/bookings/user/${userId}`, config);
                
                console.log('Bookings API response:', response.data);
                
                if (response.data.success) {
                    console.log('Fetched bookings:', response.data.data);
                    setBookings(response.data.data);
                } else {
                    console.error('Failed to fetch bookings:', response.data.message);
                    setBookings([]);
                }
            } catch (error) {
                console.error('Error fetching bookings:', error);
                setBookings([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [user, token]);

    // Convert bookings array to bookingsByDay object
    const bookingsByDay = useMemo(() => {
        const grouped = {};
        bookings.forEach(booking => {
            // Fix timezone issue - parse date string directly for IST
            // The date comes from backend as YYYY-MM-DD, use it directly
            const dateKey = booking.date.split('T')[0];
            
            if (!grouped[dateKey]) {
                grouped[dateKey] = [];
            }
            grouped[dateKey].push({
                time: booking.time,
                consultationType: booking.consultationType,
                specialization: booking.dietitianSpecialization || 'General Consultation',
                dietitianName: booking.dietitianName,
                dietitianEmail: booking.dietitianEmail,
                dietitianPhone: booking.dietitianPhone,
                status: booking.status,
                bookingId: booking._id,
                amount: booking.amount,
                profileImage: null // Add if you have dietitian images
            });
        });
        return grouped;
    }, [bookings]);

    const activeDayInfo = weekDates[activeDayKey];

    // Sort appointments by time
    const sortedAppointments = useMemo(() => {
        const dayAppointments = bookingsByDay[activeDayInfo?.fullDateKey] || [];
        let filtered = [...dayAppointments];

        // Filter by dietitian name
        if (searchDietitian.trim()) {
            filtered = filtered.filter(apt => 
                apt.dietitianName.toLowerCase().includes(searchDietitian.toLowerCase())
            );
        }

        // Filter by date (only show if date matches current selected day)
        if (filterDate && activeDayInfo?.fullDateKey !== filterDate) {
            filtered = [];
        }

        return filtered.sort((a, b) => convertTimeTo24Hour(a.time) - convertTimeTo24Hour(b.time));
    }, [activeDayInfo, bookingsByDay, searchDietitian, filterDate]);

    const getDayIcon = (dayKey) => {
        switch(dayKey.toLowerCase()) {
            case 'sunday': return 'fa-bed';
            case 'monday': return 'fa-sun';
            case 'tuesday': return 'fa-cloud';
            case 'wednesday': return 'fa-umbrella';
            case 'thursday': return 'fa-cloud-sun';
            case 'friday': return 'fa-moon';
            case 'saturday': return 'fa-star';
            default: return 'fa-calendar';
        }
    };

    const getCardColor = (type) => {
        switch(type.toLowerCase()) {
            case 'workshop': return `border-l-[4px] border-[${WARNING_COLOR}]`;
            case 'consultation': return `border-l-[4px] border-[${PRIMARY_GREEN}]`;
            case 'group': return `border-l-[4px] border-[${ACCENT_GREEN}]`;
            case 'followup': return `border-l-[4px] border-[${CARD_FOLLOWUP_COLOR}]`;
            default: return 'border-l-[4px] border-gray-300';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Loading State */}
            {loading && (
                <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
                    <div className="text-center">
                        <i className="fas fa-spinner fa-spin text-4xl text-emerald-600 mb-4"></i>
                        <p className="text-gray-600">Loading your appointments...</p>
                    </div>
                </div>
            )}
            
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="fixed top-4 left-4 text-white text-2xl w-10 h-10 flex items-center justify-center rounded-full bg-opacity-20 transition-all duration-300 hover:scale-110 hover:bg-opacity-30 z-50"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                aria-label="Go back"
            >
                <i className="fa-solid fa-arrow-left"></i>
            </button>

            {/* Filter Section */}
            <section className="bg-white border border-[#27AE60] px-4 py-2 shadow-sm sticky top-0 z-40" style={{ width: '80%', marginLeft: 0 }}>
                <div className="flex flex-col md:flex-row gap-2 items-end">
                    <div className="flex-1 min-w-0">
                        <label className="block text-xs font-semibold text-[#27AE60] mb-1 uppercase tracking-wide">Search Dietitian</label>
                        <input
                            type="text"
                            placeholder="Dietitian name..."
                            value={searchDietitian}
                            onChange={(e) => setSearchDietitian(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 focus:outline-none focus:border-[#27AE60] focus:ring-1 focus:ring-[#27AE60] transition-all duration-300 bg-gray-50"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <label className="block text-xs font-semibold text-[#27AE60] mb-1 uppercase tracking-wide">Date</label>
                        <input
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 focus:outline-none focus:border-[#27AE60] focus:ring-1 focus:ring-[#27AE60] transition-all duration-300 bg-gray-50"
                        />
                    </div>
                    {(searchDietitian || filterDate) && (
                        <button
                            onClick={() => {
                                setSearchDietitian('');
                                setFilterDate('');
                            }}
                            className="px-3 py-1.5 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 font-semibold"
                        >
                            ✕ Clear
                        </button>
                    )}
                </div>
            </section>
            
            <div className="flex flex-1 w-full">
                {/* Sidebar - Day List */}
                <aside className="sidebar sticky  w-[260px] bg-white shadow-lg h-[calc(100vh-60px)] overflow-y-auto p-3 mt-4 border-r-2 border-[#27AE60] rounded-tr-xl rounded-br-xl">
                    <div className="flex items-center gap-2 mb-3">
                        <i className="fas fa-calendar-days text-[#27AE60] text-base"></i>
                        <h3 className="text-base font-bold text-[#27AE60]">Next 7 Days</h3>
                    </div>
                    <div className="border-t border-[#27AE60] mb-3"></div>
                    {sortedDays.map(([key, dayInfo]) => (
                        <div
                            key={key}
                            className={`day p-2.5 my-1.5 cursor-pointer rounded-lg transition-all duration-300 flex items-center gap-2 transform hover:scale-102 ${activeDayKey === key ? 'active shadow-sm' : 'hover:shadow-sm'}`}
                            onClick={() => setActiveDayKey(key)}
                            style={{
                                color: activeDayKey === key ? PRIMARY_GREEN : '#555',
                                backgroundColor: activeDayKey === key ? '#e8f7e8' : 'white',
                                borderLeft: activeDayKey === key ? `3px solid ${PRIMARY_GREEN}` : '1px solid #e0e0e0',
                            }}
                        >
                            <i className={`fas ${getDayIcon(key)} text-base w-5 text-center shrink-0`}></i>
                            <div className="flex-1 min-w-0">
                                <div className="font-semibold text-sm">{dayInfo.name}</div>
                                <div className="text-xs text-gray-500">{dayInfo.shortDate}</div>
                            </div>
                        </div>
                    ))}
                </aside>

                {/* Content - Appointments */}
                <main className="flex-1 p-4 bg-gray-50">
                    {activeDayInfo && (
                        <div className="day-header flex justify-between items-center mb-4 pb-2 border-b border-[#27AE60]">
                            <div>
                                <h2 className="text-3xl font-bold" style={{ color: PRIMARY_GREEN }}>
                                    {activeDayInfo.name}
                                </h2>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    <i className="fas fa-calendar-alt mr-1"></i>{activeDayInfo.fullDate}
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="inline-block bg-[#27AE60] text-white px-3 py-1 rounded text-sm font-semibold">
                                    {sortedAppointments.length} {sortedAppointments.length === 1 ? 'Appointment' : 'Appointments'}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="appointments-container grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
                        {sortedAppointments.length === 0 ? (
                            <div className="no-appointments lg:col-span-3 bg-white rounded-lg shadow p-6 mt-2 text-center border border-dashed border-gray-300">
                                <i className="fas fa-calendar-check fa-3x mb-2" style={{ color: '#D0D0D0' }}></i>
                                <h4 className="text-lg font-bold text-gray-600 mb-1">No Appointments</h4>
                                <p className="text-gray-500 text-xs">Clear schedule for this day!</p>
                            </div>
                        ) : (
                            sortedAppointments.map((appointment, index) => (
                                <div
                                    key={index}
                                    className={`appointment-card bg-white rounded-lg shadow p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 border-t-2 transform ${getCardColor(appointment.consultationType)}`}
                                >
                                    <div className="appointment-time text-sm text-gray-500 mb-2 flex items-center gap-1">
                                        <i className="fas fa-clock text-[#27AE60] text-sm"></i>
                                        <span className="font-bold text-gray-800">{appointment.time || 'N/A'}</span>
                                        <span className={`px-2 py-0.5 ml-auto text-xs font-bold rounded uppercase tracking-tight whitespace-nowrap ${
                                            appointment.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                                            appointment.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                            appointment.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                            {appointment.status || appointment.consultationType}
                                        </span>
                                    </div>
                                    <h3 className="appointment-title text-base font-bold text-gray-800 mb-1">
                                        {appointment.specialization}
                                    </h3>
                                    <p className="appointment-details text-sm text-gray-600 mb-2 flex items-center gap-1">
                                        <i className="fas fa-stethoscope text-[#27AE60] opacity-70 text-xs"></i>
                                        {appointment.consultationType}
                                    </p>

                                    <div className="nutritionist-info flex items-center gap-2 mt-3 pt-2 border-t border-gray-100">
                                        {appointment.profileImage ? (
                                            <img
                                                src={appointment.profileImage}
                                                alt={appointment.dietitianName}
                                                className="w-7 h-7 rounded-full object-cover shadow border border-[#27AE60]"
                                            />
                                        ) : (
                                            <div
                                                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow border border-[#27AE60]"
                                                style={{ backgroundColor: PRIMARY_GREEN }}
                                            >
                                                {appointment.dietitianName.charAt(0)}
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <span className="nutritionist-name text-sm font-semibold text-gray-800 truncate block">
                                                {appointment.dietitianName}
                                            </span>
                                            {appointment.dietitianEmail && (
                                                <a 
                                                    href={`mailto:${appointment.dietitianEmail}`}
                                                    className="text-xs text-emerald-600 hover:underline truncate block"
                                                    title={appointment.dietitianEmail}
                                                >
                                                    <i className="fas fa-envelope mr-1"></i>
                                                    Contact
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {appointment.amount && (
                                        <div className="mt-2 pt-2 border-t border-gray-100">
                                            <span className="text-xs text-gray-600">
                                                <i className="fas fa-rupee-sign mr-1 text-emerald-600"></i>
                                                Fee: <span className="font-semibold text-gray-800">₹{appointment.amount}</span>
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default UserSchedule;