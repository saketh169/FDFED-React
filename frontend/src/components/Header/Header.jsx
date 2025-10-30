import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import NavHeader from '../Navbar/NavHeader';

// Font Awesome CDN (can be moved to index.html if preferred)
const FontAwesomeLink = () => (
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
    xintegrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
    crossOrigin="anonymous"
    referrerPolicy="no-referrer"
  />
);

const Header = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const handleScrollToTop = () => window.scrollTo(0, 0);

  // --- NEW: Multi-Role Profile Path Logic ---
  const getProfilePath = () => {
    if (currentPath.startsWith('/admin')) {
      return '/admin/profile';
    }
    if (currentPath.startsWith('/organization')) {
      return '/organization/profile';
    }
    if (currentPath.startsWith('/corporatepartner')) {
      return '/corporatepartner/profile';
    }
    if (currentPath.startsWith('/dietitian')) {
      return '/dietitian/profile';
    }
    if (currentPath.startsWith('/user')) {
      return '/user/profile';
    }
    return '/role'; 
  };
  // --- END getProfilePath ---

  // --- Action Buttons Renderer ---
  const renderActionButtons = (isMobile = false) => {
    // Check if the user is in ANY role-specific area (admin, org, corp, dietitian, user)
    const isLoggedInArea = 
      currentPath.startsWith('/user') || 
      currentPath.startsWith('/dietitian') ||
      currentPath.startsWith('/admin') ||
      currentPath.startsWith('/organization') ||
      currentPath.startsWith('/corporatepartner');

    const contactUsClass = `bg-[#28B463] text-white ${isMobile ? 'w-28' : 'px-5'} py-2 rounded-full font-semibold hover:bg-[#1E6F5C] transition-all duration-300 cursor-pointer text-center`;
    const outlineButtonClass = `bg-transparent border border-[#28B463] text-[#28B463] ${isMobile ? 'w-28' : 'px-5'} py-2 rounded-full font-semibold hover:bg-[#28B463] hover:text-white transition-all duration-300 cursor-pointer text-center`;

    if (isLoggedInArea) {
      const profileLink = getProfilePath();
      const iconButtonBaseClass = "relative flex items-center justify-center p-2 rounded-full transition-all duration-300 group";
      const tooltipTextClass = "absolute top-full mt-2 px-3 py-1 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10";

      // If in any role area, show Profile and Logout buttons
      return (
        <>
          <NavLink
            to={profileLink}
            onClick={() => isMobile && handleScrollToTop()}
            className={`${iconButtonBaseClass} border border-[#28B463] text-[#28B463] hover:bg-[#28B463] hover:text-white`}
            aria-label="Profile"
          >
            <i className="fas fa-user-circle text-3xl"></i>
            <span className={tooltipTextClass}>Profile</span>
          </NavLink>

          <Link
            to="/logout"
            onClick={() => isMobile && handleScrollToTop()}
            className={`${iconButtonBaseClass} bg-[#28B463] text-white hover:bg-[#1E6F5C]`}
            aria-label="Log Out"
          >
            <i className="fas fa-sign-out-alt text-3xl"></i>
            <span className={tooltipTextClass}>Log Out</span>
          </Link>
        </>
      );
    }

    // If not logged in (base path), show Log In and Contact Us buttons
    return (
      <>
        <NavLink
          to="/role"
          onClick={handleScrollToTop}
          className={outlineButtonClass}
        >
          Log In
        </NavLink>
        <Link
          to="/contact-us"
          onClick={handleScrollToTop}
          className={contactUsClass}
        >
          Contact Us
        </Link>
      </>
    );
  };

  return (
    <header className="bg-white shadow-sm py-4 px-4 md:px-8 lg:px-16 sticky top-0 z-50 border-b-2 border-[#28B463]">
      <FontAwesomeLink />

      <div className="max-w-7xl mx-auto -mr-10 flex items-center justify-between">
        {/* Logo */}
        <NavLink
          to="/"
          onClick={handleScrollToTop}
          className="flex items-center font-bold text-2xl md:text-3xl text-[#1E6F5C] select-none group cursor-pointer"
        >
          <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-[#28B463] rounded-full mr-2 md:mr-3 group-hover:bg-[#1E6F5C] group-hover:scale-110 transition-all duration-300">
            <i className="fas fa-leaf text-xl text-white animate-pulse"></i>
          </div>
          <span className="font-poppins group-hover:text-[#28B463] transition-colors duration-300">
            <span className="text-[#28B463] group-hover:text-[#1E6F5C]">N</span>utri
            <span className="text-[#28B463] group-hover:text-[#1E6F5C]">C</span>onnect
          </span>
        </NavLink>

        {/* NavHeader handles navigation and mobile menu */}
        <NavHeader
          renderActionButtons={renderActionButtons}
          handleScrollToTop={handleScrollToTop}
        />
      </div>
    </header>
  );
};

export default Header;
