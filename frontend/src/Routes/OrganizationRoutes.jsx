import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../middleware/ProtectedRoute';

import OrganizationHome from '../pages/HomePages/OrganizationHome';
import OrganizationDashboard from '../pages/Dashboards/Organization';
import ChangePassword from '../pages/ChangePassword';
import EditProfile from '../pages/EditProfile';

export default function OrganizationRoutes() {
  return (
    <div className="p-6">
      <Routes>
        <Route index element={<Navigate to="home" replace />} />

        {/* Protected Routes - Require Organization Authentication */}
        <Route path="home" element={<ProtectedRoute element={<OrganizationHome />} requiredRole="organization" />} />
        <Route path="profile" element={<ProtectedRoute element={<OrganizationDashboard />} requiredRole="organization" />} />
              <Route element={<ProtectedRoute requiredRole="organization" />}>
        <Route path="/organization/change-pass" element={<ChangePassword />} />
      </Route>
        <Route path="edit-profile" element={<ProtectedRoute element={<EditProfile />} requiredRole="organization" />} />
        
        <Route path="*" element={<Navigate to="home" replace />} />
      </Routes>
    </div>
  );
}