import { Routes, Route, Navigate } from 'react-router-dom';
import AdminHome from '../pages/HomePages/AdminHome';
import AdminDashboard from '../pages/Dashboards/Admin';

export default function AdminLayout() {
  return (
    <div className="p-6">
      <Routes>
        <Route index element={<Navigate to="home" replace />} />

        <Route path="home" element={<AdminHome />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        
        <Route path="*" element={<Navigate to="home" replace />} />
      </Routes>
    </div>
  );
}