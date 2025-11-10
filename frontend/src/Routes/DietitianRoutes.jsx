import { Routes, Route, Navigate } from 'react-router-dom';
import { VerifyProvider } from '../contexts/VerifyContext';

import DietitianHome from '../pages/HomePages/DietitianHome';
import DietitianDashboard from '../pages/Dashboards/Dietitian';
import DietitianSchedule from '../pages/Schedules/DietitanSchedule';
import DietitianSetup from '../pages/DietitianSetup';
import DietitianDocStatus from '../pages/Status/DietitianDocStatus';
import ChangePassword from '../pages/ChangePassword';
import EditProfile from '../pages/EditProfile';
import DietitianAddPlanForm from '../pages/MealPlans/DietitianAddPlanForm';

import Blog from '../pages/Blog';
import Contact from '../pages/Contactus';
import CreateBlog from '../pages/Blog/CreateBlog';
import BlogPost from '../pages/Blog/BlogPost';



export default function DietitianRoutes() {
  return (
    <div className="p-6">
      <Routes>
        <Route index element={<Navigate to="home" replace />} />

        {/* All routes are automatically protected by ProtectedProvider in Layout.jsx */}
        <Route path="home" element={<DietitianHome />} />
        <Route path="profile" element={<DietitianDashboard />} />
        <Route path="setup" element={<DietitianSetup/>} />
        <Route path="doc-status" element={<DietitianDocStatus/>} />
        <Route path="change-pass" element={<ChangePassword/>} />
        <Route path="edit-profile" element={<EditProfile />} />

        {/* Verified Routes - Require Dietitian Verification */}
        <Route
          path="schedule"
          element={
            <VerifyProvider requiredRole="dietitian" redirectTo="/dietitian/doc-status">
              <DietitianSchedule/>
            </VerifyProvider>
          } />
        <Route
          path="add-plans"
          element={
            <VerifyProvider requiredRole="dietitian" redirectTo="/dietitian/doc-status">
              <DietitianAddPlanForm/>
            </VerifyProvider>
          } />

        {/* Blog Routes */}
        <Route path="blogs" element={<Blog/>} />
        <Route path="blog/:id" element={<BlogPost />} />
        <Route path="create-blog" element={<CreateBlog />} />
        <Route path="edit-blog/:id" element={<CreateBlog />} />

        {/* Optional: Public pages */}
         <Route path="blog" element={<Blog/>} />
         <Route path="contact-us" element={<Contact/>} />

        <Route path="*" element={<Navigate to="home" replace />} />
      </Routes>
    </div>
  );
}
