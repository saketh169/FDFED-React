import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Filter clients based on search and status
  const filteredClients = mockClients.filter(client => {
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
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search clients by name, email, or consultation type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
                <i className="fas fa-search absolute right-4 top-1/2 transform -translate-y-1/2 text-emerald-600"></i>
              </div>
            </div>
            <div className="md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Clients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <div key={client.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <img
                  src={client.profileImage}
                  alt={client.name}
                  className="w-12 h-12 rounded-full shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{client.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(client.status)}`}>
                      {client.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <i className="fas fa-envelope w-4 mr-2 text-gray-400"></i>
                      <span className="truncate">{client.email}</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-phone w-4 mr-2 text-gray-400"></i>
                      <span>{client.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-map-marker-alt w-4 mr-2 text-gray-400"></i>
                      <span className="truncate">{client.location}</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-stethoscope w-4 mr-2 text-gray-400"></i>
                      <span>{client.consultationType}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <span className="text-gray-500">Next Appointment:</span>
                        <div className="font-medium text-emerald-600">
                          {client.nextAppointment || 'Not scheduled'}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-gray-500">Sessions:</span>
                        <div className="font-medium text-gray-900">{client.totalSessions}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <button className="flex-1 px-3 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors">
                      <i className="fas fa-calendar-check mr-1"></i>
                      View Details
                    </button>
                    <button className="px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors">
                      <i className="fas fa-comments"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-200">
            <div className="max-w-md mx-auto">
              <div className="text-4xl mb-4 text-gray-400">
                <i className="fas fa-users"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">No clients found</h3>
              <p className="text-gray-600">Try adjusting your search terms or filters.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientsList;