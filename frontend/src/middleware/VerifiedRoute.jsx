/**
 * VerifiedRoute Component
 *
 * Combined middleware for protecting routes that require:
 * 1. Authentication (JWT token presence)
 * 2. Verification (Account must be verified)
 *
 * Usage:
 * <VerifiedRoute
 *   element={<DietitianDashboard />}
 *   requiredRole="dietitian"
 *   redirectTo="/dietitian/doc-status"
 * />
 */

import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useVerification } from '../hooks/useVerification';

const VerifiedRoute = ({
  element,
  requiredRole,
  redirectTo = '/doc-status'
}) => {
  const { isAuthenticated } = useAuth(requiredRole);
  const { isVerified, isLoading, error } = useVerification(requiredRole);

  // Check 1: Not Authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
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

  // Check 2: Loading verification status
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4 text-blue-500">
            <i className="fas fa-spinner fa-spin"></i>
          </div>
          <h2 className="text-2xl font-bold text-blue-600 mb-3">Verifying Account</h2>
          <p className="text-gray-600">
            Please wait while we check your verification status...
          </p>
        </div>
      </div>
    );
  }

  // Check 3: Verification check error
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center border-l-4 border-red-500">
          <div className="text-6xl mb-4 text-red-500">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-3">Verification Check Failed</h2>
          <p className="text-gray-600 mb-6">
            Unable to verify your account status. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-block bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-300"
          >
            <i className="fas fa-refresh mr-2"></i> Retry
          </button>
        </div>
      </div>
    );
  }

  // Check 4: Not verified
  if (!isVerified) {
    const roleDisplayName = requiredRole === 'dietitian' ? 'Dietitian' : 'Organization';

    return (
      <div className="flex items-center justify-center min-h-screen bg-yellow-50">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md text-center border-l-4 border-yellow-500">
          <div className="text-6xl mb-4 text-yellow-500">
            <i className="fas fa-shield-alt"></i>
          </div>
          <h2 className="text-2xl font-bold text-yellow-600 mb-3">Verification Required</h2>
          <p className="text-gray-600 mb-6">
            Your {roleDisplayName.toLowerCase()} account needs to be verified before you can access this page.
            Please complete the verification process.
          </p>
          <a
            href={redirectTo}
            className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-300"
          >
            <i className="fas fa-file-alt mr-2"></i> Check Verification Status
          </a>
        </div>
      </div>
    );
  }

  // All checks passed - render the protected component
  return element;
};

export default VerifiedRoute;