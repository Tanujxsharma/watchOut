import { Navigate } from 'react-router-dom'

export default function PublicRoute({ children }) {
  const userType = localStorage.getItem('userType')

  // If user is already logged in, redirect to their dashboard
  if (userType) {
    if (userType === 'company') {
      return <Navigate to="/company-dashboard" replace />
    } else {
      return <Navigate to="/dashboard" replace />
    }
  }

  return children
}

