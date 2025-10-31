import { Routes, Route, Navigate } from 'react-router-dom';
import DietitianHome from '../pages/HomePages/DietitianHome';
import DietitianDashboard from '../pages/Dashboards/Dietitian';

import Blog from '../pages/Blog';
import Contact from '../pages/Contactus';



export default function DietitianRoutes() {
  return (
    <div className="p-6">
      <Routes>
        <Route index element={<Navigate to="home" replace />} />

        <Route path="home" element={<DietitianHome />} />
        <Route path="profile" element={<DietitianDashboard />} />

         <Route path="blog" element={<Blog/>} />
         <Route path="contact-us" element={<Contact/>} />
        
        <Route path="*" element={<Navigate to="home" replace />} />
      </Routes>
    </div>
  );
}
