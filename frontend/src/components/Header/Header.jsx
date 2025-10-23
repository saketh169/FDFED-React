import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import '/index.css';

// Header component for the navigation bar
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about-us' },
    { name: 'Blog', href: '/blog' },
    { name: 'Chatbot', href: '/chatbot' },
  ];

  const handleScrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <header className="bg-white shadow-sm py-4 px-8 md:px-12 lg:px-16 sticky top-0 z-50 border-b-2 border-[#28B463]">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <NavLink
          to="/"
          onClick={handleScrollToTop}
          className="flex items-center font-bold text-2xl md:text-3xl text-[#1E6F5C] select-none group cursor-pointer"
          exact
        >
          <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-[#28B463] rounded-full mr-2 md:mr-4 group-hover:bg-[#1E6F5C] group-hover:scale-110 transition-all duration-300">
            <i className="fas fa-leaf text-xl text-white animate-pulse"></i>
          </div>
          <span className="font-poppins group-hover:text-[#28B463] transition-colors duration-300">
            <span className="text-[#28B463] group-hover:text-[#1E6F5C]">N</span>utri
            <span className="text-[#28B463] group-hover:text-[#1E6F5C]">C</span>onnect
          </span>
        </NavLink>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-[#2C3E50] focus:outline-none cursor-pointer"
            aria-label="Toggle menu"
          >
            <i className="fas fa-bars text-2xl"></i>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 md:space-x-12">
          <ul className="flex items-center space-x-8">
            {navLinks.map((link) => (
              <li key={link.name}>
                <NavLink
                  to={link.href}
                  onClick={handleScrollToTop}
                  className={({ isActive }) =>
                    `font-poppins text-lg font-medium text-[#2C3E50] transition-colors duration-300 hover:text-[#28B463] hover:underline hover:underline-offset-4 cursor-pointer ${
                      isActive ? 'text-[#1E6F5C] underline underline-offset-4' : ''
                    }`
                  }
                  exact
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="flex space-x-4 items-center">
            <NavLink
              to="/role"
              onClick={handleScrollToTop}
              className="bg-transparent border border-[#28B463] text-[#28B463] px-4 py-2 rounded-full font-semibold hover:bg-[#28B463] hover:text-white transition-all duration-300 cursor-pointer"
            >
              Log In
            </NavLink>
            <Link
              to="/contact-us"
              onClick={handleScrollToTop}
              className="bg-[#28B463] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#1E6F5C] transition-all duration-300 cursor-pointer text-center"
            >
              Contact Us
            </Link>
          </div>
        </nav>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-[72px] left-0 w-full bg-white shadow-lg py-4 transition-all duration-300 transform origin-top animate-fade-in-down">
          <ul className="flex flex-col items-center space-y-4">
            {navLinks.map((link) => (
              <li key={link.name}>
                <NavLink
                  to={link.href}
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleScrollToTop();
                  }}
                  className={({ isActive }) =>
                    `font-poppins text-lg font-medium text-[#2C3E50] transition-colors duration-300 hover:text-[#28B463] cursor-pointer ${
                      isActive ? 'text-[#1E6F5C]' : ''
                    }`
                  }
                  exact
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="flex flex-col items-center space-y-4 mt-6">
            <NavLink
              to="/role"
              onClick={() => {
                setIsMenuOpen(false);
                handleScrollToTop();
              }}
              className="bg-transparent border border-[#28B463] text-[#28B463] w-28 py-2 rounded-full font-semibold hover:bg-[#28B463] hover:text-white transition-all duration-300 cursor-pointer text-center"
            >
              Log In
            </NavLink>
            <Link
              to="/contact-us"
              onClick={() => {
                setIsMenuOpen(false);
                handleScrollToTop();
              }}
              className="bg-[#28B463] text-white w-28 py-2 rounded-full font-semibold hover:bg-[#1E6F5C] transition-all duration-300 cursor-pointer text-center"
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;