import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function PublicRoute({ children }) {
  const { user } = useAuth();

  if (user?.role === 'company') {
    return <Navigate to="/company-dashboard" replace />;
  }

  if (user?.role === 'user') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
