import { Outlet } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import UserLayout from './Routes/UserRoutes.jsx';
import AdminLayout from './Routes/AdminRoutes.jsx';
import OrganizationLayout from './Routes/OrganizationRoutes.jsx';
import CorporateLayout from './Routes/CorporateRoutes.jsx';
import DietitianLayout from './Routes/DietitianRoutes.jsx';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1">
        <Routes>
          <Route path="/user/*"          element={<UserLayout />} />
          <Route path="/admin/*"         element={<AdminLayout />} />
          <Route path="/organization/*"  element={<OrganizationLayout />} />
          <Route path="/corporatepartner/*" element={<CorporateLayout />} />
          <Route path="/dietitian/*"     element={<DietitianLayout />} />
          <Route path="*" element={<div>Role Not Found</div>} />
        </Routes>
      </main>
    </div>
  );
}