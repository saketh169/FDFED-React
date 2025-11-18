import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ClientLabReportViewer = () => {
  const { dietitianId } = useParams();
  const navigate = useNavigate();
  
  // State for lab reports and loading
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch lab reports on component mount
  useEffect(() => {
    const fetchLabReports = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication required. Please log in again.');
        }

        const response = await axios.get('/api/lab-reports/my-reports', {
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
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your lab reports...</p>
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
            My Lab Reports
          </h1>
          <p className="text-gray-500 mt-2">
            View and download your submitted lab reports
          </p>
        </header>

        {reports.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-file-medical text-6xl text-gray-300 mb-4"></i>
            <p className="text-gray-500">No lab reports found.</p>
            <button
              onClick={() => navigate('/user/submit-lab-report')}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Submit New Report
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {reports.map((report) => (
              <div key={report._id} className="border border-gray-200 rounded-xl p-6 bg-gray-50">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Report Date: {new Date(report.createdAt).toLocaleDateString()}
                    </h3>
                    <p className="text-gray-600">
                      Submitted on: {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600">
                      Categories: {report.submittedCategories.join(', ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      report.status === 'reviewed' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {report.status === 'submitted' ? 'Submitted' : report.status}
                    </span>
                    {report.reviewedBy && (
                      <p className="text-xs text-gray-500 mt-1">
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
          <button
            onClick={() => navigate('/user/submit-lab-report')}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Submit New Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientLabReportViewer;