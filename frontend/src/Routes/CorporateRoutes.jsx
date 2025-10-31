import { Routes, Route, Navigate } from 'react-router-dom';
import CorporateHome from '../pages/HomePages/CorporateHome';
import CorporateDashboard from '../pages/Dashboards/CorporatePartner';

import Blog from '../pages/Blog';
import Contact from '../pages/Contactus';


export default function CorporateRoutes() {
  return (
    <div className="p-6">
      <Routes>
        <Route index element={<Navigate to="home" replace />} />

        <Route path="home" element={<CorporateHome />} />
        <Route path="profile" element={<CorporateDashboard />} />

         <Route path="blog" element={<Blog/>} />
         <Route path="contact-us" element={<Contact/>} />
        
        <Route path="*" element={<Navigate to="home" replace />} />

        
      </Routes>
    </div>
  );
}