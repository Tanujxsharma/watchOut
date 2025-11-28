import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children, requiredRole = null }) {
  const location = useLocation();
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    const fallback = user.role === 'company' ? '/company-dashboard' : '/dashboard';
    return <Navigate to={fallback} replace />;
  }

  return children;
}
