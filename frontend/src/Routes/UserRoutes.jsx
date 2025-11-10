import { Routes, Route, Navigate } from 'react-router-dom';

import UserHome from '../pages/HomePages/UserHome';
import UserSchedule from '../pages/Schedules/UserSchedule';

import UserDashboard from '../pages/Dashboards/User';
import UserProgress from '../pages/UserProgress'; 
import ChangePassword from '../pages/ChangePassword';
import EditProfile from '../pages/EditProfile';
import UserGetPlanForm from '../pages/MealPlans/UserGetPlanForm'; 


import Chatbot from '../pages/Chatbot';
import Blog from '../pages/Blog';
import Contact from '../pages/Contactus';
import CreateBlog from '../pages/Blog/CreateBlog';
import BlogPost from '../pages/Blog/BlogPost';



export default function UserRoutes() {
  return (
    <div className="p-6">
      <Routes>
        <Route index element={<Navigate to="home" replace />} />

        {/* All routes are automatically protected by ProtectedProvider in Layout.jsx */}
        <Route path="home" element={<UserHome />} />
        <Route path="profile" element={<UserDashboard />} />
        <Route path="schedule" element={<UserSchedule />} />
        <Route path="progress" element={<UserProgress />} />  
        <Route path="get-plans" element={<UserGetPlanForm />} />   

        <Route path="change-pass" element={<ChangePassword />} />
        <Route path="edit-profile" element={<EditProfile />} />
        
        {/* Blog Routes */}
        <Route path="blogs" element={<Blog/>} />
        <Route path="blog/:id" element={<BlogPost />} />
        <Route path="create-blog" element={<CreateBlog />} />
        <Route path="edit-blog/:id" element={<CreateBlog />} />
        
        {/* Optional: Chatbot, Blog, Contact (can be public or protected) */}
        <Route path="blog" element={<Blog/>} />
        <Route path="contact-us" element={<Contact/>} />
        <Route path="chatbot" element={<Chatbot/>} />
        
        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="home" replace />} />
      </Routes>
    </div>
  );
}