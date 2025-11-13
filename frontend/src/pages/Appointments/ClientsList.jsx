import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import axios from 'axios';

// Mock data for clients
const mockClients = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+1 (555) 123-4567',
    age: 28,
    location: 'New York, NY',
    consultationType: 'Weight Management',
    nextAppointment: '2025-11-15 10:00 AM',
    status: 'Active',
    profileImage: 'https://via.placeholder.com/60x60/10B981/ffffff?text=SJ',
    lastConsultation: '2025-11-08',
    totalSessions: 5,
    goals: ['Weight Loss', 'Healthy Eating Habits']
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'm.chen@email.com',
    phone: '+1 (555) 234-5678',
    age: 35,
    location: 'Los Angeles, CA',
    consultationType: 'Diabetes Management',
    nextAppointment: '2025-11-18 2:30 PM',
    status: 'Active',
    profileImage: 'https://via.placeholder.com/60x60/059669/ffffff?text=MC',
    lastConsultation: '2025-11-10',
    totalSessions: 8,
    goals: ['Blood Sugar Control', 'Meal Planning']
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    email: 'emma.r@email.com',
    phone: '+1 (555) 345-6789',
    age: 42,
    location: 'Chicago, IL',
    consultationType: 'Cardiac Health',
    nextAppointment: '2025-11-20 11:15 AM',
    status: 'Active',
    profileImage: 'https://via.placeholder.com/60x60/047857/ffffff?text=ER',
    lastConsultation: '2025-11-12',
    totalSessions: 3,
    goals: ['Heart Health', 'Cholesterol Management']
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'd.kim@email.com',
    phone: '+1 (555) 456-7890',
    age: 31,
    location: 'Seattle, WA',
    consultationType: 'Sports Nutrition',
    nextAppointment: '2025-11-22 9:00 AM',
    status: 'Pending',
    profileImage: 'https://via.placeholder.com/60x60/065F46/ffffff?text=DK',
    lastConsultation: null,
    totalSessions: 0,
    goals: ['Athletic Performance', 'Muscle Building']
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    email: 'lisa.t@email.com',
    phone: '+1 (555) 567-8901',
    age: 29,
    location: 'Austin, TX',
    consultationType: 'Skin & Hair Care',
    nextAppointment: '2025-11-25 3:45 PM',
    status: 'Active',
    profileImage: 'https://via.placeholder.com/60x60/10B981/ffffff?text=LT',
    lastConsultation: '2025-11-05',
    totalSessions: 2,
    goals: ['Skin Health', 'Hair Growth']
  }
];

const ClientsList = () => {
  const navigate = useNavigate();
  const { user, token } = useAuthContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showClientModal, setShowClientModal] = useState(false);

  const handleViewDetails = (client) => {
    setSelectedClient(client);
    setShowClientModal(true);
  };

  // Fetch dietitian's bookings (clients) from API
  useEffect(() => {
    const fetchBookings = async () => {
      const dietitianId = localStorage.getItem('userId') || user?.id;
      
      if (!dietitianId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const config = token ? {
          headers: { 'Authorization': `Bearer ${token}` }
        } : {};

        const response = await axios.get(`/api/bookings/dietitian/${dietitianId}`, config);
        
        if (response.data.success) {
          setBookings(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, token]);

  // Convert bookings to client list
  const clientsFromBookings = useMemo(() => {
    const clientMap = new Map();
    const now = new Date();
    
    bookings.forEach(booking => {
      const clientId = booking.userId;
      const bookingDateTime = new Date(`${booking.date}T${booking.time}`);
      
      // Only include if appointment is upcoming or recently completed (within 24 hours)
      const hoursSinceAppointment = (now - bookingDateTime) / (1000 * 60 * 60);
      const isRelevant = bookingDateTime > now || (hoursSinceAppointment < 24 && booking.status !== 'completed');
      
      if (!isRelevant && booking.status === 'completed') {
        return; // Skip completed past appointments
      }
      
      if (clientMap.has(clientId)) {
        const existing = clientMap.get(clientId);
        existing.totalSessions += 1;
        
        // Update next appointment if this booking is in the future and earlier
        const existingDateTime = existing.nextAppointment ? new Date(existing.nextAppointment) : null;
        
        if (bookingDateTime > now && (!existingDateTime || bookingDateTime < existingDateTime)) {
          existing.nextAppointment = `${booking.date} ${booking.time}`;
        }
      } else {
        const isUpcoming = bookingDateTime > now;
        
        clientMap.set(clientId, {
          id: clientId,
          name: booking.username,
          email: booking.email,
          phone: booking.userPhone || 'N/A',
          age: 'N/A',
          location: booking.userAddress || 'N/A',
          consultationType: booking.consultationType || 'General Consultation',
          nextAppointment: isUpcoming ? `${booking.date} ${booking.time}` : null,
          status: booking.status === 'confirmed' ? 'Active' : booking.status === 'cancelled' ? 'Completed' : 'Pending',
          profileImage: booking.userProfilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(booking.username)}&background=28B463&color=fff&size=128`,
          lastConsultation: booking.date,
          totalSessions: 1,
          goals: [booking.dietitianSpecialization || 'General Health']
        });
      }
    });
    
    return Array.from(clientMap.values()).filter(c => c.nextAppointment || c.status === 'Active');
  }, [bookings]);

  // Combine mock data with real bookings
  const allClients = useMemo(() => {
    // Only show real bookings, remove mock data
    return clientsFromBookings;
  }, [clientsFromBookings]);

  // Filter clients based on search and status
  const filteredClients = allClients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.consultationType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || client.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Clients</h1>
              <p className="text-gray-600 mt-1">Manage your client consultations and appointments</p>
            </div>
            <button
              onClick={() => navigate('/dietitian/dashboard')}
              className="px-4 py-2 bg-[#28B463] text-white rounded-lg hover:bg-[#1E6F5C] transition-colors shadow-md"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Filters and Search */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <i className="fas fa-search text-[#28B463]"></i>
                </div>
                <input
                  type="text"
                  placeholder="Search clients by name, email, or consultation type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#28B463]/30 focus:border-[#28B463] transition-all"
                />
              </div>
            </div>
            <div className="md:w-56">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#28B463]/30 focus:border-[#28B463] appearance-none bg-white cursor-pointer transition-all font-medium"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <i className="fas fa-chevron-down text-[#28B463]"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Clients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <div 
              key={client.id} 
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl hover:border-[#28B463] transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
            >
              <div className="flex items-start gap-4 mb-4">
                {/* Enhanced Profile Image with Gradient Border */}
                <div className="shrink-0">
                  <img
                    src={client.profileImage}
                    alt={client.name}
                    className="w-16 h-16 rounded-full border-4 border-[#28B463] shadow-md object-cover"
                  />
                </div>

                {/* Name and Status */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-lg font-bold text-[#1E6F5C] truncate">
                      {client.name}
                    </h3>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm shrink-0 ${getStatusColor(client.status)}`}>
                      {client.status}
                    </span>
                  </div>

                  {/* Consultation Type */}
                  <p className="text-sm text-[#28B463] font-semibold flex items-center gap-1.5 mb-3">
                    <i className="fas fa-stethoscope text-xs"></i>
                    {client.consultationType}
                  </p>

                  {/* Contact Info */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                      <i className="fas fa-envelope w-4 text-[#28B463]"></i>
                      <span className="truncate text-gray-700 font-medium">{client.email}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                      <i className="fas fa-phone w-4 text-[#28B463]"></i>
                      <span className="text-gray-700 font-medium">{client.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                      <i className="fas fa-map-marker-alt w-4 text-[#28B463]"></i>
                      <span className="truncate text-gray-700 font-medium">{client.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Section */}
              <div className="mt-auto pt-4 border-t-2 border-gray-100">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-[#E8F5E9] rounded-xl p-3 border border-[#28B463]/30">
                    <div className="text-xs text-gray-700 font-medium mb-1">Next Appointment</div>
                    <div className="font-bold text-[#1E6F5C] text-sm truncate">
                      {client.nextAppointment || 'Not scheduled'}
                    </div>
                  </div>
                  <div className="bg-[#FFF9E6] rounded-xl p-3 border border-[#E8B86D]/30">
                    <div className="text-xs text-gray-700 font-medium mb-1">Sessions</div>
                    <div className="font-bold text-[#1E6F5C] text-xl">{client.totalSessions}</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleViewDetails(client)}
                    className="flex-1 px-4 py-2.5 bg-[#28B463] text-white text-sm rounded-xl hover:bg-[#1E6F5C] transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-calendar-check"></i>
                    <span>View Details</span>
                  </button>
                  <button className="px-4 py-2.5 bg-white border-2 border-[#E8B86D] text-[#1E6F5C] text-sm rounded-xl hover:bg-[#FFF9E6] hover:border-[#E8B86D] transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center">
                    <i className="fas fa-comments"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-300 shadow-lg col-span-full">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <i className="fas fa-users text-4xl text-gray-400"></i>
              </div>
              <h3 className="text-2xl font-bold text-[#1E6F5C] mb-3">
                No clients found
              </h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'All' 
                  ? "Try adjusting your search terms or filters." 
                  : "You haven't received any client bookings yet."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Client Details Modal */}
      {showClientModal && selectedClient && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Modal Header with Gradient */}
            <div className="bg-[#28B463] px-8 py-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <div className="relative flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <i className="fas fa-user text-2xl text-white"></i>
                  </div>
                  <h2 className="text-2xl font-bold text-white">Client Details</h2>
                </div>
                <button
                  onClick={() => setShowClientModal(false)}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl text-white text-2xl flex items-center justify-center transition-all duration-200 hover:rotate-90"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                {/* Profile Header */}
                <div className="flex items-center gap-6 pb-6 border-b-2 border-gray-100">
                  <img
                    src={selectedClient.profileImage}
                    alt={selectedClient.name}
                    className="w-28 h-28 rounded-full border-4 border-[#28B463] shadow-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold text-[#1E6F5C] mb-2">
                      {selectedClient.name}
                    </h3>
                    <p className="text-lg text-[#28B463] font-semibold flex items-center gap-2 mb-1">
                      <i className="fas fa-stethoscope"></i>
                      {selectedClient.consultationType}
                    </p>
                    <span className={`inline-block mt-2 px-4 py-1.5 text-sm font-semibold rounded-full shadow-sm ${getStatusColor(selectedClient.status)}`}>
                      {selectedClient.status}
                    </span>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                      <i className="fas fa-envelope text-[#28B463]"></i>
                      Email
                    </p>
                    <p className="font-semibold text-gray-900 truncate">{selectedClient.email}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                      <i className="fas fa-phone text-[#28B463]"></i>
                      Phone
                    </p>
                    <p className="font-semibold text-gray-900">{selectedClient.phone}</p>
                  </div>
                  <div className="bg-[#E8F5E9] rounded-xl p-4 border border-[#28B463]/30">
                    <p className="text-sm text-gray-700 mb-1 flex items-center gap-2">
                      <i className="fas fa-birthday-cake text-[#28B463]"></i>
                      Age
                    </p>
                    <p className="font-bold text-[#1E6F5C] text-xl">{selectedClient.age} years</p>
                  </div>
                  <div className="bg-[#E8F5E9] rounded-xl p-4 border border-[#28B463]/30">
                    <p className="text-sm text-gray-700 mb-1 flex items-center gap-2">
                      <i className="fas fa-map-marker-alt text-[#28B463]"></i>
                      Location
                    </p>
                    <p className="font-bold text-[#1E6F5C] text-sm truncate">{selectedClient.location}</p>
                  </div>
                  <div className="bg-[#FFF9E6] rounded-xl p-4 border border-[#E8B86D]/30">
                    <p className="text-sm text-gray-700 mb-1 flex items-center gap-2">
                      <i className="fas fa-history text-[#E8B86D]"></i>
                      Total Sessions
                    </p>
                    <p className="font-bold text-[#1E6F5C] text-2xl">{selectedClient.totalSessions}</p>
                  </div>
                  <div className="bg-[#FFF9E6] rounded-xl p-4 border border-[#E8B86D]/30">
                    <p className="text-sm text-gray-700 mb-1 flex items-center gap-2">
                      <i className="fas fa-clock text-[#E8B86D]"></i>
                      Last Consultation
                    </p>
                    <p className="font-bold text-[#1E6F5C] text-sm">{selectedClient.lastConsultation || 'N/A'}</p>
                  </div>
                </div>

                {/* Next Appointment Highlight */}
                <div className="bg-[#E8F5E9] rounded-xl p-6 border-2 border-[#28B463]">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-[#28B463] rounded-lg flex items-center justify-center">
                      <i className="fas fa-calendar-alt text-white"></i>
                    </div>
                    <p className="text-sm font-semibold text-[#1E6F5C]">Next Appointment</p>
                  </div>
                  <p className="font-bold text-[#1E6F5C] text-2xl">{selectedClient.nextAppointment || 'Not scheduled'}</p>
                </div>

                {/* Health Goals */}
                <div className="bg-[#FFF9E6] rounded-xl p-5 border border-[#E8B86D]">
                  <p className="text-sm font-semibold text-[#1E6F5C] mb-3 flex items-center gap-2">
                    <i className="fas fa-bullseye"></i>
                    Health Goals
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {selectedClient.goals && selectedClient.goals.map((goal, i) => (
                      <span key={i} className="px-4 py-2 bg-[#28B463] text-white text-sm font-semibold rounded-full shadow-md">
                        <i className="fas fa-check-circle mr-1.5"></i>
                        {goal}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 flex gap-3">
                  <button
                    onClick={() => setShowClientModal(false)}
                    className="flex-1 px-6 py-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-300 font-semibold"
                  >
                    Close
                  </button>
                  <button className="px-6 py-4 bg-[#28B463] text-white rounded-xl hover:bg-[#1E6F5C] transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2">
                    <i className="fas fa-comments"></i>
                    <span>Send Message</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsList;