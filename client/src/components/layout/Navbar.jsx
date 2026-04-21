import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="bg-white dark:bg-slate-900 shadow border-b border-gray-100 dark:border-slate-700 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-primary-500" />
              <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight">NourishLink</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {!token ? (
              <>
                <Link to="/login" className="text-gray-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition font-medium">Log In</Link>
                <Link to="/register" className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-full font-medium transition shadow-sm">Sign Up</Link>
              </>
            ) : (
              <>
                <Link to={`/dashboard/${user?.role?.toLowerCase()}`} className="text-gray-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition font-medium">Dashboard</Link>
                <button onClick={handleLogout} className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition">Logout</button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
