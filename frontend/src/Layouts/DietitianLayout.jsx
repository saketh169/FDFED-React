import { Routes, Route, Navigate } from 'react-router-dom';
import DietitianHome from '../pages/HomePages/DietitianHome';
import DietitianDashboard from '../pages/Dashboards/Dietitian';

export default function DietitianLayout() {
  return (
    <div className="p-6">
      <Routes>
        <Route index element={<Navigate to="home" replace />} />

        <Route path="home" element={<DietitianHome />} />
        <Route path="dashboard" element={<DietitianDashboard />} />
        
        <Route path="*" element={<Navigate to="home" replace />} />
      </Routes>
    </div>
  );
}
