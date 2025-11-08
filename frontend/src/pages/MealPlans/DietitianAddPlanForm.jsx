import React, { useState, useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Utensils, Users, X, Plus, Save, Trash2, Loader2, Calendar, Search, Check, Edit, Clipboard, CheckCircle, BarChart, Home, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- Utility Functions ---

/**
 * Converts a Date object to a YYYY-MM-DD string key for planning.
 * @param {Date} date
 * @returns {string}
 */
const dateToKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Mock Client Data
const MOCK_CLIENTS = [
    { id: 'client1', name: 'Alice Johnson', goal: 'Weight Loss (1500 kcal)', recentPlan: 'Keto' },
    { id: 'client2', name: 'Robert Lee', goal: 'Muscle Gain (3000 kcal)', recentPlan: 'High-Protein' },
    { id: 'client3', name: 'Maria Garcia', goal: 'Energy & Wellness (2000 kcal)', recentPlan: 'Mediterranean' },
];

// Mock Data Structure: { [clientId]: { [dateKey]: planObject, ... }, ... }
const INITIAL_PLANS = {
    'client1': {
        [dateToKey(new Date())]: {
            id: dateToKey(new Date()) + '-1', planName: 'Today\'s Keto', dietType: 'Keto', calories: 1500, notes: 'Stay hydrated.', meals: []
        }
    }
};

// --- Custom Icon Component (using Lucide icons) ---

const Icon = ({ name, className = '' }) => {
    switch (name) {
        case 'ChevronLeft': return <ChevronLeft className={`text-lg ${className}`} />;
        case 'ChevronRight': return <ChevronRight className={`text-lg ${className}`} />;
        case 'Utensils': return <Utensils className={`text-xl ${className}`} />;
        case 'Users': return <Users className={`text-xl ${className}`} />;
        case 'X': return <X className={`text-base ${className}`} />;
        case 'Plus': return <Plus className={`text-base ${className}`} />;
        case 'Save': return <Save className={`text-xl ${className}`} />;
        case 'Trash2': return <Trash2 className={`text-xs ${className}`} />;
        case 'Loader2': return <Loader2 className={`text-xl animate-spin ${className}`} />;
        case 'Calendar': return <Calendar className={`text-xl ${className}`} />;
        case 'Filter': return <Search className={`text-xl ${className}`} />;
        case 'Check': return <Check className={`text-base ${className}`} />;
        case 'Edit': return <Edit className={`text-base ${className}`} />;
        case 'Clipboard': return <Clipboard className={`text-sm ${className}`} />;
        case 'CheckCircle': return <CheckCircle className={`text-xl ${className}`} />;
        case 'BarChart': return <BarChart className={`text-xl ${className}`} />;
        case 'Home': return <Home className={`text-xl ${className}`} />;
        case 'Flame': return <Flame className={`text-sm ${className}`} />;
        default: return <span className={className}>?</span>;
    }
};

// --- Day Cell Component (used in CalendarView) ---
const DayCell = ({ day, date, plan, isCurrentMonth, isToday, isSelected, onSelectDay, onViewPlan, isDeleteMode }) => {
    const dateKey = dateToKey(date);
    const today = new Date();
    const isPastDate = date < today && !dateToKey(date).startsWith(dateToKey(today));

    // Color schemes for different diet types
    const getDietTypeColors = (dietType) => {
        switch (dietType) {
            case 'High-Protein': return { bg: 'bg-blue-50', border: 'border-green-100', text: 'text-blue-700', accent: 'bg-blue-500' };
            case 'Mediterranean': return { bg: 'bg-orange-50', border: 'border-green-100', text: 'text-orange-700', accent: 'bg-orange-500' };
            case 'Keto': return { bg: 'bg-purple-50', border: 'border-green-100', text: 'text-purple-700', accent: 'bg-purple-500' };
            default: return { bg: 'bg-slate-50', border: 'border-green-100', text: 'text-slate-700', accent: 'bg-slate-500' };
        }
    };

    const colors = plan ? getDietTypeColors(plan.dietType) : { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700', accent: 'bg-slate-500' };

    const handleClick = () => {
        if (plan && onViewPlan && !isDeleteMode) {
            onViewPlan(plan, dateKey);
        } else if (isCurrentMonth && !isPastDate && onSelectDay) {
            onSelectDay(date);
        }
    };

    return (
        <div
            className={`
                h-28 rounded-lg p-2 overflow-hidden transition-all duration-200 relative cursor-pointer shadow-sm border
                ${isCurrentMonth ? `${colors.bg} ${colors.border} hover:shadow-md` : 'bg-gray-50 border-green-100 text-gray-400 pointer-events-none'}
                ${isToday ? 'ring-2 ring-green-400 shadow-lg bg-green-50 border-green-200' : ''}
                ${isSelected ? 'ring-2 ring-blue-400 shadow-lg bg-blue-50 border-blue-200' : ''}
                ${plan ? `hover:${colors.bg} hover:shadow-lg` : 'hover:bg-slate-100'}
                ${isPastDate ? 'opacity-50' : ''}
            `}
            onClick={handleClick}
        >
            <div className={`font-semibold text-sm text-center mb-1 ${isToday ? 'text-green-800' : isPastDate ? 'text-green-600' : 'text-green-700'}`}>
                {day}
            </div>
            {plan ? (
                <div className="flex flex-col h-full">
                    <div className="text-center flex-1">
                        <p className={`text-xs font-semibold ${colors.text} truncate mb-1 flex items-center justify-center gap-1`}>
                            <Icon name="Utensils" className="text-xs" /> {plan.planName}
                        </p>
                        <p className={`text-xs ${colors.text} font-medium`}>{plan.calories} kcal</p>
                        <p className={`text-xs ${colors.text} opacity-75`}>{plan.dietType}</p>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); onViewPlan(plan, dateKey); }}
                        title={`View plan for ${dateKey}`}
                        className={`mt-1 self-center ${colors.accent} text-white px-2 py-1 rounded-md hover:opacity-90 transition text-xs font-medium shadow-sm`}
                    >
                        View
                    </button>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center">
                    <div className={`text-center ${isPastDate ? 'text-green-500' : 'text-green-600'}`}>
                        <div className="text-xs font-medium">
                            {isPastDate ? 'Past' : 'Available'}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};// --- Plan Detail Modal Component ---
const PlanDetailModal = ({ plan, onClose, date }) => {
    if (!plan) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/20 backdrop-blur-sm">
            <div className="bg-linear-to-br from-white to-green-50 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-green-200">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">{plan.planName}</h2>
                            <p className="text-slate-600">{date}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-green-100 rounded-full transition"
                        >
                            <Icon name="ChevronLeft" className="text-green-600" />
                        </button>
                    </div>

                    {/* Plan Info */}
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-slate-50 rounded-xl p-4">
                            <h3 className="font-semibold text-slate-800 mb-2">Plan Details</h3>
                            <div className="space-y-2">
                                <p><span className="font-medium">Diet Type:</span> {plan.dietType}</p>
                                <p><span className="font-medium">Total Calories:</span> {plan.calories} kcal</p>
                                <p><span className="font-medium">Meals:</span> {plan.meals?.length || 0}</p>
                                {plan.createdAt && <p><span className="font-medium">Created:</span> {new Date(plan.createdAt).toLocaleDateString()}</p>}
                            </div>
                        </div>

                        {plan.notes && (
                            <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                                <h3 className="font-semibold text-green-800 mb-2">Notes</h3>
                                <p className="text-green-700">{plan.notes}</p>
                            </div>
                        )}
                    </div>

                    {/* Meals */}
                    {plan.meals && plan.meals.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center">
                                <Icon name="Utensils" className="mr-2 text-green-600" />
                                Daily Meals
                            </h3>

                            {plan.meals.map((meal, index) => (
                                <div key={index} className="bg-linear-to-br from-slate-50 to-green-50 rounded-xl p-4 border border-green-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-semibold text-slate-800">{meal.name}</h4>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-green-700 font-medium">{meal.calories} kcal</span>
                                            <Icon name="Flame" className="text-orange-500" />
                                        </div>
                                    </div>
                                    <p className="text-slate-700">{meal.details}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Close Button */}
                    <div className="flex justify-end mt-6">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition font-medium"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
const CalendarView = ({
    currentDate,
    plans,
    selectedClient,
    changeMonth,
    setCurrentDate,
    selectedDays,
    onDaySelect,
    filterStartDate,
    filterEndDate,
    assignmentMode,
    onViewPlan,
    isDeleteMode
}) => {
    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const days = [];

        // Adjust for Monday as first day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
        // If firstDayOfMonth is 0 (Sunday), it should be 6 (last position)
        // If firstDayOfMonth is 1 (Monday), it should be 0 (first position)
        // etc.
        const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

        // Add empty cells for days before the month starts
        for (let i = 0; i < startOffset; i++) {
            days.push(null); // null represents empty cell
        }

        // Add actual days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push({ day, isCurrentMonth: true, date: new Date(year, month, day) });
        }

        return days;
    };

    const daysOfMonth = useMemo(() => getDaysInMonth(currentDate), [currentDate]);

    const getAssignedPlan = useCallback((date) => {
        if (!selectedClient) return null;
        const dateKey = dateToKey(date);
        const clientPlans = plans[selectedClient.id] || {};
        return clientPlans[dateKey] || null;
    }, [selectedClient, plans]);

    const isDaySelected = useCallback((date) => {
        return assignmentMode === 'multiple' && selectedDays.some(selectedDate => dateToKey(selectedDate) === dateToKey(date));
    }, [selectedDays, assignmentMode]);

    // Filter days based on date range if provided
    const filteredDays = useMemo(() => {
        if (!filterStartDate && !filterEndDate) return daysOfMonth;

        return daysOfMonth.filter(day => {
            if (day === null) return true; // Keep empty cells for alignment
            const dayKey = dateToKey(day.date);
            const startCheck = !filterStartDate || dayKey >= filterStartDate;
            const endCheck = !filterEndDate || dayKey <= filterEndDate;
            return startCheck && endCheck;
        });
    }, [daysOfMonth, filterStartDate, filterEndDate]);

    return (
        <div className="bg-linear-to-br from-green-50 to-emerald-50 p-6 rounded-2xl shadow-xl border-4 border-green-300">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-3xl font-bold text-green-800 flex items-center">
                    <Icon name="Calendar" className="mr-3 text-green-600" /> {monthName}
                </h3>
                <div className="flex space-x-3">
                    <button onClick={() => changeMonth(-1)} className="p-3 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition shadow-md">
                        <Icon name="ChevronLeft" />
                    </button>
                    <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 text-sm font-semibold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition shadow-md">
                        <Icon name="Home" className="inline mr-1" /> Today
                    </button>
                    <button onClick={() => changeMonth(1)} className="p-3 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition shadow-md">
                        <Icon name="ChevronRight" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center font-semibold text-sm mb-4 text-green-700">
                {weekdays.map(day => <div key={day} className="py-2">{day}</div>)}
            </div>

            <div className="grid grid-cols-7 gap-2">
                {filteredDays.map((day, index) => {
                    if (day === null) {
                        return <div key={index} className="h-28 rounded-lg"></div>;
                    }

                    const plan = getAssignedPlan(day.date);
                    const isToday = dateToKey(day.date) === dateToKey(new Date());
                    const isSelected = isDaySelected(day.date);

                    return (
                        <DayCell
                            key={index}
                            day={day.day}
                            date={day.date}
                            plan={plan}
                            isCurrentMonth={day.isCurrentMonth}
                            isToday={isToday}
                            isSelected={isSelected}
                            onSelectDay={onDaySelect}
                            onViewPlan={onViewPlan}
                            isDeleteMode={isDeleteMode}
                        />
                    );
                })}
            </div>
        </div>
    );
};

// --- Core Component: DietitianAddPlanForm ---
const DietitianAddPlanForm = () => {
    const navigate = useNavigate();
    // --- State Management ---
    const [view, setView] = useState('CLIENT_LIST'); // 'CLIENT_LIST' | 'CLIENT_DASHBOARD' | 'CREATE_PLAN' | 'ASSIGN_PLAN' | 'DELETE_PLAN'
    const [clients] = useState(MOCK_CLIENTS);
    const [selectedClient, setSelectedClient] = useState(null);
    const [plans, setPlans] = useState(INITIAL_PLANS);
    const [availablePlans, setAvailablePlans] = useState([]); // List of created plans for the client
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [selectedDays, setSelectedDays] = useState([]);
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');
    const [assignmentMode, setAssignmentMode] = useState('single'); // 'single' | 'multiple' | 'month' | 'custom'
    const [loading, setLoading] = useState(false);
    const [deleteMode, setDeleteMode] = useState(false);
    const [showPlanModal, setShowPlanModal] = useState(false);
    const [selectedPlanForModal, setSelectedPlanForModal] = useState(null);
    const [selectedDateForModal, setSelectedDateForModal] = useState('');

    // --- Navigation Handlers ---
    const handleSelectClient = (client) => {
        setSelectedClient(client);
        // Load existing plans for this client
        const clientPlans = plans[client.id] || {};
        const planList = Object.values(clientPlans).map(plan => ({
            ...plan,
            assignedDates: Object.keys(clientPlans).filter(date => clientPlans[date].id === plan.id)
        }));
        setAvailablePlans(planList);
        setView('CLIENT_DASHBOARD');
    };

    const handleCreatePlan = () => {
        setView('CREATE_PLAN');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleAssignPlan = (plan) => {
        setSelectedPlan(plan);
        setView('ASSIGN_PLAN');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeletePlan = (planId) => {
        setAvailablePlans(prev => prev.filter(p => p.id !== planId));
        // Also remove from all assigned dates
        setPlans(prevPlans => {
            const newPlans = { ...prevPlans };
            Object.keys(newPlans).forEach(clientId => {
                Object.keys(newPlans[clientId]).forEach(dateKey => {
                    if (newPlans[clientId][dateKey].id === planId) {
                        delete newPlans[clientId][dateKey];
                    }
                });
            });
            return newPlans;
        });
        alert(`Plan deleted successfully!`);
    };

    // --- Calendar Handlers ---
    const changeMonth = (delta) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
    };

    const handleCalendarAssignPlan = (date, showAlert = true) => {
        if (!selectedPlan) return;
        const dateKey = dateToKey(date);
        setPlans(prevPlans => {
            const clientId = selectedClient.id;
            const currentSchedule = prevPlans[clientId] || {};
            return {
                ...prevPlans,
                [clientId]: {
                    ...currentSchedule,
                    [dateKey]: selectedPlan,
                }
            };
        });
        if (showAlert) {
            alert(`Plan "${selectedPlan.planName}" assigned to ${selectedClient.name} for ${dateKey}!`);
        }
    };

    const handleRemovePlan = (dateKey, showAlert = true) => {
        if (!selectedClient) return;
        setPlans(prevPlans => {
            const clientId = selectedClient.id;
            const currentSchedule = prevPlans[clientId] || {};
            const updatedSchedule = { ...currentSchedule };
            delete updatedSchedule[dateKey];
            return {
                ...prevPlans,
                [clientId]: updatedSchedule
            };
        });
        if (showAlert) {
            alert(`Plan removed for ${selectedClient.name} on ${dateKey}.`);
        }
    };

    const handleDaySelect = (date) => {
        const dateKey = dateToKey(date);
        setSelectedDays(prev =>
            prev.some(d => dateToKey(d) === dateKey)
                ? prev.filter(d => dateToKey(d) !== dateKey)
                : [...prev, date]
        );
    };

    const handleViewPlan = (plan, date) => {
        setSelectedPlanForModal(plan);
        setSelectedDateForModal(date);
        setShowPlanModal(true);
    };

    const closePlanModal = () => {
        setShowPlanModal(false);
        setSelectedPlanForModal(null);
        setSelectedDateForModal('');
    };

    // --- Plan Creation Handler ---
    const handleSavePlan = (planFormState, mealEntries) => {
        if (!selectedClient) return;

        setLoading(true);
        setTimeout(() => {
            const newPlan = {
                id: Date.now().toString(),
                planName: planFormState.planName.trim(),
                dietType: planFormState.dietType,
                calories: parseInt(planFormState.calories) || 0,
                notes: planFormState.notes,
                imageUrl: planFormState.imageUrl,
                meals: mealEntries.map(m => ({
                    name: m.mealName.trim(),
                    calories: parseInt(m.calories) || 0,
                    details: m.details,
                })),
                createdAt: new Date().toISOString(),
            };

            setAvailablePlans(prev => [...prev, { ...newPlan, assignedDates: [] }]);
            setLoading(false);
            setView('CLIENT_DASHBOARD');
            alert(`Plan "${newPlan.planName}" created successfully!`);
        }, 800);
    };

    // --- UI Components ---

    const ClientList = () => (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-emerald-50 to-teal-50 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-7xl mx-auto pt-4">
                {/* Header */}
                <div className="relative mb-8 px-4">
                    <button
                        onClick={() => navigate('/dietitian/profile')}
                        className="absolute left-0 top-0 px-4 py-2 bg-emerald-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:bg-emerald-700 font-semibold"
                        title="Back to Profile"
                    >
                        Back to Profile
                    </button>
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center gap-3">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-linear-to-r from-emerald-500 to-teal-600 rounded-2xl shadow-lg">
                                <Icon name="Users" className="text-white" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-linear-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent leading-tight">
                                My Clients
                            </h1>
                        </div>
                        <p className="text-sm text-slate-600 mt-2 leading-tight max-w-lg mx-auto">
                            Select a client to manage their meal plans and schedule
                        </p>
                    </div>
                </div>

                {/* Client List */}
                <div className="space-y-4">
                    {clients.map(client => (
                        <div
                            key={client.id}
                            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 hover:shadow-xl transition-all duration-300"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-emerald-100 rounded-xl">
                                        <Icon name="Users" className="text-emerald-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800">{client.name}</h3>
                                        <p className="text-sm text-slate-500">Active Client</p>
                                        <div className="flex items-center space-x-4 mt-1">
                                            <span className="text-xs text-slate-600">
                                                <span className="font-semibold">Goal:</span> {client.goal}
                                            </span>
                                            <span className="text-xs text-slate-600">
                                                <span className="font-semibold">Recent Plan:</span> {client.recentPlan}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleSelectClient(client)}
                                    className="px-6 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors duration-200 font-medium shadow-md"
                                >
                                    Assign Plans
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const ClientDashboard = () => (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-emerald-50 to-teal-50 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-7xl mx-auto pt-8">
                {/* Header */}
                <div className="relative mb-8">
                    <button
                        onClick={() => setView('CLIENT_LIST')}
                        className="absolute left-0 top-0 px-4 py-2 bg-emerald-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:bg-emerald-700 font-semibold"
                        title="Back to Clients"
                    >
                        Back to Clients
                    </button>
                    <div className="text-center">
                        <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                            {selectedClient.name}'s Meal Plans
                        </h1>
                        <p className="text-sm text-slate-600 mt-1">{selectedClient.goal}</p>
                    </div>
                </div>

                {/* Available Plans Section */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                            <Icon name="Utensils" className="mr-3 text-emerald-600" />
                            Available Plans ({availablePlans.length})
                        </h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setDeleteMode(!deleteMode)}
                                className={`px-4 py-2 rounded-xl transition-all duration-200 font-medium ${deleteMode ? 'bg-red-500 text-white' : 'bg-slate-500 text-white hover:bg-slate-600'}`}
                            >
                                {deleteMode ? 'Cancel Delete' : 'Delete Plans'}
                            </button>
                            <button
                                onClick={handleCreatePlan}
                                className="flex items-center px-4 py-2 bg-linear-to-r from-emerald-500 to-teal-600 text-white rounded-xl shadow-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 font-medium"
                            >
                                <Icon name="Plus" className="mr-2" /> Add Plan
                            </button>
                        </div>
                    </div>

                    {availablePlans.length === 0 ? (
                        <div className="text-center py-12">
                            <Icon name="Utensils" className="text-4xl text-slate-300 mb-4" />
                            <p className="text-slate-500 text-lg">No plans created yet</p>
                            <p className="text-slate-400 text-sm mt-2">Create your first meal plan to get started</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {availablePlans.map(plan => (
                                <div key={plan.id} className="bg-slate-50 rounded-2xl p-4 border border-slate-200 hover:shadow-lg transition-all duration-200">
                                    {plan.imageUrl && (
                                        <div className="mb-3">
                                            <img
                                                src={plan.imageUrl}
                                                alt={plan.planName}
                                                className="w-full h-32 object-cover rounded-lg"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    )}
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-bold text-slate-800 text-lg">{plan.planName}</h3>
                                            <p className="text-sm text-slate-500">{plan.dietType} • {plan.calories} kcal</p>
                                        </div>
                                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-medium">
                                            {plan.dietType}
                                        </span>
                                    </div>
                                    {plan.notes && (
                                        <p className="text-sm text-slate-600 mb-3 line-clamp-2">{plan.notes}</p>
                                    )}
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500">
                                            {plan.meals.length} meals
                                        </span>
                                        {deleteMode ? (
                                            <button
                                                onClick={() => handleDeletePlan(plan.id)}
                                                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium"
                                            >
                                                Delete
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleAssignPlan(plan)}
                                                className="px-3 py-1 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors duration-200 text-sm font-medium"
                                            >
                                                Assign Plan
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Calendar Section */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                            <Icon name="Calendar" className="mr-3 text-emerald-600" />
                            Schedule Calendar
                        </h2>

                        <div className="flex gap-2">
                            <button
                                onClick={() => { setSelectedPlan(null); setView('DELETE_PLAN'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                className="flex items-center px-4 py-2 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 transition-all duration-200 font-medium"
                            >
                                <Icon name="Trash2" className="mr-2" /> Delete Plans
                            </button>

                            {/* Filter Options */}
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Icon name="Filter" className="text-slate-500" />
                                    <input
                                        type="date"
                                        value={filterStartDate}
                                        onChange={(e) => setFilterStartDate(e.target.value)}
                                        className="px-3 py-1 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        placeholder="Start Date"
                                    />
                                    <span className="text-slate-500">to</span>
                                    <input
                                        type="date"
                                        value={filterEndDate}
                                        onChange={(e) => setFilterEndDate(e.target.value)}
                                        className="px-3 py-1 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        placeholder="End Date"
                                    />
                                    {(filterStartDate || filterEndDate) && (
                                        <button
                                            onClick={() => { setFilterStartDate(''); setFilterEndDate(''); }}
                                            className="px-3 py-1 text-slate-500 hover:text-slate-700 text-sm"
                                        >
                                            Clear
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <CalendarView
                        currentDate={currentDate}
                        plans={plans}
                        selectedClient={selectedClient}
                        changeMonth={changeMonth}
                        setCurrentDate={setCurrentDate}
                        selectedPlan={selectedPlan}
                        selectedDays={selectedDays}
                        onDaySelect={handleDaySelect}
                        filterStartDate={filterStartDate}
                        filterEndDate={filterEndDate}
                        assignmentMode={null}
                        onViewPlan={handleViewPlan}
                        isDeleteMode={false}
                    />
                </div>
            </div>
        </div>
    );

    const CreatePlanForm = () => {
        const mealTypes = ['Vegan', 'Vegetarian', 'Keto', 'Mediterranean', 'High-Protein', 'Low-Carb', 'Anything'];

        const [formState, setFormState] = useState({
            planName: '',
            dietType: 'Vegan',
            calories: 1800,
            notes: '',
        });
        const [mealEntries, setMealEntries] = useState([{ mealName: '', calories: '', details: '' }]);

        const handleFormChange = (e) => {
            const { id, value } = e.target;
            setFormState(prev => ({ ...prev, [id]: value }));
        };

        const handleMealChange = (index, field, value) => {
            const newMeals = [...mealEntries];
            newMeals[index][field] = value;
            setMealEntries(newMeals);
        };

        const addMealEntry = () => {
            setMealEntries(prev => [...prev, { mealName: '', calories: '', details: '' }]);
        };

        const removeMealEntry = (index) => {
            setMealEntries(prev => prev.filter((_, i) => i !== index));
        };

        const handleSubmit = () => {
            if (!formState.planName.trim()) {
                alert("Plan Name is required.");
                return;
            }
            if (mealEntries.length === 0 || mealEntries.some(m => !m.mealName.trim())) {
                alert("All meal entries must have a name.");
                return;
            }

            handleSavePlan(formState, mealEntries);
        };

        const isSaveDisabled = loading || !formState.planName.trim() || mealEntries.length === 0 || mealEntries.some(m => !m.mealName.trim());

        return (
            <div className="min-h-screen bg-linear-to-br from-slate-50 via-emerald-50 to-teal-50 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="w-[75%] mx-auto pt-8">
                    {/* Header */}
                    <div className="relative mb-8">
                        <button
                            onClick={() => setView('CLIENT_DASHBOARD')}
                            className="absolute left-0 top-0 flex items-center px-4 py-2 bg-emerald-600 text-white rounded-xl shadow-lg hover:bg-emerald-700 transition-all duration-200 font-medium"
                        >
                            <Icon name="ChevronLeft" className="mr-2" /> Back
                        </button>
                        <div className="text-center">
                            <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                                Create Meal Plan
                            </h1>
                            <p className="text-sm text-slate-600 mt-1">For {selectedClient?.name}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Plan Details */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
                            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                                <Icon name="Utensils" className="mr-3 text-emerald-600" />
                                Plan Details
                            </h2>
                            <div className="grid md:grid-cols-3 gap-4">
                                <label className="block">
                                    <span className="text-sm font-medium text-slate-700">Plan Name *</span>
                                    <input
                                        type="text"
                                        id="planName"
                                        value={formState.planName}
                                        onChange={handleFormChange}
                                        className="w-full mt-1 p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        placeholder="e.g., Daily High Protein"
                                        required
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-sm font-medium text-slate-700">Diet Type *</span>
                                    <select
                                        id="dietType"
                                        value={formState.dietType}
                                        onChange={handleFormChange}
                                        className="w-full mt-1 p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    >
                                        {mealTypes.map(type => <option key={type} value={type}>{type}</option>)}
                                    </select>
                                </label>
                                <label className="block">
                                    <span className="text-sm font-medium text-slate-700">Daily Calories (kcal) *</span>
                                    <input
                                        type="number"
                                        id="calories"
                                        value={formState.calories}
                                        onChange={handleFormChange}
                                        className="w-full mt-1 p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        min="500"
                                        max="5000"
                                    />
                                </label>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4 mt-4">
                                <label className="block">
                                    <span className="text-sm font-medium text-slate-700">Plan Image URL</span>
                                    <input
                                        type="url"
                                        id="imageUrl"
                                        value={formState.imageUrl}
                                        onChange={handleFormChange}
                                        className="w-full mt-1 p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-sm font-medium text-slate-700">Upload Image</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                // In a real app, you'd upload to a server and get back a URL
                                                // For now, we'll just create a data URL
                                                const reader = new FileReader();
                                                reader.onload = (e) => {
                                                    setFormState(prev => ({ ...prev, imageUrl: e.target.result }));
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                        className="w-full mt-1 p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                                    />
                                </label>
                            </div>
                            <label className="block mt-4">
                                <span className="text-sm font-medium text-slate-700">General Notes</span>
                                <textarea
                                    id="notes"
                                    value={formState.notes}
                                    onChange={handleFormChange}
                                    className="w-full mt-1 p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-y"
                                    rows="3"
                                    placeholder="Important notes: Drink 3L water, avoid sugars, etc."
                                />
                            </label>
                        </div>

                        {/* Meal Entries */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-slate-800 flex items-center">
                                    <Icon name="Utensils" className="mr-3 text-emerald-600" />
                                    Meal Entries
                                </h2>
                                <button onClick={addMealEntry} className="flex items-center px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors duration-200 font-medium">
                                    <Icon name="Plus" className="mr-2" /> Add Meal
                                </button>
                            </div>
                            <div className="space-y-4">
                                {mealEntries.length === 0 && <p className="text-center text-slate-500 italic py-8">No meals defined yet.</p>}
                                {mealEntries.map((meal, index) => (
                                     <div key={index} className="p-4 border border-slate-200 rounded-xl bg-slate-50 relative">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-semibold text-emerald-600">Meal {index + 1}</h4>
                                            <button
                                                onClick={() => removeMealEntry(index)}
                                                className="text-red-500 hover:text-red-700 transition p-1"
                                                title="Remove meal"
                                            >
                                                <Icon name="X" />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <label className="block col-span-2">
                                                <span className="text-xs font-medium text-slate-700">Meal Name (e.g., Lunch) *</span>
                                                <input
                                                    type="text"
                                                    value={meal.mealName}
                                                    onChange={(e) => handleMealChange(index, 'mealName', e.target.value)}
                                                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-sm"
                                                    placeholder="e.g., Chicken Salad"
                                                    required
                                                />
                                            </label>
                                            <label className="block">
                                                <span className="text-xs font-medium text-slate-700">Approx. Calories</span>
                                                <input
                                                    type="number"
                                                    value={meal.calories}
                                                    onChange={(e) => handleMealChange(index, 'calories', e.target.value)}
                                                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-sm"
                                                    min="0"
                                                />
                                            </label>
                                        </div>
                                        <label className="block mt-2">
                                            <span className="text-xs font-medium text-slate-700">Details/Recipe</span>
                                            <textarea
                                                value={meal.details}
                                                onChange={(e) => handleMealChange(index, 'details', e.target.value)}
                                                className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-sm resize-y"
                                                rows="2"
                                                placeholder="Recipe or ingredients: 150g chicken, 50g lettuce, dressing."
                                            />
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end pt-4 border-t border-slate-200">
                            <button
                                onClick={handleSubmit}
                                className="flex items-center px-6 py-3 bg-linear-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg disabled:bg-slate-400"
                                disabled={isSaveDisabled}
                            >
                                {loading ? <Icon name="Loader2" className="mr-2" /> : <Icon name="Save" className="mr-2" />}
                                Create Plan
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const DeletePlanView = () => {
        const handleBulkRemove = () => {
            if (selectedDays.length === 0) return;
            selectedDays.forEach(date => {
                const dateKey = dateToKey(date);
                handleRemovePlan(dateKey, false);
            });
            alert(`Plans removed from ${selectedDays.length} selected days!`);
            setSelectedDays([]);
        };

        const handleMonthRemove = () => {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(year, month, day);
                const dateKey = dateToKey(date);
                handleRemovePlan(dateKey, false);
            }
            alert(`Plans removed from entire month!`);
        };

        const handleRangeRemove = (start, end) => {
            if (!start || !end) return;
            const startDate = new Date(start);
            const endDate = new Date(end);
            for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                const dateKey = dateToKey(new Date(d));
                handleRemovePlan(dateKey, false);
            }
            alert(`Plans removed from the selected range!`);
        };

        return (
            <div className="min-h-screen bg-linear-to-br from-slate-50 via-emerald-50 to-teal-50 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-7xl mx-auto pt-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <button
                            onClick={() => setView('CLIENT_DASHBOARD')}
                            className="flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200 text-slate-700 font-medium"
                        >
                            <Icon name="ChevronLeft" className="mr-2" /> Back
                        </button>
                        <div className="text-center">
                            <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-red-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                                Delete Plans from Calendar
                            </h1>
                            <p className="text-sm text-slate-600 mt-1">For {selectedClient?.name}</p>
                        </div>
                        <div></div>
                    </div>

                    {/* Deletion Options */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
                        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                            <Icon name="Trash2" className="mr-3 text-red-600" />
                            Flexible Deletion Options
                        </h2>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <button
                                onClick={() => setAssignmentMode('single')}
                                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                                    assignmentMode === 'single'
                                        ? 'border-red-500 bg-red-50 text-red-700'
                                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                                }`}
                            >
                                <Icon name="Calendar" className="text-2xl mb-2 block" />
                                <div className="font-semibold">Remove from Single Day</div>
                                <div className="text-sm">Click any day with a plan to remove</div>
                            </button>

                            <button
                                onClick={() => setAssignmentMode('multiple')}
                                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                                    assignmentMode === 'multiple'
                                        ? 'border-red-500 bg-red-50 text-red-700'
                                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                                }`}
                            >
                                <Icon name="Check" className="text-2xl mb-2 block" />
                                <div className="font-semibold">Remove from Multiple Days</div>
                                <div className="text-sm">Select multiple days with plans first</div>
                            </button>

                            <button
                                onClick={() => setAssignmentMode('month')}
                                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                                    assignmentMode === 'month'
                                        ? 'border-red-500 bg-red-50 text-red-700'
                                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                                }`}
                            >
                                <Icon name="Calendar" className="text-2xl mb-2 block" />
                                <div className="font-semibold">Remove from Entire Month</div>
                                <div className="text-sm">Remove plans from all days this month</div>
                            </button>

                            <button
                                onClick={() => setAssignmentMode('custom')}
                                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                                    assignmentMode === 'custom'
                                        ? 'border-red-500 bg-red-50 text-red-700'
                                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                                }`}
                            >
                                <Icon name="Edit" className="text-2xl mb-2 block" />
                                <div className="font-semibold">Remove from Custom Range</div>
                                <div className="text-sm">Pick start and end dates to remove</div>
                            </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            {assignmentMode === 'multiple' && selectedDays.length > 0 && (
                                <button
                                    onClick={handleBulkRemove}
                                    className="flex items-center px-6 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all duration-200 shadow-lg"
                                >
                                    <Icon name="Trash2" className="mr-2" />
                                    Remove from {selectedDays.length} Selected Days
                                </button>
                            )}

                            {assignmentMode === 'month' && (
                                <button
                                    onClick={handleMonthRemove}
                                    className="flex items-center px-6 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all duration-200 shadow-lg"
                                >
                                    <Icon name="Trash2" className="mr-2" />
                                    Remove from Entire Month
                                </button>
                            )}

                            {assignmentMode === 'custom' && (
                                <div className="flex gap-4 items-center">
                                    <input
                                        type="date"
                                        className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        placeholder="Start Date"
                                    />
                                    <span className="text-slate-500">to</span>
                                    <input
                                        type="date"
                                        className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        placeholder="End Date"
                                    />
                                    <button
                                        onClick={(e) => {
                                            const inputs = e.target.parentElement.querySelectorAll('input[type="date"]');
                                            const start = inputs[0].value;
                                            const end = inputs[1].value;
                                            handleRangeRemove(start, end);
                                        }}
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium"
                                    >
                                        <Icon name="Trash2" className="mr-1" />Remove Range
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Calendar */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
                        <CalendarView
                            currentDate={currentDate}
                            plans={plans}
                            selectedClient={selectedClient}
                            changeMonth={changeMonth}
                            setCurrentDate={setCurrentDate}
                            selectedPlan={selectedPlan}
                            selectedDays={selectedDays}
                            onDaySelect={
                                assignmentMode === 'single' ? (date) => handleRemovePlan(dateToKey(date)) :
                                assignmentMode === 'multiple' ? handleDaySelect : null
                            }
                            filterStartDate={filterStartDate}
                            filterEndDate={filterEndDate}
                            assignmentMode={assignmentMode}
                            onViewPlan={handleViewPlan}
                            isDeleteMode={true}
                        />
                    </div>
                </div>
            </div>
        );
    };

    const AssignPlanView = () => {
        const handleBulkAssign = () => {
            if (selectedDays.length === 0 || !selectedPlan) return;
            selectedDays.forEach(date => {
                handleCalendarAssignPlan(date, false);
            });
            alert(`Plan "${selectedPlan.planName}" assigned to ${selectedDays.length} selected days!`);
            setSelectedDays([]);
        };

        const handleMonthAssign = () => {
            if (!selectedPlan) return;
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(year, month, day);
                handleCalendarAssignPlan(date, false);
            }
            alert(`Plan "${selectedPlan.planName}" assigned to entire month!`);
        };

        const handleSingleDayAssign = (date) => {
            if (!selectedPlan) return;
            handleCalendarAssignPlan(date);
        };

        const handleRangeAssign = (start, end) => {
            if (!start || !end || !selectedPlan) return;
            const startDate = new Date(start);
            const endDate = new Date(end);
            for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                handleCalendarAssignPlan(new Date(d), false);
            }
            alert(`Plan "${selectedPlan.planName}" assigned to the selected range!`);
        };

        return (
            <div className="min-h-screen bg-linear-to-br from-slate-50 via-emerald-50 to-teal-50 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-7xl mx-auto pt-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <button
                            onClick={() => setView('CLIENT_DASHBOARD')}
                            className="flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200 text-slate-700 font-medium"
                        >
                            <Icon name="ChevronLeft" className="mr-2" /> Back
                        </button>
                        <div className="text-center">
                            <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                                Assign Plan to Calendar
                            </h1>
                            <p className="text-sm text-slate-600 mt-1">For {selectedClient?.name}</p>
                        </div>
                        <div></div>
                    </div>

                    {/* Selected Plan Display */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
                        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                            <Icon name="Utensils" className="mr-3 text-emerald-600" />
                            Selected Plan
                        </h2>
                        {selectedPlan ? (
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-lg">{selectedPlan.planName}</h3>
                                        <p className="text-sm text-slate-500">{selectedPlan.dietType} • {selectedPlan.calories} kcal</p>
                                        {selectedPlan.notes && <p className="text-sm text-slate-600 mt-2">{selectedPlan.notes}</p>}
                                    </div>
                                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium">
                                        {selectedPlan.dietType}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-slate-500 italic">No plan selected</p>
                        )}
                    </div>

                    {/* Assignment Options */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
                        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                            <Icon name="Calendar" className="mr-3 text-emerald-600" />
                            Assignment Options
                        </h2>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <button
                                onClick={() => setAssignmentMode('single')}
                                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                                    assignmentMode === 'single'
                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                                }`}
                            >
                                <Icon name="Calendar" className="text-2xl mb-2 block" />
                                <div className="font-semibold">Assign to Single Day</div>
                                <div className="text-sm">Click any available day to assign</div>
                            </button>

                            <button
                                onClick={() => setAssignmentMode('multiple')}
                                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                                    assignmentMode === 'multiple'
                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                                }`}
                            >
                                <Icon name="Check" className="text-2xl mb-2 block" />
                                <div className="font-semibold">Assign to Multiple Days</div>
                                <div className="text-sm">Select multiple days first</div>
                            </button>

                            <button
                                onClick={() => setAssignmentMode('month')}
                                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                                    assignmentMode === 'month'
                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                                }`}
                            >
                                <Icon name="Calendar" className="text-2xl mb-2 block" />
                                <div className="font-semibold">Assign to Entire Month</div>
                                <div className="text-sm">Assign to all days this month</div>
                            </button>

                            <button
                                onClick={() => setAssignmentMode('custom')}
                                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                                    assignmentMode === 'custom'
                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                                }`}
                            >
                                <Icon name="Edit" className="text-2xl mb-2 block" />
                                <div className="font-semibold">Assign to Custom Range</div>
                                <div className="text-sm">Pick start and end dates</div>
                            </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            {assignmentMode === 'multiple' && selectedDays.length > 0 && (
                                <button
                                    onClick={handleBulkAssign}
                                    className="flex items-center px-6 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-all duration-200 shadow-lg"
                                >
                                    <Icon name="Save" className="mr-2" />
                                    Assign to {selectedDays.length} Selected Days
                                </button>
                            )}

                            {assignmentMode === 'month' && (
                                <button
                                    onClick={handleMonthAssign}
                                    className="flex items-center px-6 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-all duration-200 shadow-lg"
                                >
                                    <Icon name="Save" className="mr-2" />
                                    Assign to Entire Month
                                </button>
                            )}

                            {assignmentMode === 'custom' && (
                                <div className="flex gap-4 items-center">
                                    <input
                                        type="date"
                                        className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        placeholder="Start Date"
                                    />
                                    <span className="text-slate-500">to</span>
                                    <input
                                        type="date"
                                        className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        placeholder="End Date"
                                    />
                                    <button
                                        onClick={(e) => {
                                            const inputs = e.target.parentElement.querySelectorAll('input[type="date"]');
                                            const start = inputs[0].value;
                                            const end = inputs[1].value;
                                            handleRangeAssign(start, end);
                                        }}
                                        className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors duration-200 font-medium"
                                    >
                                        <Icon name="Save" className="mr-1" />Assign Range
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Calendar */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
                        <CalendarView
                            currentDate={currentDate}
                            plans={plans}
                            selectedClient={selectedClient}
                            changeMonth={changeMonth}
                            setCurrentDate={setCurrentDate}
                            selectedPlan={selectedPlan}
                            selectedDays={selectedDays}
                            onDaySelect={
                                assignmentMode === 'single' ? handleSingleDayAssign :
                                assignmentMode === 'multiple' ? handleDaySelect : null
                            }
                            filterStartDate={filterStartDate}
                            filterEndDate={filterEndDate}
                            assignmentMode={assignmentMode}
                            onViewPlan={handleViewPlan}
                            isDeleteMode={false}
                        />
                    </div>
                </div>
            </div>
        );
    };
    const renderView = () => {
        switch (view) {
            case 'CLIENT_LIST':
                return <ClientList />;
            case 'CLIENT_DASHBOARD':
                return <ClientDashboard />;
            case 'CREATE_PLAN':
                return <CreatePlanForm />;
            case 'ASSIGN_PLAN':
                return <AssignPlanView />;
            case 'DELETE_PLAN':
                return <DeletePlanView />;
            default:
                return <ClientList />;
        }
    };

    return (
        <>
            {renderView()}
            {/* Plan Detail Modal */}
            {showPlanModal && (
                <PlanDetailModal
                    plan={selectedPlanForModal}
                    date={selectedDateForModal}
                    onClose={closePlanModal}
                />
            )}
        </>
    );
};

export default DietitianAddPlanForm;