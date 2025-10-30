import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

/**
 * Renders the dynamic "Quick Links" column based on the current URL path.
 * @param {Function} handleScrollToTop - Function to scroll the window to the top.
 */
const NavFooter = ({ handleScrollToTop }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  // --- Dynamic Footer Links Definitions ---

  // 1. Base set of links for general/public pages
  const baseFooterLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about-us' },
    { name: 'Blog', href: '/blog' },
    { name: 'Chatbot', href: '/chatbot' },
    { name: 'Log In', href: '/role' },
    { name: 'Contact Us', href: '/contact-us' },
  ];

  // 2. Links for a general 'user' role
  const userFooterLinks = [
    { name: 'Home', href: '/user' },
    { name: 'Guide', href: '/user-guide' },
    { name: 'Dietitians', href: '/dietitian-profiles' },
    { name: 'Appointments', href: '/user-consultations' },
    { name: 'Schedule', href: '/user-schedule' },
    { name: 'Blog', href: '/blog' },
    { name: 'Pricing', href: '/pricing' },
  ];

  // 3. Links for the 'dietitian' role
  const dietitianFooterLinks = [
    { name: 'Home', href: '/dietitian' },
    { name: 'Guide', href: '/dietitian-guide' },
    { name: 'My Clients', href: '/dietitian-consultations' },
    { name: 'Schedule', href: '/dietitian-schedule' },
    { name: 'MealPlans', href: '/assign-plans' },
    { name: 'Queries', href: '/dietitian-queries' },
  ];
  
  // 4. Links for the 'admin' role
  const adminFooterLinks = [
    { name: 'Dashboard', href: '/admin/dashboard' },
    { name: 'Analytics', href: '/admin/analytics' },
    { name: 'Users', href: '/admin/users' },
    { name: 'Queries', href: '/admin/queries' },
    { name: 'Settings', href: '/admin/settings' },
    { name: 'Profile', href: '/admin/profile' },
  ];
  
  // 5. Links for the 'organization' role
  const organizationFooterLinks = [ 
    { name: 'Dashboard', href: '/organization/dashboard' },
    { name: 'Verify Dietitians', href: '/organization/verify-dietitian' },
    { name: 'Verify Corps', href: '/organization/verify-corporate' },
    { name: 'Documents', href: '/organization/documents' },
    { name: 'Contact', href: '/contact-us' }, 
    { name: 'Profile', href: '/organization/profile' },
  ];

  // 6. Links for the 'corporatepartner' role
  const corporatePartnerFooterLinks = [ 
    { name: 'Dashboard', href: '/corporatepartner/dashboard' },
    { name: 'Plans/Offers', href: '/corporatepartner/plans-offers' },
    { name: 'Renewal', href: '/corporatepartner/renewal' },
    { name: 'Bookings', href: '/corporatepartner/bookings' },
    { name: 'Contact', href: '/contact-us' }, 
    { name: 'Profile', href: '/corporatepartner/profile' },
  ];

  // --- Logic to Determine Active Links ---
  const getFooterLinks = () => {
    if (currentPath.startsWith('/admin')) {
      return adminFooterLinks;
    }
    if (currentPath.startsWith('/organization')) {
      return organizationFooterLinks;
    }
    if (currentPath.startsWith('/corporatepartner')) {
      return corporatePartnerFooterLinks;
    }
    if (currentPath.startsWith('/dietitian')) {
      return dietitianFooterLinks;
    }
    if (currentPath.startsWith('/user')) {
      return userFooterLinks;
    }
    // Fallback to the base links for all other paths
    return baseFooterLinks;
  };

  const navLinks = getFooterLinks();

  return (
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
              // In React Router v6+, 'exact' is deprecated; the behavior is now default or handled by the route setup.
              // I'm leaving it as a non-breaking attribute for now, but its functionality is managed by NavLink itself.
              // The closest replacement is ensuring the 'to' path matches the route definition exactly.
            >
              {link.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NavFooter;
