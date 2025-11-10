// src/components/Footer.js
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer relative w-full bg-dark-accent text-white font-montserrat pt-16 mt-36">
      <div className="container mx-auto px-4">
        <div className="row flex flex-wrap -mx-4">
          {/* Column 1: Logo & About */}
          <div className="col-lg-4 col-md-6 mb-8 lg:mb-0 px-4 w-full lg:w-4/12 md:w-6/12">
            <div className="logo flex items-center text-2xl font-bold text-white mb-5 ml-0">
              <div className="icon-container flex items-center justify-center w-10 h-10 bg-primary-green rounded-full mr-2.5">
                <i className="icon fas fa-leaf text-2xl text-white"></i>
              </div>
              <span>
                <span className="highlight text-primary-green">N</span>utri
                <span className="highlight text-primary-green">C</span>onnect
              </span>
            </div>
            <p className="footer-about text-gray-300 mb-5 leading-relaxed font-normal">
              NutriConnect helps you find certified dietitians and nutrition
              experts to achieve your health goals through personalized
              nutrition plans.
            </p>
            <div className="social-links flex gap-4 mt-5">
              {[
                {
                  label: "Facebook",
                  href: "#",
                  icon: "fab fa-facebook-f",
                },
                {
                  label: "Instagram",
                  href: "#",
                  icon: "fab fa-instagram",
                },
                {
                  label: "Twitter",
                  href: "#",
                  icon: "fab fa-twitter",
                },
                {
                  label: "LinkedIn",
                  href: "#",
                  icon: "fab fa-linkedin-in",
                },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-primary-green transition-all duration-300 ease-in-out hover:bg-primary-green hover:text-white hover:-translate-y-1"
                  aria-label={link.label}
                >
                  <i className={link.icon}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="col-lg-2 col-md-6 mb-8 lg:mb-0 px-4 w-full lg:w-2/12 md:w-6/12">
            <h5 className="footer-title text-white text-lg font-semibold mb-5 pb-2.5 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-primary-green">
              Quick Links
            </h5>
            <ul className="footer-links list-none p-0">
              {[
                { name: "Home", path: "/user" },
                { name: "Find Dietitians", path: "/dietitian-profiles" },
                { name: "How It Works", path: "/user-guide" },
                { name: "Nutrition Blog", path: "/blog" },
                { name: "Pricing Plans", path: "/pricing" },
                { name: "Contact Support", path: "/contact" },
              ].map((link) => (
                <li key={link.name} className="mb-3">
                  <Link
                    to={link.path}
                    className="text-gray-300 no-underline transition-all duration-300 ease-in-out flex items-center gap-2 font-normal hover:text-yellow-400 hover:pl-1.5"
                  >
                    <i className="fas fa-chevron-right text-xs"></i> {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="col-lg-3 col-md-6 mb-8 lg:mb-0 px-4 w-full lg:w-3/12 md:w-6/12">
            <h5 className="footer-title text-white text-lg font-semibold mb-5 pb-2.5 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-primary-green">
              Services
            </h5>
            <ul className="footer-links list-none p-0">
              {[
                { name: "Weight Management", path: "/weight-management" },
                { name: "Diabetes/Thyroid", path: "/diabetes-thyroid" },
                { name: "Cardiac Health", path: "/cardiac-health" },
                { name: "Women's Health", path: "/womens-health" },
                { name: "Skin & Hair Care", path: "/skin-hair" },
                { name: "Gut Health", path: "/gut-health" },
              ].map((link) => (
                <li key={link.name} className="mb-3">
                  <Link
                    to={link.path}
                    className="text-gray-300 no-underline transition-all duration-300 ease-in-out flex items-center gap-2 font-normal hover:text-yellow-400 hover:pl-1.5"
                  >
                    <i className="fas fa-chevron-right text-xs"></i> {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="col-lg-3 col-md-6 px-4 w-full lg:w-3/12 md:w-6/12">
            <h5 className="footer-title text-white text-lg font-semibold mb-5 pb-2.5 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-primary-green">
              Contact Info
            </h5>
            <ul className="footer-contact-info list-none p-0">
              <li className="mb-4 flex items-start gap-2.5 leading-normal">
                <i className="fas fa-map-marker-alt mt-1 text-primary-green"></i>
                <span>Plot No. 45, Greenway Colony, 517681, India</span>
              </li>
              <li className="mb-4 flex items-start gap-2.5 leading-normal">
                <i className="fas fa-phone-alt mt-1 text-primary-green"></i>
                <a
                  href="tel:+917075783143"
                  className="text-blue-400 no-underline transition-colors duration-300 ease-in-out font-medium hover:text-blue-300"
                >
                  +91 70757 83143
                </a>
              </li>
              <li className="mb-4 flex items-start gap-2.5 leading-normal">
                <i className="fas fa-envelope mt-1 text-primary-green"></i>
                <a
                  href="mailto:support@nutriconnect.com"
                  className="text-blue-400 no-underline transition-colors duration-300 ease-in-out font-medium hover:text-blue-300"
                >
                  support@nutriconnect.com
                </a>
              </li>
              <li className="mb-4 flex items-start gap-2.5 leading-normal">
                <i className="fas fa-clock mt-1 text-primary-green"></i>
                <span>Mon-Fri: 9AM - 9PM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom bg-black/20 py-5 mt-16">
        <div className="container mx-auto px-4">
          <div className="row flex flex-col md:flex-row items-center -mx-4">
            <div className="col-md-6 w-full md:w-6/12 px-4 text-center md:text-left mb-3 md:mb-0">
              <p className="copyright text-gray-400 m-0 font-normal">
                © 2025 NutriConnect. All rights reserved.
              </p>
            </div>
            <div className="col-md-6 w-full md:w-6/12 px-4">
              <ul className="footer-menu list-none p-0 m-0 flex justify-center md:justify-end gap-5">
                <li>
                  <a
                    href="/terms_conditions"
                    className="text-gray-300 no-underline transition-colors duration-300 ease-in-out font-medium hover:text-yellow-400"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy-policy"
                    className="text-gray-300 no-underline transition-colors duration-300 ease-in-out font-medium hover:text-yellow-400"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
