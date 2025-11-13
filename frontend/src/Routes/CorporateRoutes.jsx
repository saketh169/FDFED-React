import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { VerifyProvider } from '../contexts/VerifyContext';

import CorporateHome from '../pages/HomePages/CorporateHome';
import CorporateDashboard from '../pages/Dashboards/CorporatePartner';
import CorporateDocStatus from '../pages/Status/CorporateDocStatus';
//import CorporatePlansOffers from '../pages/CorporatePlansOffers';
import ChangePassword from '../pages/ChangePassword';
import EditProfile from '../pages/EditProfile';

import Blog from '../pages/Blog';
import Contact from '../pages/Contactus';


export default function CorporateRoutes() {
  return (
    <AuthProvider currentRole="corporatepartner">
      <div className="p-6">
        <Routes>
          <Route index element={<Navigate to="home" replace />} />

          {/* All routes are automatically protected by ProtectedProvider in Layout.jsx */}
          <Route path="home" element={<CorporateHome />} />
          <Route path="profile" element={<CorporateDashboard />} />
          <Route path="doc-status" element={<CorporateDocStatus/>} />
        
          <Route path="change-pass" element={<ChangePassword />} />
          <Route path="edit-profile" element={<EditProfile />} />

          {/* Verified Routes - Add when needed */}

          {/* Optional: Public pages */}
           <Route path="blog" element={<Blog/>} />
           <Route path="contact-us" element={<Contact/>} />
          
          <Route path="*" element={<Navigate to="home" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}