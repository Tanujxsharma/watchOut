import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userType, setUserType] = useState(null)

  useEffect(() => {
    // Check if user is logged in by checking localStorage
    const storedUserType = localStorage.getItem('userType')
    setIsLoggedIn(!!storedUserType)
    setUserType(storedUserType)
  }, [location.pathname])

  const handleLoginClick = (e) => {
    e.preventDefault()
    // Check if user is already logged in
    const storedUserType = localStorage.getItem('userType')
    
    if (storedUserType) {
      // User is already logged in, redirect to their respective dashboard
      if (storedUserType === 'company') {
        navigate('/company-dashboard')
      } else {
        navigate('/dashboard')
      }
    } else {
      // User is not logged in, go to login page
      navigate('/login')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('userType')
    setIsLoggedIn(false)
    setUserType(null)
    navigate('/login')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left side - Logo and App Name */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg">
              <span className="text-white text-xl font-bold">WO</span>
            </div>
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                WatchOut
              </span>
            </Link>
          </div>

          {/* Center - Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/dashboard"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-blue-50"
            >
              Dashboard
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-blue-50"
            >
              About
            </Link>
            <Link
              to="/transparency"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-blue-50"
            >
              Transparency
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-blue-50"
            >
              Contact
            </Link>
          </div>

          {/* Right side - Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <button
                  onClick={handleLoginClick}
                  className="px-6 py-2.5 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-200"
                >
                  {userType === 'company' ? 'Company Dashboard' : 'Dashboard'}
                </button>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleLoginClick}
                  className="px-6 py-2.5 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-200"
                >
                  Login
                </button>
                <Link
                  to="/register"
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

