/**
 * useVerification Hook
 *
 * This hook checks if a user (dietitian or organization) is verified
 * by calling the status API endpoint.
 *
 * Usage:
 * const { isVerified, isLoading, error } = useVerification('dietitian');
 */

import { useState, useEffect } from 'react';

export const useVerification = (role) => {
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkVerification = async () => {
      // Only check for dietitian and organization roles
      if (role !== 'dietitian' && role !== 'organization') {
        setIsLoading(false);
        return;
      }

      const token = localStorage.getItem(`authToken_${role}`);
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/status/${role}-status`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          const finalStatus = data.verificationStatus?.finalReport || 'Not Received';
          setIsVerified(finalStatus === 'Verified');
        } else {
          setError('Failed to check verification status');
        }
      } catch (err) {
        setError('Network error while checking verification');
        console.error('Verification check error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkVerification();
  }, [role]);

  return { isVerified, isLoading, error };
};
