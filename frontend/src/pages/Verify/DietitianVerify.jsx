import React, { useState, useEffect, useCallback } from 'react'

// --- Configuration and Data (Replicated from HTML) ---
const FIELD_MAP = {
  resume: {
    name: 'Resume',
    ext: 'pdf',
    icon: 'fas fa-file-alt',
    isImage: false
  },
  degree_certificate: {
    name: 'Degree Certificate',
    ext: 'pdf',
    icon: 'fas fa-graduation-cap',
    isImage: false
  },
  license_document: {
    name: 'License Document',
    ext: 'pdf',
    icon: 'fas fa-id-card',
    isImage: false
  },
  id_proof: {
    name: 'ID Proof',
    ext: 'pdf',
    icon: 'fas fa-user',
    isImage: false
  },
  experience_certificates: {
    name: 'Experience Certificates',
    ext: 'pdf',
    icon: 'fas fa-briefcase',
    isImage: false,
    optional: true
  },
  specialization_certifications: {
    name: 'Specialization Certifications',
    ext: 'pdf',
    icon: 'fas fa-certificate',
    isImage: false,
    optional: true
  },
  internship_certificate: {
    name: 'Internship Certificate',
    ext: 'pdf',
    icon: 'fas fa-certificate',
    isImage: false,
    optional: true
  },
  research_papers: {
    name: 'Research Papers',
    ext: 'pdf',
    icon: 'fas fa-book',
    isImage: false,
    optional: true
  },
  finalReport: {
    name: 'Final Report',
    ext: 'pdf',
    icon: 'fas fa-file-alt',
    isImage: false
  }
}

const STATUS_ICONS = {
  'Not Received': 'hourglass-half',
  Received: 'hourglass-half',
  Verified: 'check-circle',
  Rejected: 'times-circle',
  Pending: 'hourglass-half',
  'Not Uploaded': 'minus-circle'
}

// --- Mock Data Setup ---
const mockDietitiansData = [
  {
    _id: 'd001',
    name: 'Dr. Jane Doe',
    verificationStatus: {
      resume: 'Received',
      degree_certificate: 'Pending',
      license_document: 'Verified',
      id_proof: 'Rejected',
      experience_certificates: 'Not Uploaded',
      specialization_certifications: 'Received',
      internship_certificate: 'Not Uploaded',
      research_papers: 'Not Uploaded',
      finalReport: 'Received' // Indicates admin uploaded report but hasn't finalized
    },
    fileData: {
      // Mock file data (Base64 is a large string placeholder)
      resume: { base64: 'base64_data_res', mime: 'application/pdf' },
      specialization_certifications: {
        base64: 'base64_data_spec',
        mime: 'application/pdf'
      },
      finalReport: { base64: 'base64_data_final', mime: 'application/pdf' }
    }
  },
  {
    _id: 'd002',
    name: 'Dr. John Smith',
    verificationStatus: {
      resume: 'Verified',
      degree_certificate: 'Verified',
      license_document: 'Verified',
      id_proof: 'Verified',
      experience_certificates: 'Verified',
      specialization_certifications: 'Verified',
      internship_certificate: 'Verified',
      research_papers: 'Verified',
      finalReport: 'Verified'
    }
  },
  {
    _id: 'd003',
    name: 'Sara Connor',
    verificationStatus: {
      resume: 'Not Uploaded',
      degree_certificate: 'Not Uploaded',
      license_document: 'Not Uploaded',
      id_proof: 'Not Uploaded',
      experience_certificates: 'Not Uploaded',
      specialization_certifications: 'Not Uploaded',
      internship_certificate: 'Not Uploaded',
      research_papers: 'Not Uploaded',
      finalReport: 'Not Received'
    }
  }
]

// --- Utility Components (Simplified Notifications & Modals) ---
// Removed as they are now inlined in the JSX

// --- Main React Component ---

const DietitianVerify = () => {
  const [dietitians, setDietitians] = useState([])
  const [expandedRow, setExpandedRow] = useState(null)
  const [notification, setNotification] = useState(null)
  const [modal, setModal] = useState({
    active: false,
    message: '',
    onConfirm: () => {}
  })
  const [fileViewer, setFileViewer] = useState({ active: false, file: null })

  // --- State Handlers ---

  const handleNotify = (
    message,
    type = 'info',
    duration = 5000,
    isFinalReject = false
  ) => {
    setNotification({ message, type, isFinalReject })
    setTimeout(() => setNotification(null), duration)
  }

  const handleConfirm = (message, action) => {
    setModal({
      active: true,
      message,
      onConfirm: () => {
        action()
        setModal({ active: false, message: '', onConfirm: () => {} })
      }
    })
  }

  const closeFileViewer = () => setFileViewer({ active: false, file: null })
  const toggleDocumentDetails = rowId =>
    setExpandedRow(expandedRow === rowId ? null : rowId)

  // --- Mock API/Action Handlers ---

  const fetchDietitians = useCallback(() => {
    // In a real app: fetch from API
    // Filter out fileData for table view for simplicity (as it's huge)
    setDietitians(
      mockDietitiansData.map((d, index) => ({ ...d, rowId: index + 1 }))
    )
  }, [])

  useEffect(() => {
    fetchDietitians()
  }, [fetchDietitians])

  const findDietitian = id => dietitians.find(d => d._id === id)

  const updateStatusLocally = (dietitianId, field, status) => {
    setDietitians(prev =>
      prev.map(d => {
        if (d._id === dietitianId) {
          return {
            ...d,
            verificationStatus: { ...d.verificationStatus, [field]: status }
          }
        }
        return d
      })
    )
  }

  const verifyDocument = (dietitianId, field) => {
    // In a real app: POST to /approve endpoint
    handleConfirm(`Confirm verification for ${FIELD_MAP[field].name}?`, () => {
      updateStatusLocally(dietitianId, field, 'Verified')
      handleNotify(`Document ${FIELD_MAP[field].name} verified.`, 'success')
    })
  }

  const rejectDocument = (dietitianId, field) => {
    // In a real app: POST to /disapprove endpoint
    handleConfirm(`Confirm rejection for ${FIELD_MAP[field].name}?`, () => {
      updateStatusLocally(dietitianId, field, 'Rejected')
      handleNotify(`Document ${FIELD_MAP[field].name} rejected.`, 'error')
    })
  }

  const finalVerify = dietitianId => {
    // In a real app: POST to /final-approve endpoint
    handleConfirm(
      'Are you sure you want to **finally approve** this dietitian?',
      () => {
        updateStatusLocally(dietitianId, 'finalReport', 'Verified')
        handleNotify('Dietitian has been finally approved!', 'success')
        // Re-fetch or update table to show global status change
        fetchDietitians()
      }
    )
  }

  const finalReject = dietitianId => {
    // In a real app: POST to /final-disapprove endpoint
    handleConfirm(
      'Are you sure you want to **finally reject** this dietitian?',
      () => {
        updateStatusLocally(dietitianId, 'finalReport', 'Rejected')
        handleNotify(
          'Dietitian has been finally rejected.',
          'error',
          5000,
          true
        )
        // Re-fetch or update table to show global status change
        fetchDietitians()
      }
    )
  }

  const handleFileUpload = (dietitianId, file) => {
    // In a real app: POST to /upload-report endpoint with FormData
    if (!file) return handleNotify('Please select a file to upload.', 'warning')

    // Mock file upload: Update status to 'Received' and mock fileData
    const reader = new FileReader()
    reader.onload = e => {
      const base64 = e.target.result.split(',')[1]
      const mime = file.type

      setDietitians(prev =>
        prev.map(d => {
          if (d._id === dietitianId) {
            return {
              ...d,
              verificationStatus: {
                ...d.verificationStatus,
                finalReport: 'Received'
              },
              fileData: { ...d.fileData, finalReport: { base64, mime } }
            }
          }
          return d
        })
      )
      handleNotify('Verification report uploaded successfully.', 'success')
    }
    reader.readAsDataURL(file)
  }

  const viewFile = (dietitianId, field) => {
    const dietitian = findDietitian(dietitianId)
    const file = dietitian?.fileData?.[field]

    if (!file || !file.base64) {
      return handleNotify('File is not uploaded or data is missing.', 'warning')
    }

    const dataUrl = `data:${file.mime};base64,${file.base64}`
    setFileViewer({ active: true, file: { dataUrl, mime: file.mime } })
  }

  const downloadFile = (dietitianId, field, fileName, fileExt) => {
    const dietitian = findDietitian(dietitianId)
    const file = dietitian?.fileData?.[field]

    if (!file || !file.base64) {
      return handleNotify('File is not uploaded or data is missing.', 'warning')
    }

    const dataUrl = `data:${file.mime};base64,${file.base64}`
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `${fileName}.${fileExt}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    handleNotify(`Starting download for ${fileName}.`, 'info')
  }

  // --- JSX Rendering Functions ---

  return (
    <div className='min-h-screen bg-gray-50 pb-8 px-4 sm:px-6 md:px-8 font-inter'>
      {/* Increased max-width to 7xl for a wider look (approx 80% on large screens) */}
      <div className='w-full max-w-7xl mx-auto'>
        <h1 className={`text-3xl sm:text-4xl font-extrabold text-[#1A4A40] text-center mb-8 pt-6`}>
          Dietitian Document Verification
        </h1>

        {/* Notification */}
        {notification && (
          <div
            className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg border-l-4 transition-all duration-500 transform w-full max-w-sm ${
              notification.type === 'success'
                ? 'bg-green-100 border-green-500 text-green-800'
                : notification.type === 'error'
                ? 'bg-red-100 border-red-500 text-red-800'
                : 'bg-blue-100 border-blue-500 text-blue-800'
            }`}
          >
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <i
                  className={`text-xl mr-3 ${
                    notification.type === 'success'
                      ? 'fa-check-circle'
                      : notification.type === 'error'
                      ? 'fa-exclamation-triangle'
                      : 'fa-info-circle'
                  }`}
                ></i>
                <p className='font-medium'>{notification.message}</p>
              </div>
              <button
                onClick={() => setNotification(null)}
                className='text-lg ml-4 text-gray-500 hover:text-gray-700'
              >
                <i className='fas fa-times'></i>
              </button>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {modal.active && (
          <div className='fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4'>
            <div className='bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full'>
              <h4 className={`text-2xl font-bold text-[#1A4A40] mb-4`}>
                Confirm Action
              </h4>
              <p
                className='text-gray-700 mb-6'
                dangerouslySetInnerHTML={{ __html: modal.message }}
              ></p>
              <div className='flex gap-4'>
                <button
                  className={`flex-1 bg-[#48BB78] text-white py-2 px-4 rounded-xl font-semibold hover:bg-[#27AE60] transition-all duration-300 shadow-md`}
                  onClick={modal.onConfirm}
                >
                  <i className='fas fa-check mr-2'></i> Yes, Proceed
                </button>
                <button
                  className='flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-xl font-semibold hover:bg-gray-400 transition-all duration-300 shadow-md'
                  onClick={() =>
                    setModal({
                      active: false,
                      message: '',
                      onConfirm: () => {}
                    })
                  }
                >
                  <i className='fas fa-times mr-2'></i> Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* File Viewer */}
        {fileViewer.active && (
          <div className='fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-2xl shadow-2xl max-w-full lg:max-w-5xl w-full mx-4 max-h-[95vh] flex flex-col'>
              <div className='p-4 border-b border-gray-200 flex justify-between items-center bg-[#f7f7f7] rounded-t-2xl'>
                <h3 className={`text-xl font-bold text-[#48BB78]`}>
                  Document Viewer
                </h3>
                <button
                  onClick={closeFileViewer}
                  className='text-gray-600 hover:text-red-500 transition-colors'
                >
                  <i className='fas fa-times text-2xl'></i>
                </button>
              </div>
              <div className='grow h-[75vh] p-4 overflow-y-auto'>
                {fileViewer.file?.mime?.startsWith('image/') ? (
                  <img
                    src={fileViewer.file.dataUrl}
                    alt='Document View'
                    className='w-full h-full object-contain mx-auto'
                  />
                ) : (
                  <iframe
                    src={fileViewer.file?.dataUrl}
                    title='Document Viewer'
                    className='w-full h-full border-none'
                    allow='fullscreen'
                  ></iframe>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className='bg-white rounded-2xl shadow-xl overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            {/* Updated Header BG to Lighter Green */}
            <thead className={`bg-[#27AE60] text-white`}>
              <tr>
                <th className='py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider min-w-[250px]'>
                  Dietitian Name
                </th>
                <th className='py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider min-w-[150px]'>
                  Overall Status
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {dietitians.map(d => {
                const overallStatus =
                  d.verificationStatus.finalReport || 'Not Received'
                const displayStatus =
                  overallStatus === 'Not Received' ? 'Pending' : overallStatus
                const statusColor =
                  overallStatus === 'Verified'
                    ? 'text-green-600'
                    : overallStatus === 'Rejected'
                    ? 'text-red-600'
                    : 'text-yellow-600'

                return (
                  <React.Fragment key={d._id}>
                    <tr
                      className='border-t border-b border-[#48BB78] hover:bg-green-100 cursor-pointer transition-colors duration-200'
                      onClick={() => toggleDocumentDetails(d.rowId)}
                    >
                      <td className='py-4 px-6 flex items-center'>
                        <i className={`fas fa-user-md text-lg mr-3 text-[#48BB78]`}></i>
                        {d.name}
                      </td>
                      <td className='py-4 px-6'>
                        <i
                          className={`fas fa-${STATUS_ICONS[overallStatus]} ${statusColor} mr-2`}
                        ></i>
                        <span className={`font-semibold ${statusColor}`}>
                          {displayStatus}
                        </span>
                      </td>
                    </tr>
                    {expandedRow === d.rowId && (
                      <tr>
                        <td colSpan='2' className='p-0'>
                          <div className='bg-gray-50 p-6'>
                            <h3 className={`text-xl font-bold text-[#48BB78] mb-4 flex items-center`}>
                              <i className='fas fa-folder-open mr-2'></i>
                              Documents Submitted by {d.name}
                            </h3>
                            <div className='space-y-4'>
                              {Object.keys(FIELD_MAP).map(field => {
                                const status =
                                  d.verificationStatus[field] ||
                                  (field === 'finalReport'
                                    ? 'Not Received'
                                    : 'Not Uploaded')
                                const fileExists =
                                  d.fileData?.[field] &&
                                  [
                                    'Received',
                                    'Pending',
                                    'Verified',
                                    'Rejected'
                                  ].includes(status)
                                const fieldInfo = FIELD_MAP[field]
                                const isOptional = fieldInfo.optional

                                return (
                                  <div
                                    key={field}
                                    className='bg-white p-4 rounded-lg shadow-sm border border-gray-100'
                                  >
                                    <div className='flex items-center justify-between flex-wrap gap-2'>
                                      {/* Document Name and Status */}
                                      <div className='flex items-center min-w-[30%]'>
                                        <i
                                          className={`${fieldInfo.icon} text-[#1A4A40] text-xl mr-3`}
                                        ></i>
                                        <div>
                                          <strong className='text-gray-800'>
                                            {fieldInfo.name}
                                          </strong>
                                          {isOptional && (
                                            <span className='text-sm text-gray-500 ml-2'>
                                              (Optional)
                                            </span>
                                          )}
                                        </div>
                                      </div>

                                      {/* Actions and Status Tag */}
                                      <div className='flex items-center gap-3'>
                                        {/* File Actions (View/Download) */}
                                        {fileExists ? (
                                          <>
                                            <button
                                              className={`text-[#48BB78] hover:text-[#1A4A40] transition-colors duration-200 text-sm font-medium`}
                                              onClick={e => {
                                                e.preventDefault()
                                                viewFile(d._id, field)
                                              }}
                                            >
                                              <i className='fas fa-eye mr-1'></i>{' '}
                                              View
                                            </button>
                                            <button
                                              className={`text-[#48BB78] hover:text-[#1A4A40] transition-colors duration-200 text-sm font-medium`}
                                              onClick={e => {
                                                e.preventDefault()
                                                downloadFile(
                                                  d._id,
                                                  field,
                                                  fieldInfo.name,
                                                  fieldInfo.ext
                                                )
                                              }}
                                            >
                                              <i className='fas fa-download mr-1'></i>{' '}
                                              Download
                                            </button>
                                          </>
                                        ) : (
                                          <span className='text-gray-500 text-sm'>
                                            {status === 'Not Uploaded'
                                              ? 'Not Uploaded'
                                              : 'Not Received'}
                                          </span>
                                        )}
                                        
                                        {/* Status Tag */}
                                        <span
                                          className={`px-3 py-1 rounded-full text-xs font-bold min-w-20 text-center ${
                                            status === 'Verified'
                                              ? 'bg-green-100 text-green-800'
                                              : status === 'Rejected'
                                              ? 'bg-red-100 text-red-800'
                                              : status === 'Received' || status === 'Pending'
                                              ? 'bg-yellow-100 text-yellow-800'
                                              : 'bg-gray-100 text-gray-800'
                                          }`}
                                        >
                                          {status}
                                        </span>

                                        {/* Verification Actions */}
                                        {status === 'Received' &&
                                          field !== 'finalReport' && (
                                            <div className='flex gap-2 ml-4'>
                                              <button
                                                className={`bg-[#48BB78] text-white px-3 py-1 rounded-lg hover:bg-[#1A4A40] transition-colors duration-200 text-sm font-semibold shadow-md`}
                                                onClick={() =>
                                                  verifyDocument(d._id, field)
                                                }
                                              >
                                                <i className='fas fa-check'></i> Verify
                                              </button>
                                              <button
                                                className='bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm font-semibold shadow-md'
                                                onClick={() =>
                                                  rejectDocument(d._id, field)
                                                }
                                              >
                                                <i className='fas fa-times'></i> Reject
                                              </button>
                                            </div>
                                          )}
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>

                            {/* Upload Report */}
                            <div className='mt-6 bg-white p-4 rounded-xl shadow-lg border border-green-100'>
                              <h4 className={`text-lg font-bold text-[#48BB78] mb-3 flex items-center border-b pb-2`}>
                                <i className='fas fa-upload mr-2'></i>
                                Upload Final Verification Report (.pdf only)
                              </h4>
                              <p className='text-sm text-gray-500 mb-3'>
                                Upload a detailed report before final approval or rejection.
                              </p>
                              <div className='flex flex-col sm:flex-row items-center gap-4'>
                                <input
                                  type='file'
                                  accept='.pdf'
                                  onChange={e =>
                                    handleFileUpload(d._id, e.target.files[0])
                                  }
                                  className='flex-1 p-2 w-full sm:w-auto border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27AE60] text-gray-700 bg-gray-50'
                                />
                              </div>
                            </div>

                            {/* Final Approval */}
                            <div className='mt-6 flex flex-col sm:flex-row gap-4'>
                              <button
                                className={`flex-1 bg-[#48BB78] text-white py-3 px-6 rounded-xl font-extrabold hover:bg-[#1A4A40] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg`}
                                onClick={() => finalVerify(d._id)}
                                disabled={
                                  ![
                                    'Received',
                                    'Verified',
                                    'Rejected'
                                  ].includes(d.verificationStatus.finalReport)
                                }
                              >
                                <i className='fas fa-check-circle mr-2'></i>{' '}
                                Final Approve
                              </button>
                              <button
                                className='flex-1 bg-red-500 text-white py-3 px-6 rounded-xl font-extrabold hover:bg-red-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg'
                                onClick={() => finalReject(d._id)}
                                disabled={
                                  ![
                                    'Received',
                                    'Verified',
                                    'Rejected'
                                  ].includes(d.verificationStatus.finalReport)
                                }
                              >
                                <i className='fas fa-times-circle mr-2'></i>{' '}
                                Final Reject
                              </button>
                            </div>
                          
                            <div className='mt-4 text-center border-b border-[#48BB78] pb-4'>
                              <button
                                className='text-gray-500 hover:text-gray-700 transition-colors duration-200'
                                onClick={() => toggleDocumentDetails(d.rowId)}
                              >
                                <i className='fas fa-times mr-1'></i> Close Details
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className='mt-8 text-center text-gray-600'>
          <p className='text-sm'>
            If you have any questions, please contact our support team at{' '}
            <a
              href='mailto:support@dietitianverify.com'
              className={`text-[#48BB78] hover:text-[#1A4A40] transition-colors duration-200 font-semibold`}
            >
              <i className='fas fa-envelope mr-1'></i> support@dietitianverify.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

export default DietitianVerify
