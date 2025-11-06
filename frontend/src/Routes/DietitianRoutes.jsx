import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../middleware/ProtectedRoute';

import DietitianHome from '../pages/HomePages/DietitianHome';
import DietitianDashboard from '../pages/Dashboards/Dietitian';
import DietitianSchedule from '../pages/Schedules/DietitanSchedule';
import DietitianSetup from '../pages/DietitianSetup';
import ChangePassword from '../pages/ChangePassword';
import EditProfile from '../pages/EditProfile';

import Blog from '../pages/Blog';
import Contact from '../pages/Contactus';



export default function DietitianRoutes() {
  return (
    <div className="p-6">
      <Routes>
        <Route index element={<Navigate to="home" replace />} />

        {/* Protected Routes - Require Dietitian Authentication */}
        <Route path="home" element={<ProtectedRoute element={<DietitianHome />} requiredRole="dietitian" />} />
        <Route path="profile" element={<ProtectedRoute element={<DietitianDashboard />} requiredRole="dietitian" />} />
        <Route path="schedule" element={<ProtectedRoute element={<DietitianSchedule/>} requiredRole="dietitian" />} />
        <Route path="setup" element={<ProtectedRoute element={<DietitianSetup/>} requiredRole="dietitian" />} />
              <Route element={<ProtectedRoute requiredRole="dietitian" />}>
        <Route path="/dietitian/change-pass" element={<ChangePassword />} />
      </Route>
        <Route path="edit-profile" element={<ProtectedRoute element={<EditProfile />} requiredRole="dietitian" />} />

        {/* Optional: Public pages */}
         <Route path="blog" element={<Blog/>} />
         <Route path="contact-us" element={<Contact/>} />
        
        <Route path="*" element={<Navigate to="home" replace />} />
      </Routes>
    </div>
  );
}
