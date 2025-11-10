import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children, currentRole }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(currentRole || null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for existing auth on app load or when currentRole changes
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      
      if (currentRole) {
        // If currentRole is provided, use it specifically
        const token = localStorage.getItem(`authToken_${currentRole}`);
        const user = localStorage.getItem(`authUser_${currentRole}`);
        
        if (token) {
          setToken(token);
          setRole(currentRole);
          setIsAuthenticated(true);
          // Set axios default header
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Fetch fresh user details if token exists
          if (!user) {
            await fetchUserDetails(token, currentRole);
          } else {
            setUser(JSON.parse(user));
          }
        } else {
          // No token for this role, clear state
          setToken(null);
          setRole(null);
          setUser(null);
          setIsAuthenticated(false);
          delete axios.defaults.headers.common['Authorization'];
        }
      } else {
        // Fallback: check all roles if no currentRole provided
        const roles = ['user', 'admin', 'organization', 'corporatepartner', 'dietitian'];
        let foundToken = null;
        let foundRole = null;
        let foundUser = null;

        for (const r of roles) {
          const token = localStorage.getItem(`authToken_${r}`);
          const user = localStorage.getItem(`authUser_${r}`);
          if (token) {
            foundToken = token;
            foundRole = r;
            foundUser = user ? JSON.parse(user) : null;
            break;
          }
        }

        if (foundToken && foundRole) {
          setToken(foundToken);
          setRole(foundRole);
          setIsAuthenticated(true);
          // Set axios default header
          axios.defaults.headers.common['Authorization'] = `Bearer ${foundToken}`;
          
          // Fetch fresh user details if token exists
          if (!foundUser) {
            await fetchUserDetails(foundToken, foundRole);
          } else {
            setUser(foundUser);
          }
        } else {
          setToken(null);
          setRole(null);
          setUser(null);
          setIsAuthenticated(false);
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [currentRole]); // Re-run when currentRole changes

  // Fetch user details from API
  const fetchUserDetails = async (token, role) => {
    try {
      const response = await axios.get('/api/getuserdetails', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        const userData = {
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone,
          age: response.data.age,
          address: response.data.address,
          profileImage: response.data.profileImage,
          gender: response.data.gender,
          // Organization-specific fields
          org_name: response.data.org_name,
          // Corporate Partner-specific fields
          company_name: response.data.company_name,
          programName: response.data.programName,
          // Dietitian-specific fields
          specialization: response.data.specialization,
          experience: response.data.experience,
          licenseNumber: response.data.licenseNumber,
        };
        setUser(userData);
        localStorage.setItem(`authUser_${role}`, JSON.stringify(userData));
        return userData;
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  // Login function
  const login = async (email, password, role, additionalData = {}) => {
    try {
      const formData = {
        email,
        password,
        role,
        ...additionalData,
      };

      const apiRoute = `/api/signin/${role}`;
      const response = await axios.post(apiRoute, formData);
      const data = response.data;

      if (data.token) {
        // Store in context
        setToken(data.token);
        setRole(data.role || role);
        setIsAuthenticated(true);

        // Store in localStorage for persistence with role-specific keys
        localStorage.setItem(`authToken_${data.role || role}`, data.token);

        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

        // Fetch user details after successful login
        await fetchUserDetails(data.token, data.role || role);

        return { success: true, role: data.role || role };
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    setToken(null);
    setRole(null);
    setUser(null);
    setIsAuthenticated(false);

    // Clear all role-specific localStorage
    const roles = ['user', 'admin', 'organization', 'corporatepartner', 'dietitian'];
    roles.forEach(r => {
      localStorage.removeItem(`authToken_${r}`);
      localStorage.removeItem(`authUser_${r}`);
    });

    // Clear axios header
    delete axios.defaults.headers.common['Authorization'];
  };

  // Update user data
  const updateUser = (newUserData) => {
    setUser(newUserData);
    if (role) {
      localStorage.setItem(`authUser_${role}`, JSON.stringify(newUserData));
    }
  };

  const value = {
    user,
    token,
    role,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUser,
    fetchUserDetails,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
