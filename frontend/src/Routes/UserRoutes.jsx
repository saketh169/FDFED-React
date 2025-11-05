import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../middleware/ProtectedRoute';

import UserHome from '../pages/HomePages/UserHome';
import UserSchedule from '../pages/Schedules/UserSchedule';

import UserDashboard from '../pages/Dashboards/User';
import UserProgress from '../pages/UserProgress'; 
import ChangePassword from '../pages/ChangePassword';
import EditProfile from '../pages/EditPassword';


import Chatbot from '../pages/Chatbot';
import Blog from '../pages/Blog';
import Contact from '../pages/Contactus';



export default function UserRoutes() {
  return (
    <div className="p-6">
      <Routes>
        <Route index element={<Navigate to="home" replace />} />

        {/* Protected Routes - Require User Authentication */}
        <Route path="home" element={<ProtectedRoute element={<UserHome />} requiredRole="user" />} />
        <Route path="profile" element={<ProtectedRoute element={<UserDashboard />} requiredRole="user" />} />
        <Route path="schedule" element={<ProtectedRoute element={<UserSchedule />} requiredRole="user" />} />
        <Route path="progress" element={<ProtectedRoute element={<UserProgress />} requiredRole="user" />} />  
        <Route path="change-pass" element={<ProtectedRoute element={<ChangePassword />} requiredRole="user" />} />
        <Route path="edit-profile" element={<ProtectedRoute element={<EditProfile />} requiredRole="user" />} />
        
        {/* Optional: Chatbot, Blog, Contact (can be public or protected) */}
        <Route path="blog" element={<Blog/>} />
        <Route path="contact-us" element={<Contact/>} />
        <Route path="chatbot" element={<Chatbot/>} />
        
        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="home" replace />} />
      </Routes>
    </div>
  );
}