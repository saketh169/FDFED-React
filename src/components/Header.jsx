// src/components/Header.js
import React from "react";
import { Link, NavLink } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="top fixed top-0 left-0 w-full z-50 h-[110px]">
      {/* Top Bar */}
      <div className="top1 fixed left-0 right-0 h-[60px] w-full bg-gray-50 shadow-md flex items-center justify-center z-[1000] px-5">
        <div className="flex justify-between items-center w-full max-w-7xl mx-auto">
          {/* Logo */}
          <Link
            to="/user"
            className="flex items-center font-poppins text-2xl font-bold text-dark-accent"
          >
            <div className="flex items-center justify-center w-10 h-10 bg-primary-green rounded-full mr-2.5 transition-all duration-300 ease-in-out group-hover:bg-dark-accent group-hover:scale-110">
              <i className="fas fa-leaf text-white text-2xl"></i>
            </div>
            <span>
              <span className="text-primary-green">N</span>utri
              <span className="text-primary-green">C</span>onnect
            </span>
          </Link>

          {/* Profile Button */}
          <button
            onClick={() => (window.location.href = "/user_dash")}
            className="flex items-center justify-between gap-2 w-[150px] h-[45px] px-4 py-2 text-primary-green border-2 border-primary-green rounded-md font-bold transition-all duration-300 hover:bg-primary-green hover:text-white"
          >
            PROFILE
            <div className="border-2 border-primary-green rounded-full p-1.5 group-hover:border-white">
              <i className="fa-regular fa-user"></i>
            </div>
          </button>
        </div>
      </div>

      {/* Nav Bar */}
      <nav className="navbar fixed top-[60px] left-0 w-full h-[50px] bg-primary-green border-b-2 border-dark-accent z-[1000]">
        <div className="container mx-auto flex items-center justify-between h-full px-5">
          {/* Toggler Button */}
          <button
            id="toggler"
            className="lg:hidden navbar-toggler border-2 border-dark-accent rounded p-2"
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon">
              <i className="fas fa-bars text-dark-accent"></i>
            </span>
          </button>

          {/* Navbar Items */}
          <div
            className={`collapse navbar-collapse w-full lg:flex lg:items-center lg:w-auto ${
              isMenuOpen ? "block" : "hidden"
            }`}
          >
            <ul className="navbar-nav flex flex-col lg:flex-row lg:items-center lg:justify-between lg:mx-auto lg:w-[70%] lg:ml-[200px] mt-2 lg:mt-0 bg-white lg:bg-transparent rounded shadow lg:shadow-none">
              {[
                { name: "HOME", path: "/user" },
                { name: "GUIDE", path: "/user-guide" },
                { name: "DIETITIAN PROFILES", path: "/dietitian-profiles" },
                { name: "APPOINTMENTS", path: "/user-consultations" },
                { name: "BLOG", path: "/blog" },
                { name: "PRICING", path: "/pricing" },
              ].map((item) => (
                <li
                  key={item.name}
                  className="nav-item text-center lg:text-left"
                >
                  <NavLink
                    className={({ isActive }) =>
                      `block lg:inline-block font-bold text-base px-4 py-2.5 rounded-md transition-all duration-300 ease-in-out hover:bg-dark-accent/90 hover:text-white hover:shadow-md hover:-translate-y-0.5 ${
                        isActive
                          ? "bg-dark-accent text-white shadow-lg"
                          : "text-dark-accent lg:text-white"
                      }`
                    }
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <Link
              id="chatbot"
              to="/chatbot"
              title="Chatbot"
              className="flex items-center justify-center w-[45px] h-[45px] bg-dark-accent text-white rounded-md shadow-md transition-all duration-300 hover:bg-dark-accent/80 hover:scale-110"
            >
              <i className="fas fa-robot text-2xl"></i>
            </Link>
            <Link
              id="contact"
              to="/contact"
              title="Contact"
              className="flex items-center justify-center w-[45px] h-[45px] bg-dark-accent text-white rounded-md shadow-md transition-all duration-300 hover:bg-dark-accent/80 hover:scale-110"
            >
              <i className="fa-solid fa-phone-volume text-xl"></i>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
