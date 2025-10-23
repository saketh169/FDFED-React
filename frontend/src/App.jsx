import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
<<<<<<< HEAD

import SplashScreen from './components/extras/SplashScreen';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

import Home from './pages/Home';
=======
import SplashScreen from './components/extras/Splashscreen';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
>>>>>>> origin/main
import Aboutus from './pages/Aboutus';
import Blog from './pages/Blog';
import Chatbot from './pages/Chatbot';
import Contactus from './pages/Contactus';
<<<<<<< HEAD

import Signin from './pages/Auth/Signin';
import Signup from './pages/Auth/Signup';
import RoleModal from './pages/RoleModal';
import DocUpload from './pages/Auth/DocUpload';

import PrivacyPolicy from './components/extras/PrivacyPolicy';
import TermsOfUse  from './components/extras/TermsOfUse';

import Layout from './Layout'; 
=======
import Home from './pages/Home';

import RoleModal from './pages/RoleModal';

//import Layout from './Layout'; // Import Layout.jsx
import './App.css';
>>>>>>> origin/main

// NotFound component for 404 pages
const NotFound = () => (
  <main className="flex-1 max-w-6xl mx-auto p-8 text-center">
    <h1 className="text-3xl font-bold text-[#2C3E50]">Page Not Found</h1>
    <p className="mt-4 text-lg text-gray-600">
      The requested page does not exist.{' '}
      <a href="/" className="text-blue-600 hover:underline">
        Go back to Home
      </a>
    </p>
  </main>
);

const App = () => {
  // Comment out splash screen state and logic
  /*
  const [showSplash, setShowSplash] = useState(() => {
      return sessionStorage.getItem('splashShown') !== 'true';
  });

  useEffect(() => {
      if (showSplash) {
          const timer = setTimeout(() => {
              setShowSplash(false);
              sessionStorage.setItem('splashShown', 'true');
          }, 5000);

          return () => clearTimeout(timer);
      }
  }, [showSplash]);
  */

  return (
    <Router>
      <div className="app-container">
        {/* Comment out splash screen conditional rendering */}
        {/*
        {showSplash ? (
            <SplashScreen />
        ) : (
        */}
        <div className="main-layout">
          <Header />
          <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about-us" element={<Aboutus />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="/contact-us" element={<Contactus />} />
<<<<<<< HEAD
              <Route path="/signin" element={<Signin />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/role" element={<RoleModal />} />
              <Route path="/upload-documents" element={<DocUpload />} />

              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-use" element={<TermsOfUse/>} />


              {/* Role-Specific Routes (handled by Layout.jsx) */}
              <Route path="/*" element={<Layout />} />
=======
              
              <Route path="/role" element={<RoleModal />} />
            

              {/* Role-Specific Routes (handled by Layout.jsx) */}
            
>>>>>>> origin/main

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <Footer />
        </div>
        {/* )} */}
      </div>
    </Router>
  );
};

export default App;