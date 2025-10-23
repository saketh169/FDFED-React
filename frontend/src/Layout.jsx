import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserHome from './pages/HomePages/UserHome';
import AdminHome from './pages/HomePages/AdminHome';
import OrganizationHome from './pages/HomePages/OrganizationHome';
import CorporateHome from './pages/HomePages/CorporateHome';
import DietitianHome from './pages/HomePages/DietitianHome';

import UserDashboard from './pages/Dashboards/UserDashboard';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1">
        <Routes>
          <Route path="/user/home" element={<UserHome />} />
          <Route path="/admin/home" element={<AdminHome />} />
          <Route path="/organization/home" element={<OrganizationHome />} />
          <Route path="/corporatepartner/home" element={<CorporateHome />} />
          <Route path="/dietitian/home" element={<DietitianHome />} />
          <Route path="*" element={<div>Role Not Found</div>} />

          <Route path="/user/dashboard" element={<UserDashboard/>} />
        </Routes>
      </main>
    </div>
  );
};

export default Layout;