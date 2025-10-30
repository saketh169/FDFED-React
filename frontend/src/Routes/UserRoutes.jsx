import { Routes, Route, Navigate } from 'react-router-dom';

import UserHome from '../pages/HomePages/UserHome';
import UserDashboard from '../pages/Dashboards/User';

export default function UserRoutes() {
  return (
    <div className="p-6">
      <Routes>
        <Route index element={<Navigate to="home" replace />} />

        <Route path="home" element={<UserHome />} />
        <Route path="profile" element={<UserDashboard />} />
        
        {/* Add more /user/* routes here */}
        <Route path="*" element={<Navigate to="home" replace />} />
      </Routes>
    </div>
  );
}