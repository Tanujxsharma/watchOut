import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Shield, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, govToken, logoutGovernment } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      if (govToken) {
        logoutGovernment();
        navigate('/government/login');
      } else {
        await logout();
        navigate('/login');
      }
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const getDashboardLink = () => {
    if (govToken) return '/government/dashboard';
    if (user?.role === 'company') return '/company-dashboard';
    return '/dashboard';
  };

  const isLoggedIn = user || govToken;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl text-slate-900">WatchOut</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link to="/" className="text-slate-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Home
            </Link>
            <Link to="/tenders" className="text-slate-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Tenders
            </Link>
            
            {isLoggedIn ? (
              <div className="flex items-center gap-4 ml-4">
                <Link to={getDashboardLink()}>
                  <Button variant="ghost" size="sm">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button onClick={handleLogout} variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-4">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50">
                Home
              </Link>
              <Link to="/tenders" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50">
                Tenders
              </Link>
              {isLoggedIn ? (
                <>
                  <Link to={getDashboardLink()} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50">
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2 p-2">
                  <Link to="/login">
                    <Button variant="outline" className="w-full justify-center">Login</Button>
                  </Link>
                  <Link to="/register">
                    <Button className="w-full justify-center">Register</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
