import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');

  // Check if token exists and is valid (optional validation)
  const isValidToken = (token: string | null): boolean => {
    if (!token) return false;
    
    try {
      // Optional: Add JWT expiration check
      // const decoded = JSON.parse(atob(token.split('.')[1]));
      // return decoded.exp > Date.now() / 1000;
      return true; // Simple check - token exists
    } catch {
      return false;
    }
  };

  if (!isValidToken(token)) {
    // Clear invalid token if it exists but is invalid
    if (token) {
      localStorage.removeItem('token');
    }
    
    // Redirect to login and remember the page user tried to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;