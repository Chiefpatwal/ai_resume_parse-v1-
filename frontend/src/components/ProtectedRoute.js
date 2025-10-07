import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, isLoggedIn }) => {
  const location = useLocation();

  if (!isLoggedIn) {
    // Redirect to the login page, but store the current location so we can
    // redirect back after the user logs in.
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If the user is logged in, render the child components
  return children;
};

export default ProtectedRoute;
