import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userRole, setUserRole] = useState(null);
  
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsAuthenticated(false);
        return;
      }
      
      try {
        // Configure axios to send the token in the header
        const config = {
          headers: {
            'x-auth-token': token
          }
        };
        
        // Verify token with backend
        const res = await axios.get('http://localhost:5000/api/auth/user', config);
        
        setIsAuthenticated(true);
        setUserRole(res.data.role);
      } catch (err) {
        console.error('Token verification failed', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
      }
    };
    
    verifyToken();
  }, []);
  
  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return <div className="loading-spinner">Verifying authentication...</div>;
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if user has the required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  // User is authenticated and authorized
  return children;
};

export default ProtectedRoute;
