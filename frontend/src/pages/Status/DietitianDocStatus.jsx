import React, { useState, useEffect, useCallback } from 'react';

// NOTE: Assumes Font Awesome CSS is imported globally.

// --- Configuration and Data ---

const FIELD_MAP = {
    resume: { name: 'Professional Resume', icon: 'fas fa-file-alt' },
    degree_certificate: { name: 'Degree Certificate', icon: 'fas fa-graduation-cap' },
    license_document: { name: 'License Document', icon: 'fas fa-id-card' },
    id_proof: { name: 'Government ID Proof', icon: 'fas fa-user-shield' },
    experience_certificates: { name: 'Experience Certificates', icon: 'fas fa-briefcase' },
    specialization_certifications: { name: 'Specialization Certifications', icon: 'fas fa-certificate' },
    internship_certificate: { name: 'Internship Certificate', icon: 'fas fa-clipboard-check' },
    research_papers: { name: 'Research Publications', icon: 'fas fa-book-open' },
    finalReport: { name: 'Final Verification Report', icon: 'fas fa-file-contract' }
};

// Tailwind Color Mappings (Matching Home page theme)
const colors = {
    'primary-green': '#27AE60',
    'dark-green': '#1A4A40',
    'text-green': '#2F4F4F',
    'background-light': 'bg-gray-50',
    'card-bg': 'bg-white',
    'text-dark': 'text-gray-800',
    'text-light': 'text-gray-600',
};

// --- Utility Functions for Status Styling ---

const getStatusClass = (status) => {
    switch (status) {
        case 'Verified': return 'bg-green-100 text-green-600 border border-green-300';
        case 'Pending':
        case 'Received': return 'bg-blue-100 text-blue-600 border border-blue-300';
        case 'Rejected': return 'bg-red-100 text-red-600 border border-red-300';
        case 'Not Uploaded':
        case 'Not Received': return 'bg-gray-100 text-gray-500 border border-gray-300';
        default: return 'bg-gray-100 text-gray-500 border border-gray-300';
    }
};

const getStatusIcon = (status) => {
    switch (status) {
        case 'Verified': return 'fas fa-check-circle';
        case 'Pending': return 'fas fa-hourglass-half';
        case 'Rejected': return 'fas fa-times-circle';
        case 'Received': return 'fas fa-check-circle';
        default: return 'fas fa-minus-circle';
    }
};

// --- Main Component ---

const DietitianDocStatus = () => {
    // Only state needed for core functionality (data and loading)
    const [dietitian, setDietitian] = useState({ 
        name: 'Loading...', 
        verificationStatus: {},
        finalReport: null
    });
    const [isLoading, setIsLoading] = useState(true);

    // Placeholder functions for file actions
    const handleViewReport = (base64, mime) => {
        const dataUrl = `data:${mime};base64,${base64}`;
        window.open(dataUrl, '_blank');
    };

    const handleDownloadReport = (base64, name) => {
        const link = document.createElement('a');
        link.href = `data:application/pdf;base64,${base64}`;
        link.download = name || 'Final_Verification_Report.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Mock API call to fetch dietitian data
    const fetchDietitianDetails = useCallback(async () => {
        setIsLoading(true);
        // --- MOCK API DATA START ---
        await new Promise(resolve => setTimeout(resolve, 800));

        const mockDietitian = {
            name: 'Dr. Sarah Chen',
            email: 'sarah.chen@example.com',
            verificationStatus: {
                resume: 'Verified',
                degree_certificate: 'Pending',
                license_document: 'Received',
                id_proof: 'Rejected',
                experience_certificates: 'Verified',
                specialization_certifications: 'Not Uploaded',
                internship_certificate: 'Pending',
                research_papers: 'Not Uploaded',
                finalReport: 'Verified' // Set to Verified/Rejected/Pending to test actions
            },
            // Mock final report data (Base64 is a placeholder)
            finalReport: {
                base64: 'JVBERi0xLjQKJc... [MOCK BASE64 DATA]',
                mime: 'application/pdf',
                name: 'Dr_Sarah_Chen_Report'
            }
        };

        setDietitian(mockDietitian);
        setIsLoading(false);
        // --- MOCK API DATA END ---
    }, []);

    useEffect(() => {
        fetchDietitianDetails();
    }, [fetchDietitianDetails]);

    // Render list of individual documents
    const renderDocumentList = () => {
        if (isLoading) {
            return (
                <div className="p-6 text-center text-gray-500 animate-fade-in-up">
                    <i className="fas fa-spinner fa-spin text-3xl mb-4" style={{ color: colors['primary-green'] }}></i>
                    <p className="text-lg">Loading documents...</p>
                </div>
            );
        }

        const documentFields = Object.keys(FIELD_MAP).filter(field => field !== 'finalReport');

        return documentFields.map(field => {
            const status = dietitian.verificationStatus[field] || 'Not Uploaded';
            const fieldInfo = FIELD_MAP[field];
            const statusClass = getStatusClass(status);
            const statusIcon = getStatusIcon(status);

            return (
                <div
                    key={field}
                    className="flex items-center p-5 border-b border-gray-100 transition-all duration-300 hover:bg-gray-50 hover:shadow-sm"
                >
                    <div className="w-12 h-12 flex items-center justify-center rounded-lg shrink-0 mr-5" style={{ backgroundColor: 'rgba(39, 174, 96, 0.1)', color: colors['primary-green'] }}>
                        <i className={fieldInfo.icon}></i>
                    </div>
                    <div className="grow">
                        <h3 className={`m-0 text-base font-semibold ${colors['text-dark']}`}>
                            {fieldInfo.name}
                        </h3>
                    </div>
                    <div className="flex items-center text-sm font-medium">
                        <i className={`${statusIcon} mr-2 text-xl`} />
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClass}`}>
                            {status}
                        </span>
                    </div>
                </div>
            );
        });
    };

    // Render final report actions
    const renderFinalReportActions = () => {
        const finalStatus = dietitian.verificationStatus.finalReport || 'Not Received';
        const finalReportData = dietitian.finalReport;
        
        const statusElement = (
            <div className="flex justify-center items-center text-lg font-medium">
                <i className={`${getStatusIcon(finalStatus)} mr-3 text-2xl text-gray-600`}></i>
                <span className={`px-4 py-1 rounded-full text-sm font-semibold ${getStatusClass(finalStatus)}`}>
                    {finalStatus}
                </span>
            </div>
        );

        let actionsElement = null;

        if (finalReportData && finalReportData.base64 && finalStatus !== 'Not Received') {
            actionsElement = (
                <div className="flex justify-center gap-3 mt-4">
                    <button
                        className="px-4 py-2 rounded-full text-white font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                        style={{ backgroundColor: colors['primary-green'] }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = colors['dark-green']}
                        onMouseLeave={(e) => e.target.style.backgroundColor = colors['primary-green']}
                        onClick={() => handleViewReport(finalReportData.base64, finalReportData.mime)}
                    >
                        <i className="fas fa-eye mr-2"></i> View Report
                    </button>
                    <button
                        className="px-4 py-2 rounded-full text-white font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                        style={{ backgroundColor: '#8BC34A' }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#689F38'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#8BC34A'}
                        onClick={() => handleDownloadReport(finalReportData.base64, finalReportData.name)}
                    >
                        <i className="fas fa-download mr-2"></i> Download Report
                    </button>
                </div>
            );
        }

        if (finalStatus === 'Rejected') {
            actionsElement = (
                <div className="mt-4">
                    {actionsElement}
                    <a
                        href="/doc_dietitian_upload"
                        className="inline-block mt-3 px-4 py-2 rounded-full text-white font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                        style={{ backgroundColor: colors['dark-green'] }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = colors['primary-green']}
                        onMouseLeave={(e) => e.target.style.backgroundColor = colors['dark-green']}
                    >
                        <i className="fas fa-upload mr-2"></i> Re-upload Documents
                    </a>
                </div>
            );
        }

        return (
            <>
                <h3 className="text-xl font-semibold mb-4" style={{ color: colors['dark-green'] }}>
                    <i className="fas fa-file-contract mr-2"></i> Final Verification Status
                </h3>
                {statusElement}
                {actionsElement}
            </>
        );
    };

    return (
        <div className={`${colors['background-light']} min-h-screen py-12 px-4 sm:px-6 md:px-8`}>
            <style>{`
                @keyframes fadeInUp {
                    from {
                        transform: translateY(20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.6s ease-out;
                }
                .profile-icon { background: linear-gradient(135deg, #6ABF69, #27AE60); }
            `}</style>

            <div className="max-w-6xl mx-auto border-4 border-green-500 rounded-2xl p-6">
                {/* Profile Card */}
                <div className={`${colors['card-bg']} rounded-2xl shadow-md p-6 mb-8 flex items-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up`}>
                    <div className="profile-icon w-16 h-16 flex items-center justify-center rounded-full text-white text-3xl shrink-0 mr-5">
                        <i className="fas fa-user-md"></i>
                    </div>
                    <div>
                        <h2 className={`text-xl font-semibold ${colors['text-dark']} m-0`} style={{ color: colors['dark-green'] }}>
                            {dietitian.name}
                        </h2>
                        <p className={`${colors['text-light']} text-sm m-0`}>Professional Dietitian</p>
                    </div>
                </div>

                {/* Documents Status Card */}
                <div className={`${colors['card-bg']} rounded-2xl shadow-md overflow-hidden mb-8 animate-fade-in-up`}>
                    {renderDocumentList()}
                </div>

                {/* Final Report Status Card */}
                <div className={`${colors['card-bg']} rounded-2xl shadow-md p-6 text-center animate-fade-in-up`}>
                    {renderFinalReportActions()}
                </div>
            </div>
        </div>
    );
};

export default DietitianDocStatus;