import { Routes, Route, Navigate } from 'react-router-dom';
import OrganizationHome from '../pages/HomePages/OrganizationHome';
import OrganizationDashboard from '../pages/Dashboards/Organization';

export default function OrganizationRoutes() {
  return (
    <div className="p-6">
      <Routes>
        <Route index element={<Navigate to="home" replace />} />

        <Route path="home" element={<OrganizationHome />} />
        <Route path="profile" element={<OrganizationDashboard />} />
        
        <Route path="*" element={<Navigate to="home" replace />} />
      </Routes>
    </div>
  );
}