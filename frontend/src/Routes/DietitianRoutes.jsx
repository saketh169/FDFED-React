import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../middleware/ProtectedRoute';
import VerifiedRoute from '../middleware/VerifiedRoute';

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

        {/* Protected Routes - Require Dietitian Authentication */}
        <Route path="home" element={<ProtectedRoute element={<DietitianHome />} requiredRole="dietitian" />} />
        <Route path="profile" element={<ProtectedRoute element={<DietitianDashboard />} requiredRole="dietitian" />} />
        <Route path="setup" element={<ProtectedRoute element={<DietitianSetup/>} requiredRole="dietitian" />} />
        <Route path="doc-status" element={<ProtectedRoute element={<DietitianDocStatus/>} requiredRole="dietitian" />} />
        <Route path="change-pass" element={<ProtectedRoute element={<ChangePassword/>} requiredRole="dietitian" />} />
        <Route path="edit-profile" element={<ProtectedRoute element={<EditProfile />} requiredRole="dietitian" />} />

        {/* Verified Routes - Require Dietitian Authentication AND Verification */}
        <Route
          path="schedule"
          element={<VerifiedRoute element={<ProtectedRoute element={<DietitianSchedule/>} requiredRole="dietitian" />} requiredRole="dietitian" redirectTo="/dietitian/doc-status" />} />
        <Route
          path="add-plans"
          element={<VerifiedRoute element={<ProtectedRoute element={<DietitianAddPlanForm/>} requiredRole="dietitian" />} requiredRole="dietitian" redirectTo="/dietitian/doc-status" />} />

        {/* Blog Routes */}
        <Route path="blogs" element={<Blog/>} />
        <Route path="blog/:id" element={<ProtectedRoute element={<BlogPost />} requiredRole="dietitian" />} />
        <Route path="create-blog" element={<ProtectedRoute element={<CreateBlog />} requiredRole="dietitian" />} />
        <Route path="edit-blog/:id" element={<ProtectedRoute element={<CreateBlog />} requiredRole="dietitian" />} />

        {/* Optional: Public pages */}
         <Route path="blog" element={<Blog/>} />
         <Route path="contact-us" element={<Contact/>} />
        
        <Route path="*" element={<Navigate to="home" replace />} />
      </Routes>
    </div>
  );
}
