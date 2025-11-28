import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handlePrimaryAction = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role === 'company') {
      navigate('/company-dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const avatarUrl = user
    ? user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'Watch Out')}&background=0F172A&color=fff`
    : null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-linear-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg">
              <span className="text-white text-xl font-bold">WO</span>
            </div>
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold bg-linear-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                WatchOut
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/dashboard"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-blue-50"
            >
              Dashboard
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

          <div className="flex items-center space-x-3">
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="flex items-center gap-3 rounded-full border border-gray-200 bg-white/90 px-3 py-2 shadow-sm hover:shadow-md transition"
                >
                  <img
                    src={avatarUrl}
                    alt={user.displayName || 'User avatar'}
                    className="h-10 w-10 rounded-full object-cover border border-white shadow"
                  />
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-semibold text-slate-900">{user.displayName || 'WatchOut User'}</p>
                    <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-4 w-4 text-slate-500"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-3 w-56 rounded-xl border border-slate-100 bg-white p-2 shadow-xl">
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        handlePrimaryAction();
                      }}
                      className="w-full px-4 py-2 text-left text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-50"
                    >
                      Go to dashboard
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        logout();
                      }}
                      className="w-full px-4 py-2 text-left text-sm font-medium text-red-600 rounded-lg hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handlePrimaryAction}
                className="px-6 py-2.5 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-200"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
