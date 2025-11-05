/**
 * ProtectedRoute Component
 * 
 * Middleware for protecting routes based on:
 * 1. Authentication (JWT token presence)
 * 2. Authorization (Correct role)
 * 
 * Usage:
 * <ProtectedRoute 
 *   element={<UserHome />} 
 *   requiredRole="user"
 *   onUnauthorized={() => handleUnauth()}
 * />
 */

import React from 'react';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ 
  element, 
  requiredRole = 'user'
}) => {
  const { isAuthenticated } = useAuth(requiredRole);

  // Check 1: Not Authenticated
  if (!isAuthenticated) {
    console.warn(`[ProtectedRoute] User not authenticated for role: ${requiredRole}`);
    
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-b from-red-50 to-white">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md text-center border-l-4 border-red-500">
          <div className="text-6xl mb-4 text-red-500">
            <i className="fas fa-lock"></i>
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-3">Not Authenticated</h2>
          <p className="text-gray-600 mb-6">
            You need to sign in to access this page. Your session has expired or you haven't logged in yet.
          </p>
          <a 
            href={`/signin?role=${requiredRole}`}
            className="inline-block bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-300"
          >
            Go to Sign In
          </a>
        </div>
      </div>
    );
  }

  // Check 2: Authenticated but may need authorization check
  // For now, if token exists and role matches, allow access
  // This can be extended to verify token validity with backend
  
  return element;
};

export default ProtectedRoute;
