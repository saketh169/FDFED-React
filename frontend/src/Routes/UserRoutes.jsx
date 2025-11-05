import { Routes, Route, Navigate } from 'react-router-dom';

import UserHome from '../pages/HomePages/UserHome';
import UserSchedule from '../pages/Schedules/UserSchedule';

import UserDashboard from '../pages/Dashboards/User';
import UserProgress from '../pages/UserProgress'; 


import Chatbot from '../pages/Chatbot';
import Blog from '../pages/Blog';
import Contact from '../pages/Contactus';



export default function UserRoutes() {
  return (
    <div className="p-6">
      <Routes>
        <Route index element={<Navigate to="home" replace />} />

        <Route path="home" element={<UserHome />} />
        <Route path="profile" element={<UserDashboard />} />
        <Route path="schedule" element={<UserSchedule />} />
        <Route path="progress" element={<UserProgress />} />  
        
        {/* Add more /user/* routes here */}
        <Route path="*" element={<Navigate to="home" replace />} />

         <Route path="blog" element={<Blog/>} />
         <Route path="contact-us" element={<Contact/>} />
         <Route path="chatbot" element={<Chatbot/>} />
      </Routes>
    </div>
  );
}