import { Routes, Route, Navigate } from 'react-router-dom';
import CorporateHome from '../pages/HomePages/CorporateHome';
import CorporateDashboard from '../pages/Dashboards/CorporatePartner';

export default function CorporateLayout() {
  return (
    <div className="p-6">
      <Routes>
        <Route index element={<Navigate to="home" replace />} />

        <Route path="home" element={<CorporateHome />} />
        <Route path="dashboard" element={<CorporateDashboard />} />
        
        <Route path="*" element={<Navigate to="home" replace />} />
      </Routes>
    </div>
  );
}