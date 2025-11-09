import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RoleModal = () => {
  const navigate = useNavigate();
  const [showCorporateSubRoles, setShowCorporateSubRoles] = useState(false);
  const [isDeveloperMode, setIsDeveloperMode] = useState(false);

  useEffect(() => {
    console.log('[RoleModal] Component mounted');
    // Check for any existing role tokens
    const roles = ['user', 'dietitian', 'admin', 'organization', 'corporatepartner'];
    const hasAnyToken = roles.some(role => localStorage.getItem(`authToken_${role}`));
    console.log('[RoleModal] Existing token found:', hasAnyToken);
    
    // Check for developer mode
    const developerMode = localStorage.getItem('developerMode') === 'true';
    setIsDeveloperMode(developerMode);
  }, []);

  const roles = [
    { name: 'User', icon: 'fas fa-user', description: 'Log in to manage your personalized nutrition plan.', slug: 'user', dashboardRoute: '/user/home' },
    { name: 'Dietitian', icon: 'fas fa-user-md', description: 'Access your professional dashboard and connect with clients.', slug: 'dietitian', dashboardRoute: '/dietitian/home' },
    { name: 'Certifying Organization', icon: 'fas fa-building', description: 'Manage dietitian certifications and access corporate insights.', slug: 'organization', dashboardRoute: '/organization/home' },
    { name: 'Corporate Partner', icon: 'fas fa-building', description: 'Provide wellness solutions to your employees.', slug: 'corporatepartner', dashboardRoute: '/corporatepartner/home', hasSubRoles: true },
  ];

  // Get roles based on developer mode
  const getRoles = () => {
    if (isDeveloperMode) {
      return [
        { name: 'Admin', icon: 'fas fa-crown', description: 'Access administrative features and system management.', slug: 'admin', dashboardRoute: '/admin/home' }
      ];
    }
    return roles;
  };

  const corporateSubRoles = [
    { 
      name: 'Employee', 
      icon: 'fas fa-user-tie', 
      description: 'Access wellness services provided by your company.', 
      slug: 'user', 
      dashboardRoute: '/user/home',
      type: 'corporate_employee'
    },
    { 
      name: 'Administrator', 
      icon: 'fas fa-crown', 
      description: 'Manage your company\'s wellness program and employees.', 
      slug: 'corporatepartner', 
      dashboardRoute: '/corporatepartner/home',
      type: 'corporate_admin'
    },
  ];

  const verifyToken = async (token, role) => {
    try {
      const res = await fetch('/api/verify-token', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.status === 401) {
        localStorage.removeItem(`authToken_${role.slug}`);
        alert(`Session expired for ${role.name}`);
        navigate(`/signin?role=${role.slug}`);
        return false;
      }
      return true;
    } catch {
      localStorage.removeItem(`authToken_${role.slug}`);
      alert('Verification failed');
      navigate(`/signin?role=${role.slug}`);
      return false;
    }
  };

  const handleRoleClick = async (role) => {
    if (role.hasSubRoles) {
      setShowCorporateSubRoles(true);
      return;
    }

    const token = localStorage.getItem(`authToken_${role.slug}`);
    
    if (!token) {
      navigate(`/signin?role=${role.slug}`);
      return;
    }
    
    if (await verifyToken(token, role)) {
      navigate(role.dashboardRoute);
    }
  };

  const handleCorporateSubRoleClick = (subRole) => {
    const token = localStorage.getItem(`authToken_${subRole.slug}`);
    
    if (!token) {
      // Pass the corporate type as a query parameter
      navigate(`/signin?role=${subRole.slug}&corporateType=${subRole.type}`);
      return;
    }
    
    if (verifyToken(token, subRole)) {
      navigate(subRole.dashboardRoute);
    }
  };

  const handleClose = () => {
    if (showCorporateSubRoles) {
      setShowCorporateSubRoles(false);
    } else {
      navigate('/');
    }
  };

  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      <main className="flex-1 max-w-6xl mx-auto p-8 bg-cover bg-center min-h-screen">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl mx-auto border-4 border-[#28B463]">
          <div className="flex justify-end">
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-700 transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
          
          {showCorporateSubRoles ? (
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-[#1E6F5C] mb-4">Corporate Partner</h2>
              <p className="text-gray-600 mb-8">Are you an employee or administrator?</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {corporateSubRoles.map((subRole, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-6 rounded-lg border-2 border-[#28B463] cursor-pointer hover:bg-green-100 hover:border-[#28B463] active:bg-gray-200 transition-all duration-300"
                    onClick={() => handleCorporateSubRoleClick(subRole)}
                  >
                    <div className="text-4xl text-[#28B463] mb-2">
                      <i className={subRole.icon}></i>
                    </div>
                    <h3 className="text-lg font-semibold text-[#2C3E50]">{subRole.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{subRole.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-[#1E6F5C] mb-4">{isDeveloperMode ? 'Admin Access' : 'Choose Your Role'}</h2>
              <p className="text-gray-600 mb-8">{isDeveloperMode ? 'Access administrative features and system management.' : 'Select the role that best describes you to continue.'}</p>
              <div className={`grid gap-4 ${isDeveloperMode ? 'grid-cols-1 max-w-md mx-auto' : 'grid-cols-1 md:grid-cols-2'}`}>
                {getRoles().map((role, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-6 rounded-lg border-2 border-[#28B463] cursor-pointer hover:bg-green-100 hover:border-[#28B463] active:bg-gray-200 transition-all duration-300"
                    onClick={() => handleRoleClick(role)}
                  >
                    <div className="text-4xl text-[#28B463] mb-2">
                      <i className={role.icon}></i>
                    </div>
                    <h3 className="text-lg font-semibold text-[#2C3E50]">{role.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{role.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default RoleModal;