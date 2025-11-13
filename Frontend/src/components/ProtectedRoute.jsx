import { Navigate, useLocation } from 'react-router-dom'

export default function ProtectedRoute({ children, requiredRole = null }) {
  const location = useLocation()
  const userType = localStorage.getItem('userType')

  // If route requires specific role (like company dashboard)
  if (requiredRole) {
    // If no user is logged in, redirect to login
    if (!userType) {
      return <Navigate to="/login" state={{ from: location, requireCompany: requiredRole === 'company' }} replace />
    }
    
    // If user has wrong role, redirect to their appropriate dashboard
    if (userType !== requiredRole) {
      if (userType === 'company') {
        return <Navigate to="/company-dashboard" replace />
      } else {
        return <Navigate to="/dashboard" replace />
      }
    }
  } else {
    // For public routes (like dashboard), if company user tries to access, redirect them
    if (userType === 'company') {
      return <Navigate to="/company-dashboard" replace />
    }
    // Public users and non-logged-in users can access public dashboard
  }

  return children
}

