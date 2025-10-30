import { Routes, Route, Navigate } from 'react-router-dom';
import DietitianHome from '../pages/HomePages/DietitianHome';
import DietitianDashboard from '../pages/Dashboards/Dietitian';

export default function DietitianRoutes() {
  return (
    <div className="p-6">
      <Routes>
        <Route index element={<Navigate to="home" replace />} />

        <Route path="home" element={<DietitianHome />} />
        <Route path="profile" element={<DietitianDashboard />} />
        
        <Route path="*" element={<Navigate to="home" replace />} />
      </Routes>
    </div>
  );
}
