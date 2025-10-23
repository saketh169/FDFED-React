import React from 'react';
import { NavLink } from 'react-router-dom';
import '/index.css';

const Footer = () => {
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about-us' },
    { name: 'Blog', href: '/blog' },
    { name: 'Chatbot', href: '/chatbot' },
    { name: 'Log In', href: '/role' },
    { name: 'Contact Us', href: '/contact-us' },
  ];

  const handleScrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <footer className="bg-[#1E6F5C] text-white pt-16 font-poppins">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-5 border-b border-white/20 pb-12">
        {/* Contact Us Column */}
        <div className="flex flex-col items-start">
          <h3 className="text-xl font-semibold mb-4 relative pb-2.5 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-[#28B463]">
            Contact Us
          </h3>
          <ul className="list-none p-0 text-white/80">
            <li className="mb-3 flex items-center">
              <i className="fas fa-envelope mr-3 text-[#28B463]"></i>
              <a
                href="mailto:nutriconnect6@gmail.com"
                className="no-underline hover:text-[#FFD700] transition-all duration-300"
                aria-label="Email NutriConnect"
              >
                nutriconnect6@gmail.com
              </a>
            </li>
            <li className="mb-3 flex items-center">
              <i className="fas fa-phone mr-3 text-[#28B463]"></i>
              <a
                href="tel:+917075783143"
                className="no-underline hover:text-[#FFD700] transition-all duration-300"
                aria-label="Call NutriConnect"
              >
                +91 70757 83143
              </a>
            </li>
            <li className="mb-3 flex items-center">
              <i className="fas fa-map-marker-alt mr-3 text-[#28B463]"></i>
<<<<<<< HEAD
              <span className="text-white/80">IIIT SriCity , Chittor , 517346</span>
=======
              <span className="text-white/80">45 Wellness Avenue, Greenfield, CA 93927</span>
>>>>>>> origin/main
            </li>
          </ul>
        </div>

        {/* Quick Links Column */}
        <div className="flex flex-col items-start">
          <h3 className="text-xl font-semibold mb-4 relative pb-2.5 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-[#28B463]">
            Quick Links
          </h3>
          <ul className="list-none p-0 text-white/80">
            {navLinks.map((link) => (
              <li key={link.name} className="mb-2">
                <NavLink
                  to={link.href}
                  onClick={handleScrollToTop}
                  className={({ isActive }) =>
                    `no-underline hover:text-[#FFD700] hover:pl-2 transition-all duration-300 ${
                      isActive ? 'text-[#FFD700]' : ''
                    }`
                  }
                  exact
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Follow Us Column */}
        <div className="flex flex-col items-start">
          <h3 className="text-xl font-semibold mb-4 relative pb-2.5 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-[#28B463]">
            Follow Us
          </h3>
          <div className="flex gap-4 mt-4">
            <a
              href="https://www.facebook.com/profile.php?id=61572485733709"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 flex items-center justify-center text-[#28B463] bg-white rounded-full hover:bg-transparent hover:text-white border border-transparent hover:border-white transition-all duration-300"
              aria-label="Follow NutriConnect on Facebook"
            >
              <i className="fab fa-facebook-f text-lg"></i>
            </a>
            <a
              href="https://www.instagram.com/nutriconnect2025"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 flex items-center justify-center text-[#28B463] bg-white rounded-full hover:bg-transparent hover:text-white border border-transparent hover:border-white transition-all duration-300"
              aria-label="Follow NutriConnect on Instagram"
            >
              <i className="fab fa-instagram text-lg"></i>
            </a>
            <a
              href="https://x.com/NutriC21?t=ngy3BuReV6VcrXl3WXrCvg&s=09"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 flex items-center justify-center text-[#28B463] bg-white rounded-full hover:bg-transparent hover:text-white border border-transparent hover:border-white transition-all duration-300"
              aria-label="Follow NutriConnect on X"
            >
              <i className="fab fa-twitter text-lg"></i>
            </a>
            <a
              href="https://www.linkedin.com/in/nutri-connect-a0b774349"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 flex items-center justify-center text-[#28B463] bg-white rounded-full hover:bg-transparent hover:text-white border border-transparent hover:border-white transition-all duration-300"
              aria-label="Follow NutriConnect on LinkedIn"
            >
              <i className="fab fa-linkedin-in text-lg"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="bg-[#154F44] py-5 text-center mt-12">
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-[#28B463] rounded-full mr-2">
            <i className="fas fa-leaf text-sm text-white"></i>
          </div>
          <span className="font-poppins text-lg font-bold text-white">
            <span className="text-[#28B463]">N</span>utri<span className="text-[#28B463]">C</span>onnect
          </span>
        </div>
        <p className="text-white text-opacity-70 text-sm m-0">
          &copy; {new Date().getFullYear()} NutriConnect. All Rights Reserved.
<<<<<<< HEAD
          <a href="/terms-of-use" className="text-white/80 no-underline hover:text-[#FFD700] mx-2" aria-label="Terms of Use">
            Terms of Use
          </a>
          |
          <a href="/privacy-policy" className="text-white/80 no-underline hover:text-[#FFD700] mx-2" aria-label="Privacy Policy">
=======
          <a href="/terms" className="text-white/80 no-underline hover:text-[#FFD700] mx-2" aria-label="Terms of Use">
            Terms of Use
          </a>
          |
          <a href="/privacy" className="text-white/80 no-underline hover:text-[#FFD700] mx-2" aria-label="Privacy Policy">
>>>>>>> origin/main
            Privacy Policy
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;