import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  // Defined to be used in the CSS variable or direct styling
  const primaryGreen = '#28a745'; // Primary CTA Green (Lighter)
  const darkGreen = '#1E6F5C'; // Dashboard Theme Green (Darker)
  // Re-define darkGreen for the contact section to use the variable syntax


  const menuItems = [
    { name: 'Home', path: '/user/home', icon: 'fas fa-home' },
    { name: 'Guide', path: '/user-guide', icon: 'fas fa-book' },
    { name: 'Appointments', path: '/user-consultations', icon: 'fas fa-user-clock' },
    { name: 'Pricing', path: '/pricing', icon: 'fas fa-crown' },
    { name: 'Blog', path: '/blog', icon: 'fas fa-blog' },
    { name: 'Meal Plans', path: '/user-meal-plans', icon: 'fas fa-utensils' },
    { name: 'My Schedule', path: '/user-schedule', icon: 'fas fa-calendar-check' },
  ];

  return (
    // Sidebar Container
    <div className="hidden md:block w-64 bg-white text-gray-800 p-5 shadow-lg border-r border-gray-200 sidebar">
      <h4 className="text-xl font-extrabold mb-4 text-gray-800">Dashboard Menu</h4>
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            // FIX: Removed the problematic hover:bg-[${primaryGreen}] class.
            // Using a custom CSS class `menu-item-hover` combined with the CSS variable.
            className={`w-full text-left menu-item-hover hover:text-white text-gray-700 font-medium flex items-center gap-3 rounded p-3 transition-all duration-200`}
            // Pass the primaryGreen color to a CSS variable
            style={{ '--primary-green': primaryGreen }}
          >
            <i className={item.icon}></i> {item.name}
          </button>
        ))}
      </nav>
      
      {/* Contact Section */}
      <div className="mt-8 p-4 border border-gray-300 rounded-xl bg-gray-50 shadow-inner">
        {/* NOTE: Applying darkGreen directly in style to ensure it works */}
        <h3 className="text-lg font-semibold mb-3" style={{ color: darkGreen }}>Support</h3>
        <p className="text-sm text-gray-700">Email: <a href="mailto:support@nutriconnect.com" className="text-blue-600 hover:text-blue-800">support@nutriconnect.com</a></p>
        <p className="text-sm text-gray-700">Phone: <a href="tel:+917075783143" className="text-blue-600 hover:text-blue-800">+91 70757 83143</a></p>
        
        {/* NOTE: Applying darkGreen directly in style to ensure it works */}
        <h3 className="text-lg font-semibold mt-4 mb-3" style={{ color: darkGreen }}>Follow Us</h3>
        {/* NOTE: Applying primaryGreen directly in style to ensure it works */}
        <div className="flex justify-start gap-4" style={{ color: primaryGreen }}>
          {['facebook', 'instagram', 'x-twitter', 'linkedin'].map((brand, index) => (
            <a 
              key={index} 
              href={`#${brand}`} 
              // Using inline style for the specific darkGreen hover on social icons
              className="transition-colors" 
              style={{ '--dark-green': darkGreen }}
              onMouseOver={(e) => e.currentTarget.style.color = darkGreen}
              onMouseOut={(e) => e.currentTarget.style.color = primaryGreen}
            >
              <i className={`fa-brands fa-${brand} fa-xl font-bold`}></i>
            </a>
          ))}
        </div>
      </div>
      
      {/* --- Custom Styling for Sidebar --- */}
      <style>{`
        .sidebar {
          height: 100vh;
          position: sticky;
          top: 0;
          overflow-y: auto;
          box-sizing: border-box;
        }
        
        /* New CSS to handle the dynamic hover background color */
        .menu-item-hover:hover {
          background-color: var(--primary-green) !important;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;