import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Mock data for dietitians that a client has booked
const mockDietitians = [
  {
    id: '1',
    name: 'Dr. Priya Sharma',
    specialization: 'Weight Management & Nutrition',
    experience: '8 years',
    rating: 4.9,
    totalReviews: 156,
    consultationFee: 75,
    nextAppointment: '2025-11-15 10:00 AM',
    status: 'Active',
    profileImage: 'https://via.placeholder.com/80x80/10B981/ffffff?text=PS',
    location: 'New York, NY',
    languages: ['English', 'Hindi'],
    qualifications: 'RD, CDN, MS in Nutrition',
    lastConsultation: '2025-11-08',
    totalSessions: 5,
    upcomingSessions: 3,
    consultationMode: 'Both Online & Offline'
  },
  {
    id: '2',
    name: 'Dr. James Wilson',
    specialization: 'Sports Nutrition & Fitness',
    experience: '12 years',
    rating: 4.8,
    totalReviews: 203,
    consultationFee: 90,
    nextAppointment: '2025-11-18 2:30 PM',
    status: 'Active',
    profileImage: 'https://via.placeholder.com/80x80/059669/ffffff?text=JW',
    location: 'Los Angeles, CA',
    languages: ['English'],
    qualifications: 'RD, CSSD, PhD in Exercise Physiology',
    lastConsultation: '2025-11-10',
    totalSessions: 8,
    upcomingSessions: 2,
    consultationMode: 'Online Preferred'
  },
  {
    id: '3',
    name: 'Dr. Maria Gonzalez',
    specialization: 'Diabetes & Metabolic Health',
    experience: '10 years',
    rating: 4.9,
    totalReviews: 178,
    consultationFee: 85,
    nextAppointment: '2025-11-20 11:15 AM',
    status: 'Active',
    profileImage: 'https://via.placeholder.com/80x80/047857/ffffff?text=MG',
    location: 'Chicago, IL',
    languages: ['English', 'Spanish'],
    qualifications: 'RD, CDE, MS in Clinical Nutrition',
    lastConsultation: '2025-11-12',
    totalSessions: 6,
    upcomingSessions: 4,
    consultationMode: 'Both Online & Offline'
  },
  {
    id: '4',
    name: 'Dr. Ahmed Hassan',
    specialization: 'Cardiac Nutrition & Heart Health',
    experience: '15 years',
    rating: 4.7,
    totalReviews: 142,
    consultationFee: 95,
    nextAppointment: '2025-11-22 9:00 AM',
    status: 'Pending',
    profileImage: 'https://via.placeholder.com/80x80/065F46/ffffff?text=AH',
    location: 'Houston, TX',
    languages: ['English', 'Arabic'],
    qualifications: 'RD, LD, PhD in Cardiovascular Nutrition',
    lastConsultation: null,
    totalSessions: 0,
    upcomingSessions: 1,
    consultationMode: 'Online Only'
  }
];

const DietitiansList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Filter dietitians based on search and status
  const filteredDietitians = mockDietitians.filter(dietitian => {
    const matchesSearch = dietitian.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dietitian.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dietitian.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || dietitian.status === statusFilter;

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

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star text-yellow-400"></i>);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt text-yellow-400"></i>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star text-gray-300"></i>);
    }

    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="relative">
            <button
              onClick={() => navigate('/user/dietitian-profiles')}
              className="absolute left-0 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <i className="fas fa-plus mr-2"></i>
              New Consultations
            </button>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-emerald-600">My Dietitians</h1>
              <p className="text-gray-600 mt-1">Manage your consultations and appointments</p>
            </div>
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
                  placeholder="Search dietitians by name, specialization, or location..."
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

        {/* Dietitians Grid */}
        <div className="space-y-6">
          {filteredDietitians.map((dietitian) => (
            <div key={dietitian.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
                {/* Profile Image */}
                <div className="shrink-0">
                  <img
                    src={dietitian.profileImage}
                    alt={dietitian.name}
                    className="w-20 h-20 rounded-full border-4 border-emerald-100"
                  />
                </div>

                {/* Main Info */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{dietitian.name}</h3>
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(dietitian.status)}`}>
                          {dietitian.status}
                        </span>
                      </div>
                      <p className="text-emerald-600 font-medium mb-2">{dietitian.specialization}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <i className="fas fa-map-marker-alt mr-1 text-gray-400"></i>
                          {dietitian.location}
                        </div>
                        <div className="flex items-center">
                          <i className="fas fa-clock mr-1 text-gray-400"></i>
                          {dietitian.experience} exp.
                        </div>
                        <div className="flex items-center">
                          <span className="flex mr-1">{renderStars(dietitian.rating)}</span>
                          <span className="font-medium">{dietitian.rating}</span>
                          <span className="text-gray-400">({dietitian.totalReviews})</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-left md:text-right">
                      <div className="text-2xl font-bold text-emerald-600 mb-1">
                        ${dietitian.fees}
                      </div>
                      <div className="text-sm text-gray-500">per consultation</div>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-500 mb-1">Next Appointment</div>
                      <div className="font-medium text-emerald-600">
                        {dietitian.nextAppointment || 'Not scheduled'}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-500 mb-1">Total Sessions</div>
                      <div className="font-medium text-gray-900">{dietitian.totalSessions}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-500 mb-1">Upcoming</div>
                      <div className="font-medium text-blue-600">{dietitian.upcomingSessions} sessions</div>
                    </div>
                  </div>

                  {/* Qualifications and Languages */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {dietitian.qualifications}
                    </span>
                    {dietitian.languages.map((lang, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                        {lang}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium">
                      <i className="fas fa-calendar-check mr-2"></i>
                      Book Next Session
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <i className="fas fa-comments mr-2"></i>
                      Message
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      <i className="fas fa-user-md mr-2"></i>
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDietitians.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-200">
            <div className="max-w-md mx-auto">
              <div className="text-4xl mb-4 text-gray-400">
                <i className="fas fa-user-md"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">No dietitians found</h3>
              <p className="text-gray-600">Try adjusting your search terms or filters.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DietitiansList;