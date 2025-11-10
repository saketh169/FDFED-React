import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
};

const mockRemovedAccounts = [
    { id: 'r1', name: 'Zoe Deleted', email: 'zoe@old.com', phone: '1112223333', accountType: 'User', removedOn: '2024-10-01' },
    { id: 'r2', name: 'Dr. Removed', email: 'removed@old.com', phone: '4445556666', accountType: 'Dietitian', removedOn: '2024-10-15' },
];

// --- Helper Functions ---

const handleAlert = (message) => {
    // Replaces the native alert() function
    console.log(`ALERT: ${message}`);
    alert(message); 
};

// --- UI Components ---

// Component for rendering a single table row's actions
const UserActions = ({ id, type, onView, onShowRemove, onSoftDelete }) => (
    <td className="text-center px-4">
        <div className="flex items-center justify-center space-x-2">
            {/* View Button */}
            <button
                className="group relative p-2 rounded-lg bg-green-50 hover:bg-green-100 border border-green-200 hover:border-green-300 transition-all duration-200 shadow-sm hover:shadow-md"
                onClick={() => onView(id, type)}
                title="View Details"
            >
                <i className="fas fa-eye text-green-600 group-hover:text-green-700 text-sm"></i>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    View Details
                </div>
            </button>

            {/* Soft Delete Button */}
            <button
                className="group relative p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 hover:border-emerald-300 transition-all duration-200 shadow-sm hover:shadow-md"
                onClick={() => onSoftDelete(id, type)}
                title="Soft Delete"
            >
                <i className="fas fa-archive text-emerald-600 group-hover:text-emerald-700 text-sm"></i>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    Soft Delete
                </div>
            </button>

            {/* Remove Button */}
            <button
                className="group relative p-2 mr-2 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 transition-all duration-200 shadow-sm hover:shadow-md"
                onClick={() => onShowRemove(id, type)}
                title="Remove Account"
            >
                <i className="fas fa-trash-alt text-red-600 group-hover:text-red-700 text-sm"></i>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    Remove Account
                </div>
            </button>
        </div>
    </td>
);

// Component for rendering a removed account's actions
const RemovedActions = ({ id, type, onView, onShowRestore }) => (
    <td className="text-center px-4">
        <div className="flex items-center justify-center space-x-2">
            {/* View Button */}
            <button
                className="group relative p-2 rounded-lg bg-green-50 hover:bg-green-100 border border-green-200 hover:border-green-300 transition-all duration-200 shadow-sm hover:shadow-md"
                onClick={() => onView(id, type)}
                title="View Details"
            >
                <i className="fas fa-eye text-green-600 group-hover:text-green-700 text-sm"></i>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    View Details
                </div>
            </button>

            {/* Restore Button */}
            <button
                className="group relative p-2 rounded-lg bg-teal-50 hover:bg-teal-100 border border-teal-200 hover:border-teal-300 transition-all duration-200 shadow-sm hover:shadow-md"
                onClick={() => onShowRestore(id, type)}
                title="Restore Account"
            >
                <i className="fas fa-undo text-teal-600 group-hover:text-teal-700 text-sm"></i>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    Restore Account
                </div>
            </button>
        </div>
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
    const [softDeleteDropdown, setSoftDeleteDropdown] = useState(null); // { id, type }
    const [isLoading, setIsLoading] = useState(true);

    const activeRolesList = useMemo(() => ['user', 'dietitian', 'organization', 'corporatepartner'], []);
    const removedRolesList = useMemo(() => ['user', 'dietitian', 'organization', 'corporatepartner'], []);
    
    // --- API Handlers ---

    // Generic fetch handler with error logging and status check
    const fetchData = useCallback(async (url, options = {}) => {
        const token = localStorage.getItem('authToken_admin');
        if (!token) {
            handleAlert('Admin authentication required. Please login again.');
            return [];
        }

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                ...options
            });

            const data = await response.json();
            if (!response.ok) {
                if (response.status === 401) {
                    handleAlert('Unauthorized. Redirecting to login.');
                    // navigate('/admin/login'); // Uncomment in real app
                    return [];
                }
                throw new Error(data.message || `API Error: ${response.status}`);
            }
            return data.data || data;
        } catch (error) {
            console.error("Fetch Error:", error);
            handleAlert(`Error fetching data: ${error.message}`);
            return [];
        }
    }, []);

    // Fetch all active users by role
    const fetchUsersByRole = useCallback(async (role) => {
        const endpoint = `/api/${role}-list`;
        return await fetchData(endpoint);
    }, [fetchData]);

    // Search users by role
    const searchUsersByRole = useCallback(async (role, query) => {
        const endpoint = `/api/${role}-list/search?q=${encodeURIComponent(query)}`;
        return await fetchData(endpoint);
    }, [fetchData]);

    // Fetch removed accounts
    const fetchRemovedAccountsData = useCallback(async (query = '') => {
        const endpoint = query ? `/api/removed-accounts/search?q=${encodeURIComponent(query)}` : '/api/removed-accounts';
        return await fetchData(endpoint);
    }, [fetchData]);

    // Remove a user
    const removeUserAPI = async (role, id) => {
        const token = localStorage.getItem('authToken_admin');
        try {
            const response = await fetch(`/api/${role}-list/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || `API Error: ${response.status}`);
            }
            return data;
        } catch (error) {
            console.error("Remove User Error:", error);
            throw error;
        }
    };

    // Restore a removed account
    const restoreAccountAPI = async (id) => {
        const token = localStorage.getItem('authToken_admin');
        try {
            const response = await fetch(`/api/removed-accounts/${id}/restore`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || `API Error: ${response.status}`);
            }
            return data;
        } catch (error) {
            console.error("Restore Account Error:", error);
            throw error;
        }
    };

    // --- Data Fetching Logic ---

    // Fetch all active users (real API calls)
    const fetchAllActiveUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const userData = await fetchUsersByRole('user');
            const dietitianData = await fetchUsersByRole('dietitian');
            const organizationData = await fetchUsersByRole('organization');
            const corporatePartnerData = await fetchUsersByRole('corporatepartner');

            setUsers({
                user: userData,
                dietitian: dietitianData,
                organization: organizationData,
                corporatepartner: corporatePartnerData,
                _isSearchResult: false // Clear search flag for fresh data
            });
        } catch (error) {
            console.error('Error fetching active users:', error);
            handleAlert('Failed to load active users. Using sample data.');
            // Fallback to mock data if API fails
            setUsers(mockAllUsers);
        } finally {
            setIsLoading(false);
        }
    }, [fetchUsersByRole]);

    // Fetch removed accounts (real API call)
    const fetchRemovedAccounts = useCallback(async () => {
        try {
            const removedData = await fetchRemovedAccountsData();
            setRemovedAccounts(removedData);
        } catch (error) {
            console.error('Error fetching removed accounts:', error);
            handleAlert('Failed to load removed accounts. Using sample data.');
            // Fallback to mock data
            setRemovedAccounts(mockRemovedAccounts);
        }
    }, [fetchRemovedAccountsData]);

    useEffect(() => {
        fetchAllActiveUsers();
        fetchRemovedAccounts();
    }, [fetchAllActiveUsers, fetchRemovedAccounts]);

    // --- Action Handlers ---

    const handleActionConfirm = (id, type, action) => {
        setConfirmAction({ id, type, action });
        setExpandedDetails(null); 
    };
    
    const handleActionExecute = async () => {
        if (!confirmAction) return;

        const { action, type, id } = confirmAction;
        let successMessage = '';
        
        if (action === 'remove') {
            try {
                await removeUserAPI(type, id);
                successMessage = `${type.charAt(0).toUpperCase() + type.slice(1)} removed successfully!`;
            } catch (error) {
                handleAlert(`Failed to remove ${type}: ${error.message}`);
                return;
            }
        } else if (action === 'restore') {
            try {
                const result = await restoreAccountAPI(id);
                const passwordMsg = result.data.passwordRestored 
                    ? ' Original password has been restored.' 
                    : ' A temporary password has been set.';
                successMessage = `${type.charAt(0).toUpperCase() + type.slice(1)} restored successfully!${passwordMsg}`;
            } catch (error) {
                handleAlert(`Failed to restore ${type}: ${error.message}`);
                return;
            }
        } else {
            return;
        }

        handleActionCancel(); // Close confirmation dialogue

        try {
            handleAlert(successMessage);
            // Clear search terms and refresh data sets to ensure fresh data
            setSearchTerm('');
            setRemovedSearchTerm('');
            await Promise.all([fetchAllActiveUsers(), fetchRemovedAccounts()]);
        } catch (err) {
            handleAlert(`Operation completed but failed to refresh data: ${err.message}`);
        }
    };

    const handleActionCancel = () => {
        setConfirmAction(null);
    };

    const handleViewDetails = (id, type) => {
        // Handle removed accounts specially
        const key = type.startsWith('removed-') ? `removed-${id}` : `${type}-${id}`;
        setExpandedDetails(expandedDetails === key ? null : key);
        setConfirmAction(null); // Close any active confirmation dialogues
    };

    const handleSoftDelete = (id, type) => {
        // Actually perform soft delete instead of showing dropdown
        handleActionConfirm(id, type, 'remove');
    };

    const handleCloseSoftDeleteDropdown = () => {
        setSoftDeleteDropdown(null);
    };

    // --- Search and Filter Logic ---

    // Handle search for active users
    const handleActiveSearch = async () => {
        if (!searchTerm.trim()) {
            await fetchAllActiveUsers(); // Reload all data if search is empty
            return;
        }

        setIsLoading(true);
        try {
            const userData = searchTerm ? await searchUsersByRole('user', searchTerm) : await fetchUsersByRole('user');
            const dietitianData = searchTerm ? await searchUsersByRole('dietitian', searchTerm) : await fetchUsersByRole('dietitian');
            const organizationData = searchTerm ? await searchUsersByRole('organization', searchTerm) : await fetchUsersByRole('organization');
            const corporatePartnerData = searchTerm ? await searchUsersByRole('corporatepartner', searchTerm) : await fetchUsersByRole('corporatepartner');

            // Store search results separately to avoid conflicts with full data refresh
            setUsers({
                user: userData,
                dietitian: dietitianData,
                organization: organizationData,
                corporatepartner: corporatePartnerData,
                _isSearchResult: true // Flag to indicate this is search results
            });
        } catch (error) {
            console.error('Error searching active users:', error);
            handleAlert('Failed to search users. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle search for removed accounts
    const handleRemovedSearch = async () => {
        try {
            const removedData = await fetchRemovedAccountsData(removedSearchTerm);
            setRemovedAccounts(removedData);
        } catch (error) {
            console.error('Error searching removed accounts:', error);
            handleAlert('Failed to search removed accounts. Please try again.');
        }
    };

    const filteredActiveUsers = users; // Now handled by API calls
    const filteredRemovedAccounts = removedAccounts; // Now handled by API calls


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
                {(type === 'organization' || type === 'corporatepartner') && <p><strong>Address:</strong> {user.address || 'N/A'}</p>}
            </div>
        );

        return (
            <table className="min-w-full divide-y divide-gray-200 shadow-md rounded-lg overflow-hidden border-collapse">
                <thead style={{ backgroundColor: THEME.primary }} className="text-white">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border-r border-gray-300">Name / ID</th>
                        <th className="pl-2 pr-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider w-48">Actions</th>
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
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">{user.name}</td>
                                        <UserActions 
                                            id={user._id} 
                                            type={type} 
                                            onView={handleViewDetails} 
                                            onShowRemove={(id, type) => handleActionConfirm(id, type, 'remove')}
                                            onSoftDelete={handleSoftDelete}
                                        />
                                    </tr>
                                    {isExpanded && (
                                        <tr><td colSpan="2" className="px-6 py-0"><RoleDetails user={user} /></td></tr>
                                    )}
                                    {isConfirm && (
                                        <tr>
                                            <td colSpan="2" className="px-6 py-2">
                                                <div className="bg-red-50 border border-red-200 p-4 rounded-lg shadow-sm">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            <i className="fas fa-exclamation-triangle text-red-500 mr-3 text-lg"></i>
                                                            <p className="text-red-700 text-sm font-medium">Are you sure you want to remove this account?</p>
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={handleActionCancel}
                                                                className="px-3 py-1.5 text-gray-600 bg-white hover:bg-gray-50 border border-gray-300 rounded-md text-xs font-medium transition-colors duration-200"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                onClick={handleActionExecute}
                                                                className="px-3 py-1.5 text-white bg-red-600 hover:bg-red-700 rounded-md text-xs font-medium transition-colors duration-200"
                                                            >
                                                                <i className="fas fa-trash-alt mr-1"></i>
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                    {softDeleteDropdown === `${type}-${user._id}` && (
                                        <tr>
                                            <td colSpan="2" className="px-6 py-2">
                                                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg shadow-sm">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center mb-3">
                                                                <i className="fas fa-archive text-emerald-600 mr-3 text-lg"></i>
                                                                <h4 className="text-sm font-semibold text-gray-900">Soft Delete Account</h4>
                                                            </div>
                                                            <p className="text-gray-600 text-sm mb-3">
                                                                Are you sure you want to soft delete this account? The account will be moved to removed accounts and can be restored later.
                                                            </p>
                                                            <div className="bg-white p-3 rounded-md border border-emerald-100">
                                                                <div className="grid grid-cols-1 gap-1 text-sm">
                                                                    <div className="flex justify-between">
                                                                        <span className="text-gray-500">Name:</span>
                                                                        <span className="font-medium text-gray-900">{user.name}</span>
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        <span className="text-gray-500">Email:</span>
                                                                        <span className="font-medium text-gray-900">{user.email}</span>
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        <span className="text-gray-500">Type:</span>
                                                                        <span className="font-medium text-gray-900">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col space-y-2 ml-4">
                                                            <button
                                                                onClick={handleCloseSoftDeleteDropdown}
                                                                className="px-3 py-1.5 text-gray-600 bg-white hover:bg-gray-50 border border-gray-300 rounded-md text-xs font-medium transition-colors duration-200"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    handleCloseSoftDeleteDropdown();
                                                                    handleActionConfirm(user._id, type, 'remove');
                                                                }}
                                                                className="px-3 py-1.5 text-white bg-emerald-600 hover:bg-emerald-700 rounded-md text-xs font-medium transition-colors duration-200"
                                                            >
                                                                <i className="fas fa-archive mr-1"></i>
                                                                Soft Delete
                                                            </button>
                                                        </div>
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
        const TypeDetails = ({ account }) => {
            // Use originalData if available, otherwise fall back to account data
            const originalData = account.originalData || account;
            
            return (
                <div className="p-3 text-sm text-gray-700 bg-red-50 rounded-lg border border-red-200">
                    <p><strong>Email:</strong> {account.email}</p>
                    <p><strong>Phone:</strong> {account.phone || 'N/A'}</p>
                    {type === 'user' && originalData.dob && <p><strong>DOB:</strong> {originalData.dob ? originalData.dob.split('T')[0] : 'N/A'}</p>}
                    {type === 'user' && originalData.gender && <p><strong>Gender:</strong> {originalData.gender || 'N/A'}</p>}
                    {type !== 'user' && originalData.age && <p><strong>Age:</strong> {originalData.age || 'N/A'}</p>}
                    {type === 'dietitian' && originalData.licenseNumber && <p><strong>License:</strong> {originalData.licenseNumber}</p>}
                    {(type === 'organization' || type === 'corporatepartner') && originalData.licenseNumber && <p><strong>License:</strong> {originalData.licenseNumber}</p>}
                    {(type === 'organization' || type === 'corporatepartner') && originalData.address && <p><strong>Address:</strong> {originalData.address || 'N/A'}</p>}
                    <p><strong>Removed On:</strong> {account.removedOn}</p>
                    <p><strong>Account Type:</strong> {account.accountType}</p>
                </div>
            );
        };

        return (
            <table className="min-w-full divide-y divide-red-200 shadow-md rounded-lg overflow-hidden border-collapse">
                <thead style={{ backgroundColor: THEME.danger }} className="text-white">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border-r border-gray-300">Name</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider w-32 border-r border-gray-300">Removed On</th>
                        <th className="pl-2 pr-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider w-48">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-red-200">
                    {data.filter(a => a.accountType.toLowerCase() === type).length === 0 ? (
                        <tr><td colSpan="3" className="px-6 py-4 text-center text-gray-500">No removed {type} accounts found.</td></tr>
                    ) : (
                        data.filter(a => a.accountType.toLowerCase() === type).map((account) => {
                            const isExpanded = expandedDetails === `removed-${account._id}`;
                            const isConfirm = confirmAction && confirmAction.id === account._id && confirmAction.type === type;
                            return (
                                <React.Fragment key={account._id}>
                                    <tr className="hover:bg-red-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">{account.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center border-r border-gray-200">{account.removedOn}</td>
                                        <RemovedActions 
                                            id={account._id} 
                                            type={type} 
                                            onView={(id, type) => handleViewDetails(id, `removed-${type}`)}
                                            onShowRestore={(id, type) => handleActionConfirm(id, type, 'restore')}
                                        />
                                    </tr>
                                    {isExpanded && (
                                        <tr><td colSpan="3" className="px-6 py-0"><TypeDetails account={account} /></td></tr>
                                    )}
                                    {isConfirm && (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-2">
                                                <div className="bg-lime-50 border border-lime-200 p-4 rounded-lg shadow-sm">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            <i className="fas fa-undo text-lime-600 mr-3 text-lg"></i>
                                                            <p className="text-lime-700 text-sm font-medium">Are you sure you want to restore this account?</p>
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={handleActionCancel}
                                                                className="px-3 py-1.5 text-gray-600 bg-white hover:bg-gray-50 border border-gray-300 rounded-md text-xs font-medium transition-colors duration-200"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                onClick={handleActionExecute}
                                                                className="px-3 py-1.5 text-white bg-lime-600 hover:bg-lime-700 rounded-md text-xs font-medium transition-colors duration-200"
                                                            >
                                                                <i className="fas fa-undo mr-1"></i>
                                                                Restore
                                                            </button>
                                                        </div>
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
                <h1 className="text-4xl font-extrabold text-center text-green-700 mb-8">Admin User Management</h1>

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
                            onClick={handleActiveSearch} 
                            style={{ backgroundColor: THEME.primary }}
                            className="text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity font-semibold"
                        >
                            <i className="fas fa-search"></i> Search
                        </button>
                        {users._isSearchResult && searchTerm && (
                            <button 
                                onClick={() => {
                                    setSearchTerm('');
                                    fetchAllActiveUsers();
                                }}
                                className="text-gray-600 bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-lg transition-colors font-semibold"
                            >
                                <i className="fas fa-times"></i> Clear
                            </button>
                        )}
                    </div>

                    {/* Active Role Button Group */}
                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                        {activeRolesList.map(role => (
                            <button
                                key={role}
                                onClick={() => { 
                                    setActiveRole(role); 
                                    setSearchTerm(''); // Clear search term when switching roles
                                    fetchAllActiveUsers(); // Reload data when switching roles
                                }}
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
                                {users._isSearchResult && searchTerm && (
                                    <span className="text-sm text-blue-600 ml-1">(filtered)</span>
                                )}
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
                            onClick={handleRemovedSearch} 
                            style={{ backgroundColor: THEME.danger }}
                            className="text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity font-semibold"
                        >
                            <i className="fas fa-search"></i> Search
                        </button>
                        {removedSearchTerm && (
                            <button 
                                onClick={() => {
                                    setRemovedSearchTerm('');
                                    fetchRemovedAccounts();
                                }}
                                className="text-gray-600 bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-lg transition-colors font-semibold"
                            >
                                <i className="fas fa-times"></i> Clear
                            </button>
                        )}
                    </div>

                    {/* Removed Role Button Group */}
                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                        {removedRolesList.map(role => (
                            <button
                                key={`removed-${role}`}
                                onClick={() => { 
                                    setRemovedRole(role); 
                                    setRemovedSearchTerm(''); // Clear search term when switching roles
                                    fetchRemovedAccounts(); // Reload data when switching roles
                                }}
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
