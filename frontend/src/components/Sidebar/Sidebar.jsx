import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // Defined to be used in the CSS variable or direct styling
  const primaryGreen = '#28a745'; // Primary CTA Green (Lighter)
  const darkGreen = '#1E6F5C'; // Dashboard Theme Green (Darker)

  // --- Navbar Links Definitions (same as NavHeader.jsx) ---
  const baseNavLinks = [
    { name: 'Home', href: '/', icon: 'fas fa-home' },
    { name: 'About Us', href: '/about-us', icon: 'fas fa-info-circle' },
    { name: 'Guide', href: '/guide', icon: 'fas fa-book' },
    { name: 'Blog', href: '/blog', icon: 'fas fa-blog' },
    { name: 'Chatbot', href: '/chatbot', icon: 'fas fa-robot' },
  ];

  const userNavLinks = [
    { name: 'Home', href: '/user', icon: 'fas fa-home' },
    { name: 'Dietitians', href: '/user/dietitian-profiles', icon: 'fas fa-user-tie' },
    { name: 'Appointments', href: '/user/user-consultations', icon: 'fas fa-calendar' },
    { name: 'Schedule', href: '/user/user-schedule', icon: 'fas fa-calendar-check' },
    { name: 'Pricing', href: '/user/pricing', icon: 'fas fa-tag' },
    { name: 'Blog', href: '/user/blog', icon: 'fas fa-blog' },
    { name: 'Chatbot', href: '/user/chatbot', icon: 'fas fa-robot' },
  ];

  const dietitianNavLinks = [
    { name: 'Home', href: '/dietitian', icon: 'fas fa-home' },
    { name: 'My Clients', href: '/dietitian/dietitian-consultations', icon: 'fas fa-users' },
    { name: 'Schedule', href: '/dietitian/dietitian-schedule', icon: 'fas fa-calendar-check' },
    { name: 'MealPlans', href: '/dietitian/assign-plans', icon: 'fas fa-utensils' },
    { name: 'Blog', href: '/dietitian/blog', icon: 'fas fa-blog' },
  ];

  const corporatePartnerNavLinks = [
    { name: 'Plans/Offers', href: '/corporatepartner/plans-offers', icon: 'fas fa-briefcase' },
    { name: 'Renewal', href: '/corporatepartner/renewal', icon: 'fas fa-sync-alt' },
    { name: 'Bookings', href: '/corporatepartner/bookings', icon: 'fas fa-bookmark' },
    { name: 'Chatbot', href: '/user/chatbot', icon: 'fas fa-robot' },
  ];

  const adminNavLinks = [
    { name: 'Analytics', href: '/admin/analytics', icon: 'fas fa-chart-bar' },
    { name: 'Users', href: '/admin/users', icon: 'fas fa-users' },
    { name: 'Queries', href: '/admin/queries', icon: 'fas fa-question-circle' },
    { name: 'Settings', href: '/admin/settings', icon: 'fas fa-cog' },
  ];

  const organizationNavLinks = [
    { name: 'Verify Dietitians', href: '/organization/verify-dietitian', icon: 'fas fa-check-circle' },
    { name: 'Verify Corps', href: '/organization/verify-corporate', icon: 'fas fa-check-double' },
    { name: 'Documents', href: '/organization/documents', icon: 'fas fa-file' },
  ];

  // --- Function to Select Links based on Path ---
  const getNavLinks = () => {
    if (currentPath.startsWith('/admin')) return adminNavLinks;
    if (currentPath.startsWith('/organization')) return organizationNavLinks;
    if (currentPath.startsWith('/corporatepartner')) return corporatePartnerNavLinks;
    if (currentPath.startsWith('/dietitian')) return dietitianNavLinks;
    if (currentPath.startsWith('/user')) return userNavLinks;
    return baseNavLinks;
  };

  const menuItems = getNavLinks();

  return (
    // Sidebar Container
    <div className="hidden md:block w-64 bg-white text-gray-800 p-5 shadow-lg border-r border-gray-200 sidebar">
      <h4 className="text-xl font-extrabold mb-4 text-gray-800">Dashboard Menu</h4>
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => navigate(item.href)}
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