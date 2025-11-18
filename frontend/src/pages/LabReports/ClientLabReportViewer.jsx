import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Utensils, Heart, Activity, Pill, FileText, Eye, Download, Zap } from 'lucide-react';

const ClientLabReportViewer = () => {
  const { dietitianId } = useParams();
  const navigate = useNavigate();
  
  // Static data for demonstration - sorted by date (recent first)
  const [reports] = useState([
    {
      _id: '1',
      dateOfReport: '2024-11-15',
      createdAt: '2024-11-15T10:30:00Z',
      status: 'reviewed',
      meals: {
        data: { breakfast: 'Oatmeal with fruits', lunch: 'Grilled chicken salad', dinner: 'Fish with vegetables' },
        files: [{ filename: 'meal-plan.pdf', mimetype: 'application/pdf' }]
      },
      healthMetrics: {
        data: { weight: '70kg', height: '175cm', bloodPressure: '120/80' },
        files: [{ filename: 'health-metrics.jpg', mimetype: 'image/jpeg' }]
      },
      activity: {
        data: { exercise: '30 mins daily', steps: '8000 steps' },
        files: []
      },
      supplements: {
        data: { vitaminD: '1000 IU daily', omega3: '2g daily' },
        files: [{ filename: 'supplements-list.pdf', mimetype: 'application/pdf' }]
      },
      feedback: 'Great progress! Keep up the healthy eating habits.'
    },
    {
      _id: '2',
      dateOfReport: '2024-11-10',
      createdAt: '2024-11-10T14:20:00Z',
      status: 'pending',
      meals: {
        data: { breakfast: 'Smoothie', lunch: 'Quinoa bowl' },
        files: []
      },
      healthMetrics: {
        data: { weight: '65kg', bloodSugar: '95 mg/dL' },
        files: [{ filename: 'blood-test.pdf', mimetype: 'application/pdf' }]
      },
      activity: {
        data: { yoga: '45 mins', walking: '20 mins' },
        files: []
      },
      supplements: {
        data: {},
        files: []
      }
    }
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))); // Sort by recent first

  const [selectedReport, setSelectedReport] = useState(reports[0]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Zap className="w-4 h-4 text-yellow-500" />;
      case 'reviewed':
        return <FileText className="w-4 h-4 text-green-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'meals':
        return <Utensils className="w-5 h-5 text-emerald-600" />;
      case 'healthMetrics':
        return <Heart className="w-5 h-5 text-emerald-600" />;
      case 'activity':
        return <Activity className="w-5 h-5 text-emerald-600" />;
      case 'supplements':
        return <Pill className="w-5 h-5 text-emerald-600" />;
      default:
        return <FileText className="w-5 h-5 text-emerald-600" />;
    }
  };

  const formatCategoryName = (category) => {
    switch (category) {
      case 'meals':
        return 'Meals';
      case 'healthMetrics':
        return 'Health Metrics';
      case 'activity':
        return 'Activity';
      case 'supplements':
        return 'Supplements';
      default:
        return category;
    }
  };

  const renderCategoryCard = (category, data) => {
    if (!data || (!data.data && (!data.files || data.files.length === 0))) return null;

    return (
      <div key={category} className="bg-white rounded-lg border border-emerald-100 p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center mb-4">
          {getCategoryIcon(category)}
          <h3 className="text-lg font-semibold text-gray-800 ml-3 capitalize">
            {formatCategoryName(category)}
          </h3>
        </div>

        {data.data && Object.keys(data.data).length > 0 && (
          <div className="space-y-2 mb-4">
            {Object.entries(data.data).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center py-1">
                <span className="text-sm font-medium text-gray-600 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                </span>
                <span className="text-sm text-gray-800">{value}</span>
              </div>
            ))}
          </div>
        )}

        {data.files && data.files.length > 0 && (
          <div className="border-t border-emerald-50 pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files:</h4>
            <div className="space-y-2">
              {data.files.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-emerald-50 rounded p-2">
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 text-emerald-600 mr-2" />
                    <span className="text-sm text-gray-700">{file.filename}</span>
                    <span className="text-xs text-gray-500 ml-2">({file.mimetype})</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-emerald-600 hover:text-emerald-800 text-sm">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-emerald-600 hover:text-emerald-800 text-sm">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 to-teal-50 pt-0 pb-6 px-6">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl border-2 border-emerald-200 overflow-hidden">
        <header className="flex items-center justify-between bg-linear-to-r from-emerald-500 to-teal-600 text-white p-6">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-emerald-700 text-white rounded-xl hover:bg-emerald-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
          >
            Back to Chat
          </button>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">
              My Lab Reports
            </h1>
            <p className="text-emerald-100 text-lg">
              View and manage your submitted lab reports
            </p>
          </div>
          <button
            onClick={() => navigate(`/user/submit-lab-report/${dietitianId}`)}
            className="px-4 py-2 bg-emerald-700 text-white rounded-xl hover:bg-emerald-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
          >
            Submit New Report
          </button>
        </header>

        {reports.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
            <p className="text-teal-900 text-lg font-bold">No lab reports found.</p>
            <p className="text-emerald-600 mt-2">Submit your first lab report to get started.</p>
            <button
              onClick={() => navigate(`/user/submit-lab-report/${dietitianId}`)}
              className="mt-4 px-6 py-2 bg-linear-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 shadow-lg font-semibold"
            >
              Submit New Report
            </button>
          </div>
        ) : (
          <div className="flex gap-6 p-6">
            {/* Left Sidebar - List of submissions */}
            <div className="w-80 bg-white shadow-xl h-[calc(100vh-300px)] overflow-y-auto p-4 border-r-2 border-emerald-200 rounded-tr-2xl rounded-br-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-linear-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <i className="fas fa-file-medical text-white text-lg"></i>
                </div>
                <h3 className="text-lg font-bold text-teal-900">My Submissions ({reports.length})</h3>
              </div>
              <div className="border-t-2 border-emerald-200 mb-4"></div>
              <div className="space-y-3">
                {reports.map((report) => (
                  <div
                    key={report._id}
                    onClick={() => setSelectedReport(report)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all duration-300 flex items-center gap-3 transform hover:scale-105 ${
                      selectedReport?._id === report._id
                        ? 'active shadow-lg border-emerald-300'
                        : 'hover:shadow-md border-gray-200'
                    }`}
                    style={{
                      color: selectedReport?._id === report._id ? 'white' : '#0F766E',
                      backgroundColor: selectedReport?._id === report._id ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : 'white',
                      borderLeft: selectedReport?._id === report._id ? `4px solid #34D399` : '2px solid #E5E7EB',
                      background: selectedReport?._id === report._id ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : 'white',
                    }}
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-emerald-100 rounded-lg">
                      {getStatusIcon(report.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-bold text-sm ${selectedReport?._id === report._id ? 'text-white' : 'text-teal-900'}`}>
                        Report Date: {new Date(report.dateOfReport).toLocaleDateString()}
                      </div>
                      <div className={`text-xs ${selectedReport?._id === report._id ? 'text-emerald-100' : 'text-gray-600'}`}>
                        Submitted: {new Date(report.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Main Panel - Broad view of selected report */}
            <div className="flex-1 bg-transparent p-6 overflow-y-auto">
              {selectedReport ? (
                <>
                  {/* Report Header */}
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-emerald-800 mb-2">
                      Lab Report - {new Date(selectedReport.dateOfReport).toLocaleDateString()}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-emerald-600">
                      <span>Submitted: {new Date(selectedReport.createdAt).toLocaleDateString()}</span>
                      <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${
                        selectedReport.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        selectedReport.status === 'reviewed' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {getStatusIcon(selectedReport.status)}
                        {selectedReport.status || 'Submitted'}
                      </span>
                    </div>
                  </div>

                  {/* Category Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {renderCategoryCard('meals', selectedReport.meals)}
                    {renderCategoryCard('healthMetrics', selectedReport.healthMetrics)}
                    {renderCategoryCard('activity', selectedReport.activity)}
                    {renderCategoryCard('supplements', selectedReport.supplements)}
                  </div>

                  {/* Dietitian Feedback Section */}
                  {selectedReport.feedback && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-blue-800 mb-4">
                        Dietitian Feedback
                      </h3>
                      <div className="text-blue-700">
                        <p>{selectedReport.feedback}</p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16">
                  <FileText className="w-12 h-12 text-emerald-300 mx-auto mb-4" />
                  <p className="text-emerald-700">Select a report from the sidebar to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientLabReportViewer;