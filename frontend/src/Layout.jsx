import { Outlet } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import UserLayout from './Layouts/UserLayout';
import AdminLayout from './Layouts/AdminLayout';
import OrganizationLayout from './Layouts/OrganizationLayout';
import CorporateLayout from './Layouts/CorporateLayout';
import DietitianLayout from './Layouts/DietitianLayout';

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