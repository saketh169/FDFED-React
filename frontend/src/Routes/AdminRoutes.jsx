import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../middleware/ProtectedRoute';

import AdminHome from '../pages/HomePages/AdminHome';
import AdminDashboard from '../pages/Dashboards/Admin';
import AdminManagement from '../pages/AdminManagement';
import OrgVerify from '../pages/Verify/OrgVeify'; 
import Analytics from '../pages/Analytics';

import ChangePassword from '../pages/ChangePassword';
import EditProfile from '../pages/EditProfile';


export default function AdminRoutes() {
  return (
    <div className="p-6">
      <Routes>
        <Route index element={<Navigate to="home" replace />} />

        {/* Protected Routes - Require Admin Authentication */}
        <Route path="home" element={<ProtectedRoute element={<AdminHome />} requiredRole="admin" />} />
        <Route path="profile" element={<ProtectedRoute element={<AdminDashboard />} requiredRole="admin" />} />
        <Route path="users" element={<ProtectedRoute element={<AdminManagement />} requiredRole="admin" />} />
        <Route path="analytics" element={<ProtectedRoute element={<Analytics/>} requiredRole="admin" />} />
        <Route path="verify-organizations" element={<ProtectedRoute element={<OrgVerify />} requiredRole="admin" />} /> 
        
        <Route path="change-pass" element={<ProtectedRoute element={<ChangePassword />} requiredRole="admin" />} />
        <Route path="edit-profile" element={<ProtectedRoute element={<EditProfile />} requiredRole="admin" />} />

        
        <Route path="*" element={<Navigate to="home" replace />} />
      </Routes>
    </div>
  );
}