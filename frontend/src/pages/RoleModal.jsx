import React from 'react';
import { useNavigate } from 'react-router-dom';

const RoleModal = () => {
  const navigate = useNavigate();

  const roles = [
    { name: 'User', icon: 'fas fa-user', description: 'Log in to manage your personalized nutrition plan.', slug: 'user' },
    { name: 'Dietitian', icon: 'fas fa-user-md', description: 'Access your professional dashboard and connect with clients.', slug: 'dietitian' },
    { name: 'Certifying Organization', icon: 'fas fa-building', description: 'Manage dietitian certifications and access corporate insights.', slug: 'organization' },
    { name: 'Corporate Partner', icon: 'fas fa-building', description: 'Provide wellness solutions to your employees.', slug: 'corporatepartner' },
  ];

  const handleRoleClick = (roleSlug) => {
    navigate(`/signin?role=${roleSlug}`, { state: { scrollToTop: true } });
  };

  const handleClose = () => {
    navigate('/');
  };

  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      <main className="flex-1 max-w-6xl mx-auto p-8 bg-cover bg-center min-h-screen">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl mx-auto border-2 border-[#E8F5E9]">
          <div className="flex justify-end">
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-700 transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1E6F5C] mb-4">Choose Your Role</h2>
            <p className="text-gray-600 mb-8">Select the role that best describes you to continue.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roles.map((role, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-6 rounded-lg border-2 border-[#E8F5E9] cursor-pointer hover:bg-green-100 hover:border-[#28B463] active:bg-gray-200 transition-all duration-300"
                  onClick={() => handleRoleClick(role.slug)}
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
        </div>
      </main>
    </>
  );
};

export default RoleModal;