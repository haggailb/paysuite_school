// components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, requiredModule }) => {
  const allowedModules = JSON.parse(sessionStorage.getItem("allowedModules") || "[]");

  if (allowedModules.includes(requiredModule)) {
    return element;
  } else {
    return <Navigate to="/unauthorized" replace />;
  }
};

export default ProtectedRoute;
