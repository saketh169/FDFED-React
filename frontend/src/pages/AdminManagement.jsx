import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// --- Global Constants ---
// Theme colors matching NutriConnect design
const THEME = {
  primary: '#1E6F5C',      // Dark Green (primary)
  secondary: '#28B463',    // Medium Green (accent)
  light: '#E8F5E9',        // Light Green background
  lightBg: '#F0F9F7',      // Very light green
  success: '#27AE60',      // Success green
  danger: '#DC3545',       // Red for delete/remove
  warning: '#FFC107',      // Yellow for warning
  info: '#17A2B8',         // Blue for info
  dark: '#2C3E50',         // Dark gray
  lightGray: '#F8F9FA',    // Light gray background
  borderColor: '#E0E0E0',  // Border color
};

// Bootstrap-compatible color classes
const COLORS = {
  primary: '#1E6F5C',
  secondary: '#28B463',
  success: '#27AE60',
  danger: '#DC3545',
  warning: '#FFC107',
  info: '#17A2B8',
  light: '#F8F9FA',
  dark: '#2C3E50',
};

// --- Mock API Response Structure (To define expected data shape) ---
const mockAllUsers = {
    'user': [
        { _id: 'u1', name: 'Alice Johnson', email: 'alice@client.com', phone: '1234567890', dob: '1990-05-15T00:00:00.000Z', gender: 'female', address: '101 Main St' },
        { _id: 'u2', name: 'Bob Smith', email: 'bob@client.com', phone: '9876543210', dob: '1985-11-22T00:00:00.000Z', gender: 'male', address: '202 Oak Ave' },
    ],
    'dietitian': [
        { _id: 'd1', name: 'Dr. Jane Doe', email: 'jane@dietitian.com', phone: '5551234567', age: 40, licenseNumber: 'DLN123456', verificationStatus: 'Verified' },
        { _id: 'd2', name: 'Mark Wilson', email: 'mark@dietitian.com', phone: '5559876543', age: 35, licenseNumber: 'DLN654321', verificationStatus: 'Pending' },
    ],
    'organization': [
        { _id: 'o1', name: 'Wellness Corp', email: 'admin@wellness.com', phone: '9991112222', licenseNumber: 'OLN000111', address: 'HQ Building' },
    ],
    'corporatepartner': [
        { _id: 'c1', name: 'Tech Health', email: 'hr@techhealth.com', phone: '8883334444', licenseNumber: 'CLN999888', address: 'Tech Park' },
    ],
    'admin': [
        { _id: 'a1', name: 'System Admin', email: 'admin@system.com', phone: '0000000000' },
    ],
};

const mockRemovedAccounts = [
    { id: 'r1', name: 'Zoe Deleted', email: 'zoe@old.com', phone: '1112223333', accountType: 'User', removedOn: '2024-10-01' },
    { id: 'r2', name: 'Dr. Removed', email: 'removed@old.com', phone: '4445556666', accountType: 'Dietitian', removedOn: '2024-10-15' },
];

const API_ROUTES = {
    // Active User Endpoints
    fetch: (role) => `/${role}-list`,
    search: (role, query) => `/${role}-list/search?q=${query}`,
    remove: (role, id) => `/${role}-list/${id}`, // DELETE
    
    // Removed Accounts Endpoints
    fetchRemoved: (query = '') => `/removed-accounts${query ? `/search?q=${query}` : ''}`,
    restore: (id) => `/removed-accounts/${id}/restore`, // POST
};

// --- Helper Functions ---

const handleAlert = (message) => {
    // Replaces the native alert() function
    console.log(`ALERT: ${message}`);
    alert(message); 
};

// --- UI Components ---

// Component for rendering a single table row's actions
const UserActions = ({ id, type, onView, onShowRemove }) => (
    <td className="text-end space-x-2">
        <button className="btn btn-info bg-success-subtle hover:bg-success text-success-emphasis border border-success-emphasis" onClick={() => onView(id, type)}>
            <i className="fas fa-eye text-lg"></i>
        </button>
        <button className="btn text-white bg-danger-subtle hover:bg-danger text-danger-emphasis border border-danger-emphasis" onClick={() => onShowRemove(id, type)}>
            <i className="fas fa-trash-alt text-lg"></i>
        </button>
    </td>
);

// Component for rendering a removed account's actions
const RemovedActions = ({ id, type, onView, onShowRestore }) => (
    <td className="text-end space-x-2">
        <button className="btn btn-info text-success-emphasis" onClick={() => onView(id, type)}>
            <i className="fas fa-eye text-lg"></i>
        </button>
        <button className="btn text-dark bg-warning hover:bg-yellow-600" onClick={() => onShowRestore(id, type)}>
            <i className="fas fa-undo text-lg"></i> Restore
        </button>
    </td>
);

// --- Main Component ---
const AdminManagement = () => {
    const navigate = useNavigate();
    const [activeRole, setActiveRole] = useState('user');
    const [removedRole, setRemovedRole] = useState('user');
    const [searchTerm, setSearchTerm] = useState('');
    const [removedSearchTerm, setRemovedSearchTerm] = useState('');
    const [users, setUsers] = useState({}); // { role: data[] }
    const [removedAccounts, setRemovedAccounts] = useState([]);
    const [expandedDetails, setExpandedDetails] = useState(null); // { id, type }
    const [confirmAction, setConfirmAction] = useState(null); // { id, type, action: 'remove' | 'restore' }
    const [isLoading, setIsLoading] = useState(true);

    const activeRolesList = useMemo(() => ['user', 'dietitian', 'admin', 'organization', 'corporatepartner'], []);
    const removedRolesList = useMemo(() => ['user', 'dietitian', 'admin', 'organization', 'corporatepartner'], []);
    
    // --- API Handlers (Simplified for Browser Environment) ---

    // Generic fetch handler with error logging and status check - can be used for real API calls
    // const fetchData = async (url) => {
    //     // Mock token for API authorization (replace with actual token retrieval)
    //     const token = localStorage.getItem('adminAuthToken') || 'MOCK_ADMIN_TOKEN'; 
    //     
    //     try {
    //         const response = await fetch(url, {
    //             method: 'GET',
    //             headers: { 
    //                 'Authorization': `Bearer ${token}`,
    //                 'Content-Type': 'application/json' 
    //             },
    //             credentials: 'include'
    //         });
    //
    //         const data = await response.json();
    //         if (!response.ok) {
    //             if (response.status === 401) {
    //                 handleAlert('Unauthorized. Redirecting to login.');
    //                 // navigate('/roles_signin'); // Uncomment in real app
    //                 return;
    //             }
    //             throw new Error(data.message || `API Error: ${response.status}`);
    //         }
    //         return data.data || data; // Assuming API returns { data: [...] }
    //     } catch (error) {
    //         console.error("Fetch Error:", error);
    //         handleAlert(`Error fetching data: ${error.message}`);
    //         return [];
    //     }
    // };

    // --- Data Fetching Logic ---

    // Fetch all active users (mocked for visualization)
    const fetchAllActiveUsers = async () => {
        setIsLoading(true);
        // In a real app, you'd fetch data for each role via their respective endpoints.
        // For demonstration, we use mock data.
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
        setUsers(mockAllUsers); 
        setIsLoading(false);
    };

    // Fetch removed accounts (mocked)
    const fetchRemovedAccounts = async () => {
        await new Promise(resolve => setTimeout(resolve, 500)); 
        setRemovedAccounts(mockRemovedAccounts);
    };

    useEffect(() => {
        fetchAllActiveUsers();
        fetchRemovedAccounts();
    }, []);

    // --- Action Handlers ---

    const handleActionConfirm = (id, type, action) => {
        setConfirmAction({ id, type, action });
        setExpandedDetails(null); 
    };
    
    const handleActionExecute = async () => {
        if (!confirmAction) return;

        const { action, type } = confirmAction;
        let successMessage = '';
        
        if (action === 'remove') {
            // const endpoint = API_ROUTES.remove(type, id);
            // const method = 'DELETE';
            successMessage = `${type.charAt(0).toUpperCase() + type.slice(1)} removed successfully!`;
        } else if (action === 'restore') {
            // const endpoint = API_ROUTES.restore(id);
            // const method = 'POST';
            successMessage = `${type.charAt(0).toUpperCase() + type.slice(1)} restored successfully!`;
        } else {
            return;
        }

        handleActionCancel(); // Close confirmation dialogue

        try {
            // Mock API call simulation
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // In a real application:
            // const response = await fetch(endpoint, { method, credentials: 'include' });
            // await handleResponse(response);
            
            handleAlert(successMessage);
            // Refresh data sets
            await Promise.all([fetchAllActiveUsers(), fetchRemovedAccounts()]);

        } catch (err) {
            handleAlert(`Operation failed: ${err.message}`);
        }
    };

    const handleActionCancel = () => {
        setConfirmAction(null);
    };

    const handleViewDetails = (id, type) => {
        const key = `${type}-${id}`;
        setExpandedDetails(expandedDetails === key ? null : key);
        setConfirmAction(null); // Close any active confirmation dialogues
    };

    // --- Search and Filter Logic ---

    const filteredActiveUsers = useMemo(() => {
        if (!searchTerm) return users;
        const lowerSearch = searchTerm.toLowerCase();
        
        // Filter users data based on role and search term
        const filtered = {};
        for (const roleKey of activeRolesList) {
            if (users[roleKey]) {
                filtered[roleKey] = users[roleKey].filter(user => 
                    user.name.toLowerCase().includes(lowerSearch) ||
                    user.email.toLowerCase().includes(lowerSearch)
                );
            }
        }
        return filtered;
    }, [users, searchTerm, activeRolesList]);

    const filteredRemovedAccounts = useMemo(() => {
        if (!removedSearchTerm) return removedAccounts;
        const lowerSearch = removedSearchTerm.toLowerCase();
        return removedAccounts.filter(account => 
            account.name.toLowerCase().includes(lowerSearch) ||
            account.email.toLowerCase().includes(lowerSearch)
        );
    }, [removedAccounts, removedSearchTerm]);


    // --- UI Renderers ---

    const renderUserTable = (data, type) => {
        const RoleDetails = ({ user }) => (
            <div className="p-3 text-sm text-gray-700 bg-gray-50 rounded-lg border border-gray-200">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {user.phone || 'N/A'}</p>
                {type === 'user' && <><p><strong>DOB:</strong> {user.dob ? user.dob.split('T')[0] : 'N/A'}</p><p><strong>Gender:</strong> {user.gender || 'N/A'}</p></>}
                {type !== 'user' && <><p><strong>Age:</strong> {user.age || 'N/A'}</p></>}
                {type === 'dietitian' && <p><strong>License:</strong> {user.licenseNumber}</p>}
                {(type === 'organization' || type === 'corporatepartner') && <p><strong>License:</strong> {user.licenseNumber}</p>}
                {(type === 'organization' || type === 'corporatepartner' || type === 'admin') && <p><strong>Address:</strong> {user.address || 'N/A'}</p>}
            </div>
        );

        return (
            <table className="min-w-full divide-y divide-gray-200 shadow-md rounded-lg overflow-hidden">
                <thead style={{ backgroundColor: THEME.primary }} className="text-white">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Name / ID</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider w-32">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.length === 0 ? (
                        <tr><td colSpan="2" className="px-6 py-4 text-center text-gray-500">No active {type} accounts found.</td></tr>
                    ) : (
                        data.map((user) => {
                            const isExpanded = expandedDetails === `${type}-${user._id}`;
                            const isConfirm = confirmAction && confirmAction.id === user._id && confirmAction.type === type;
                            return (
                                <React.Fragment key={user._id}>
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                        <UserActions 
                                            id={user._id} 
                                            type={type} 
                                            onView={handleViewDetails} 
                                            onShowRemove={(id, type) => handleActionConfirm(id, type, 'remove')}
                                        />
                                    </tr>
                                    {isExpanded && (
                                        <tr><td colSpan="2" className="px-6 py-0"><RoleDetails user={user} /></td></tr>
                                    )}
                                    {isConfirm && (
                                        <tr>
                                            <td colSpan="2" className="px-6 py-2">
                                                <div className="flex justify-between items-center bg-red-50 border border-red-200 p-3 rounded-lg">
                                                    <p className="text-red-700 text-sm">Are you sure you want to remove this account?</p>
                                                    <div className="space-x-2">
                                                        <button onClick={handleActionExecute} className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-full text-xs">Yes, Remove</button>
                                                        <button onClick={handleActionCancel} className="text-gray-700 bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-full text-xs">Cancel</button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })
                    )}
                </tbody>
            </table>
        );
    };
    
    const renderRemovedTable = (data, type) => {
        const TypeDetails = ({ account }) => (
            <div className="p-3 text-sm text-gray-700 bg-red-50 rounded-lg border border-red-200">
                <p><strong>Email:</strong> {account.email}</p>
                <p><strong>Phone:</strong> {account.phone || 'N/A'}</p>
                <p><strong>Type:</strong> {account.accountType}</p>
            </div>
        );

        return (
            <table className="min-w-full divide-y divide-red-200 shadow-md rounded-lg overflow-hidden">
                <thead style={{ backgroundColor: THEME.danger }} className="text-white">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-32">Removed On</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider w-32">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-red-200">
                    {data.filter(a => a.accountType.toLowerCase() === type).length === 0 ? (
                        <tr><td colSpan="3" className="px-6 py-4 text-center text-gray-500">No removed {type} accounts found.</td></tr>
                    ) : (
                        data.filter(a => a.accountType.toLowerCase() === type).map((account) => {
                            const isExpanded = expandedDetails === `removed-${account.id}`;
                            const isConfirm = confirmAction && confirmAction.id === account.id && confirmAction.type === type;
                            return (
                                <React.Fragment key={account.id}>
                                    <tr className="hover:bg-red-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{account.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{account.removedOn}</td>
                                        <RemovedActions 
                                            id={account.id} 
                                            type={type} 
                                            onView={(id, type) => handleViewDetails(`removed-${id}`, type)}
                                            onShowRestore={(id, type) => handleActionConfirm(id, type, 'restore')}
                                        />
                                    </tr>
                                    {isExpanded && (
                                        <tr><td colSpan="3" className="px-6 py-0"><TypeDetails account={account} /></td></tr>
                                    )}
                                    {isConfirm && (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-2">
                                                <div className="flex justify-between items-center bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                                                    <p className="text-yellow-700 text-sm">Are you sure you want to restore this account?</p>
                                                    <div className="space-x-2">
                                                        <button onClick={handleActionExecute} className="text-dark bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded-full text-xs">Yes, Restore</button>
                                                        <button onClick={handleActionCancel} className="text-gray-700 bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-full text-xs">Cancel</button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })
                    )}
                </tbody>
            </table>
        );
    };

    // --- Main Render ---
    return (
        <div className={`min-h-screen p-4 sm:p-8 bg-gray-100`}>
            {/* Back Button */}
            <div onClick={() => navigate(-1)} style={{ color: THEME.primary, cursor: 'pointer' }} className="fixed top-4 left-4 text-4xl hover:opacity-80 transition-opacity" onMouseEnter={(e) => e.currentTarget.style.color = THEME.dark} onMouseLeave={(e) => e.currentTarget.style.color = THEME.primary}>
                <i className="fa-solid fa-xmark"></i>
            </div>
            
            <div style={{ maxWidth: '100%', margin: '0 auto' }}>
                <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Admin User Management</h1>

                {/* --- 1. Active Users Container --- */}
                <div style={{ borderTopColor: THEME.primary }} className="bg-white p-6 rounded-xl shadow-2xl border-t-4 mb-8">
                    <h2 style={{ color: THEME.primary }} className="text-2xl font-bold mb-4">Active Accounts</h2>

                    {/* Search Bar */}
                    <div className="flex justify-center gap-4 mb-4">
                        <input
                            type="text"
                            placeholder={`Search by name or email...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full max-w-lg p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-colors"
                        />
                        <button 
                            onClick={() => setSearchTerm(searchTerm)} 
                            style={{ backgroundColor: THEME.primary }}
                            className="text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity font-semibold"
                        >
                            <i className="fas fa-search"></i> Search
                        </button>
                    </div>

                    {/* Active Role Button Group */}
                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                        {activeRolesList.map(role => (
                            <button
                                key={role}
                                onClick={() => { setActiveRole(role); setSearchTerm(''); }}
                                style={activeRole === role ? {
                                    backgroundColor: THEME.primary,
                                    color: 'white',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                                } : {
                                    backgroundColor: 'white',
                                    color: '#374151',
                                    borderColor: '#D1D5DB'
                                }}
                                className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border hover:bg-gray-100"
                            >
                                {role.charAt(0).toUpperCase() + role.slice(1)}s
                            </button>
                        ))}
                    </div>

                    {/* Total Count */}
                    <div className="text-center text-base font-medium text-gray-600 mb-4">
                        {activeRolesList.map(role => (
                            <span key={role} className="mx-2">
                                Total {role.charAt(0).toUpperCase() + role.slice(1)}s: 
                                <span className="font-bold text-gray-900 ml-1">
                                    {filteredActiveUsers[role]?.length || users[role]?.length || 0}
                                </span>
                            </span>
                        ))}
                    </div>

                    {/* Dynamic Active User Table */}
                    {isLoading ? (
                        <div className="text-center p-10 text-xl text-gray-500"><i className="fas fa-spinner fa-spin mr-2"></i> Loading Active Accounts...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            {renderUserTable(filteredActiveUsers[activeRole] || [], activeRole)}
                        </div>
                    )}
                </div>

                {/* --- 2. Removed Users Container --- */}
                <div style={{ borderTopColor: THEME.danger }} className="bg-white p-6 rounded-xl shadow-2xl border-t-4 mb-8">
                    <h2 style={{ color: THEME.danger }} className="text-2xl font-bold mb-4">Removed Accounts</h2>

                    {/* Search Bar for Removed Users */}
                    <div className="flex justify-center gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="Search removed users..."
                            value={removedSearchTerm}
                            onChange={(e) => setRemovedSearchTerm(e.target.value)}
                            className="w-full max-w-lg p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-colors"
                        />
                        <button 
                            onClick={() => setRemovedSearchTerm(removedSearchTerm)} 
                            style={{ backgroundColor: THEME.danger }}
                            className="text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity font-semibold"
                        >
                            <i className="fas fa-search"></i> Search
                        </button>
                    </div>

                    {/* Removed Role Button Group */}
                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                        {removedRolesList.map(role => (
                            <button
                                key={`removed-${role}`}
                                onClick={() => setRemovedRole(role)}
                                style={removedRole === role ? {
                                    backgroundColor: THEME.danger,
                                    color: 'white',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                                } : {
                                    backgroundColor: 'white',
                                    color: '#374151',
                                    borderColor: '#D1D5DB'
                                }}
                                className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border hover:bg-gray-100"
                            >
                                Removed {role.charAt(0).toUpperCase() + role.slice(1)}s
                            </button>
                        ))}
                    </div>

                    {/* Total Removed Count */}
                    <div className="text-center text-base font-medium text-gray-600 mb-4">
                        {removedRolesList.map(role => (
                            <span key={`removed-count-${role}`} className="mx-2">
                                Total Removed {role.charAt(0).toUpperCase() + role.slice(1)}s: 
                                <span className="font-bold text-red-600 ml-1">
                                    {filteredRemovedAccounts.filter(a => a.accountType.toLowerCase() === role).length}
                                </span>
                            </span>
                        ))}
                    </div>

                    {/* Dynamic Removed User Table */}
                    {isLoading ? (
                        <div className="text-center p-10 text-xl text-gray-500"><i className="fas fa-spinner fa-spin mr-2"></i> Loading Removed Accounts...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            {renderRemovedTable(filteredRemovedAccounts, removedRole)}
                        </div>
                    )}
                </div>
            </div>
            
            {/* API Route References (Commented for clarity) */}
            {/*
                // User/Client: /users-list, /users-list/search?q=..., /users-list/:id (DELETE)
                // Dietitian: /dietitian-list, /dietitian-list/search?q=..., /dietitian-list/:id (DELETE)
                // Admin/Org/Corp: Similar structure if deletion is required
                // Removed: /removed-accounts, /removed-accounts/search?q=..., /removed-accounts/:id/restore (POST)
            */}
        </div>
    );
};

export default AdminManagement;
