import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../middleware/ProtectedRoute';

import CorporateHome from '../pages/HomePages/CorporateHome';
import CorporateDashboard from '../pages/Dashboards/CorporatePartner';

import Blog from '../pages/Blog';
import Contact from '../pages/Contactus';


export default function CorporateRoutes() {
  return (
    <div className="p-6">
      <Routes>
        <Route index element={<Navigate to="home" replace />} />

        {/* Protected Routes - Require Corporate Partner Authentication */}
        <Route path="home" element={<ProtectedRoute element={<CorporateHome />} requiredRole="corporatepartner" />} />
        <Route path="profile" element={<ProtectedRoute element={<CorporateDashboard />} requiredRole="corporatepartner" />} />

        {/* Optional: Public pages */}
         <Route path="blog" element={<Blog/>} />
         <Route path="contact-us" element={<Contact/>} />
        
        <Route path="*" element={<Navigate to="home" replace />} />
      </Routes>
    </div>
  );
}