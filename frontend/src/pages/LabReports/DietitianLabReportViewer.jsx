import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthContext } from '../../hooks/useAuthContext';

const DietitianLabReportViewer = () => {
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuthContext();

  // State for lab reports and loading
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all client lab reports on component mount
  useEffect(() => {
    const fetchLabReports = async () => {
      if (!isAuthenticated || !token) {
        setError('Authentication required. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('/api/lab-reports/dietitian/all', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setReports(response.data.labReports || []);
      } catch (error) {
        console.error('Error fetching lab reports:', error);
        setError(error.response?.data?.message || error.message || 'Failed to load lab reports');
      } finally {
        setLoading(false);
      }
    };

    fetchLabReports();
  }, [token, isAuthenticated]);

  const handleViewReport = (reportId, fileName) => {
    // Open file in new tab
    window.open(`/uploads/lab-reports/${fileName}`, '_blank');
  };

  const handleDownloadReport = (reportId, fileName) => {
    // Create download link
    const link = document.createElement('a');
    link.href = `/uploads/lab-reports/${fileName}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpdateStatus = async (reportId, newStatus, notes = '') => {
    if (!isAuthenticated || !token) {
      alert('Authentication required. Please log in again.');
      return;
    }

    try {
      await axios.put(`/api/lab-reports/${reportId}/status`, {
        status: newStatus,
        notes: notes
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Update local state
      setReports(reports.map(report =>
        report._id === reportId
          ? { ...report, status: newStatus, notes: notes }
          : report
      ));

      alert(`Report status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update report status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading client lab reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-6xl text-red-400 mb-4"></i>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Back to Chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl p-6 md:p-10">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-green-700">
            Client Lab Reports
          </h1>
          <p className="text-gray-500 mt-2">
            View and manage lab reports submitted by your clients
          </p>
        </header>

        {reports.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-file-medical text-6xl text-gray-300 mb-4"></i>
            <p className="text-gray-500">No lab reports found from your clients.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reports.map((report) => (
              <div key={report._id} className="border border-gray-200 rounded-xl p-6 bg-gray-50">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {report.clientId?.name || report.clientName}
                    </h3>
                    <p className="text-gray-600">{report.clientId?.email || 'N/A'}</p>
                    <p className="text-gray-600">
                      Submitted on: {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600">
                      Categories: {report.submittedCategories.join(', ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <select
                      value={report.status}
                      onChange={(e) => handleUpdateStatus(report._id, e.target.value)}
                      className="px-3 py-1 rounded-full text-sm border border-gray-300 mb-2"
                    >
                      <option value="submitted">Submitted</option>
                      <option value="pending">Pending Review</option>
                      <option value="reviewed">Reviewed</option>
                    </select>
                    {report.reviewedBy && (
                      <p className="text-xs text-gray-500">
                        Reviewed by {report.reviewedBy.dietitianName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {report.uploadedFiles && report.uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <span className="text-sm font-medium">{file.originalName}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewReport(report._id, file.filename)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          <i className="fas fa-eye"></i> View
                        </button>
                        <button
                          onClick={() => handleDownloadReport(report._id, file.filename)}
                          className="text-green-600 hover:text-green-800 text-sm"
                        >
                          <i className="fas fa-download"></i> Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {report.notes && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      <strong>Dietitian Notes:</strong> {report.notes}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 mr-4"
          >
            Back to Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default DietitianLabReportViewer;
