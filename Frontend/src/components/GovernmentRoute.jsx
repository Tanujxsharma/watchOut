import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function GovernmentRoute({ children }) {
  const { govToken } = useAuth();
  const location = useLocation();

  if (!govToken) {
    return <Navigate to="/government/login" state={{ from: location }} replace />;
  }

  return children;
}

