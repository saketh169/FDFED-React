import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// --- Theme Colors ---
const PRIMARY_GREEN = '#27AE60'; // Main green
const DARK_GREEN = '#1e8449'; //Secondary/Dark green
const ACCENT_GREEN = '#229954'; // Medium green
const WARNING_COLOR = '#81C784'; // Light green
const CARD_FOLLOWUP_COLOR = '#F44336'; // Red for follow-ups

// --- Helper Functions (Re-used) ---

/**
 * Generates the next 7 days starting from today.
 */
const generateWeekDates = () => {
    const today = new Date();
    const weekDates = {};
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dayKey = days[date.getDay()].toLowerCase() + i; // Added 'i' for unique key per day
        const fullDateKey = date.toISOString().split('T')[0];

        weekDates[dayKey] = {
            name: dayKey.charAt(0).toUpperCase() + dayKey.slice(1).replace(/\d/g, ''), // Capitalize first letter and remove index
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

    if (hours === 12 && modifier.toUpperCase() === 'AM') {
        hours = 0;
    } else if (modifier.toUpperCase() === 'PM' && hours !== 12) {
        hours += 12;
    }

    return hours * 100 + minutes;
};

// --- DIETITIAN MOCK DATA (Shows Client/Patient Info) ---
const DIETITIAN_MOCK_BOOKINGS = {
    // Note: Date key must be YYYY-MM-DD format
    '2025-11-04': [
        { time: '10:00 AM', consultationType: 'Consultation', specialization: 'Weight Loss', clientName: 'Alice Johnson', profileImage: 'https://via.placeholder.com/30/1e8449/ffffff?text=AJ' },
        { time: '02:30 PM', consultationType: 'Followup', specialization: 'Diabetes Management', clientName: 'Robert Smith', profileImage: null },
    ],
    '2025-11-05': [
        { time: '09:00 AM', consultationType: 'Consultation', specialization: 'Sports Nutrition', clientName: 'Charlie Brown', profileImage: 'https://via.placeholder.com/30/f44336/ffffff?text=CB' },
        { time: '11:00 AM', consultationType: 'Group', specialization: 'Gut Health Workshop', clientName: 'Group Session', profileImage: null },
        { time: '04:00 PM', consultationType: 'Consultation', specialization: 'Pediatric Nutrition', clientName: 'Diana Prince', profileImage: null },
    ],
};


const DietitianSchedule = ({ bookingsByDay = DIETITIAN_MOCK_BOOKINGS }) => {
    const navigate = useNavigate();
    const weekDates = useMemo(() => generateWeekDates(), []);
    const sortedDays = useMemo(() => Object.entries(weekDates).sort((a, b) => a[1].dateObj - b[1].dateObj), [weekDates]);

    // Find today's day key for initial load
    const initialDay = sortedDays.find(([, dayInfo]) => dayInfo.dateObj.toDateString() === new Date().toDateString())?.[0] || sortedDays[0]?.[0];

    const [activeDayKey, setActiveDayKey] = useState(initialDay);
    // Filter State is now for clients
    const [searchClient, setSearchClient] = useState('');
    const [filterDate, setFilterDate] = useState('');

    const activeDayInfo = weekDates[activeDayKey];

    // Sort and Filter appointments
    const sortedAppointments = useMemo(() => {
        const dayAppointments = bookingsByDay[activeDayInfo?.fullDateKey] || [];
        let filtered = [...dayAppointments];

        // Filter by client name
        if (searchClient.trim()) {
            filtered = filtered.filter(apt => 
                apt.clientName.toLowerCase().includes(searchClient.toLowerCase())
            );
        }

        // Filter by date (only show if date matches current selected day)
        if (filterDate && activeDayInfo?.fullDateKey !== filterDate) {
            filtered = [];
        }

        return filtered.sort((a, b) => convertTimeTo24Hour(a.time) - convertTimeTo24Hour(b.time));
    }, [activeDayInfo, bookingsByDay, searchClient, filterDate]); // Dependency on searchClient

    // Re-use helper functions
    const getDayIcon = (dayKey) => {
        switch(dayKey.toLowerCase().replace(/\d/g, '')) {
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
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="fixed top-4 left-4 text-white text-2xl w-10 h-10 flex items-center justify-center rounded-full bg-opacity-20 transition-all duration-300 hover:scale-110 hover:bg-opacity-30 z-50"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                aria-label="Go back"
            >
                <i className="fa-solid fa-arrow-left"></i>
            </button>

            {/* Filter Section - Adjusted for Client Search */}
            <section className="bg-white border border-[#27AE60] px-4 py-2 shadow-sm sticky top-0 z-40" style={{ width: '80%', marginLeft: 0 }}>
                <div className="flex flex-col md:flex-row gap-2 items-end">
                    <div className="flex-1 min-w-0">
                        {/* LABEL CHANGE: Dietitian -> Client */}
                        <label className="block text-xs font-semibold text-[#27AE60] mb-1 uppercase tracking-wide">Search Client</label>
                        <input
                            type="text"
                            placeholder="Client name..."
                            value={searchClient}
                            onChange={(e) => setSearchClient(e.target.value)}
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
                    {(searchClient || filterDate) && (
                        <button
                            onClick={() => {
                                setSearchClient('');
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
                {/* Sidebar - Day List (No Change) */}
                <aside className="sidebar sticky w-[260px] bg-white shadow-lg h-[calc(100vh-60px)] overflow-y-auto p-3 mt-4 border-r-2 border-[#27AE60] rounded-tr-xl rounded-br-xl">
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
                            <i className={`fas ${getDayIcon(dayInfo.name)} text-base w-5 text-center shrink-0`}></i>
                            <div className="flex-1 min-w-0">
                                <div className="font-semibold text-sm">{dayInfo.name}</div>
                                <div className="text-xs text-gray-500">{dayInfo.shortDate}</div>
                            </div>
                        </div>
                    ))}
                </aside>

                {/* Content - Appointments (Client focused) */}
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
                                        <span className={`px-2 py-0.5 ml-auto text-xs font-bold rounded uppercase tracking-tight whitespace-nowrap ${appointment.consultationType.toLowerCase() === 'consultation' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {appointment.consultationType}
                                        </span>
                                    </div>
                                    <h3 className="appointment-title text-base font-bold text-gray-800 mb-1">
                                        {appointment.specialization}
                                    </h3>
                                    <p className="appointment-details text-sm text-gray-600 mb-2 flex items-center gap-1">
                                        <i className="fas fa-notes-medical text-[#27AE60] opacity-70 text-xs"></i>
                                        {appointment.consultationType}
                                    </p>

                                    {/* INFO CHANGE: Showing Client Info */}
                                    <div className="client-info flex items-center gap-2 mt-3 pt-2 border-t border-gray-100">
                                        {appointment.profileImage ? (
                                            <img
                                                src={appointment.profileImage}
                                                alt={appointment.clientName}
                                                className="w-7 h-7 rounded-full object-cover shadow border border-[#27AE60]"
                                            />
                                        ) : (
                                            <div
                                                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow border border-[#27AE60]"
                                                style={{ backgroundColor: DARK_GREEN }}
                                            >
                                                {appointment.clientName.charAt(0)}
                                            </div>
                                        )}
                                        <span className="client-name text-sm font-semibold text-gray-800 truncate">
                                            {appointment.clientName}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DietitianSchedule;