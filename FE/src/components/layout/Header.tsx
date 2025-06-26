import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, Camera, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// Topics for navigation
const TOPICS = [
  { id: 'nature', label: 'Nature' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'travel', label: 'Travel' },
  { id: 'food', label: 'Food' },
  { id: 'technology', label: 'Technology' },
  { id: 'sports', label: 'Sports' },
  { id: 'art', label: 'Art' },
  { id: 'people', label: 'People' },
];

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const isActivePage = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
        {/* First Row: Logo, Search, Auth Actions */}
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-xl font-semibold text-gray-900 hover:text-gray-700 transition-colors"
          >
            <Camera className="h-6 w-6" />
            <span>Unsplash</span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search photos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-gray-50"
                />
              </div>
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <Link
              to="/recent"
              className={`hidden md:block text-sm font-medium transition-colors hover:text-gray-900 ${
                isActivePage('/recent') ? 'text-gray-900' : 'text-gray-600'
              }`}
            >
              Recent
            </Link>
            <Link
              to="/favorites"
              className={`hidden md:block text-sm font-medium transition-colors hover:text-gray-900 ${
                isActivePage('/favorites') ? 'text-gray-900' : 'text-gray-600'
              }`}
            >
              Favorites
            </Link>
            <Link
              to="/downloads"
              className={`hidden md:block text-sm font-medium transition-colors hover:text-gray-900 ${
                isActivePage('/downloads') ? 'text-gray-900' : 'text-gray-600'
              }`}
            >
              Downloads
            </Link>

            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-4">
                <span className="text-sm text-gray-600">Hi, {user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Second Row: Topics Navigation */}
        <div className="hidden lg:block border-t border-gray-100">
          <nav className="flex items-center justify-center space-x-8 py-3">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-gray-900 ${
                isActivePage('/') ? 'text-gray-900 border-b-2 border-gray-900 pb-1' : 'text-gray-600'
              }`}
            >
              Home
            </Link>
            
            {TOPICS.map((topic) => (
              <Link
                key={topic.id}
                to={`/topic/${topic.id}`}
                className={`text-sm font-medium transition-colors hover:text-gray-900 ${
                  location.pathname === `/topic/${topic.id}` 
                    ? 'text-gray-900 border-b-2 border-gray-900 pb-1' 
                    : 'text-gray-600'
                }`}
              >
                {topic.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="px-3 py-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search photos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-gray-50"
                  />
                </div>
              </form>

              {/* Mobile Navigation */}
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 text-base font-medium transition-colors ${
                  isActivePage('/') ? 'text-gray-900 bg-gray-50' : 'text-gray-600'
                }`}
              >
                Home
              </Link>
              
              {/* Topics Section */}
              <div className="border-t border-gray-100 mt-2 pt-2">
                <div className="px-3 py-1">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Topics</span>
                </div>
                {TOPICS.map((topic) => (
                  <Link
                    key={topic.id}
                    to={`/topic/${topic.id}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-3 py-2 text-base font-medium transition-colors ${
                      location.pathname === `/topic/${topic.id}` ? 'text-gray-900 bg-gray-50' : 'text-gray-600'
                    }`}
                  >
                    {topic.label}
                  </Link>
                ))}
              </div>
              
              {/* Other Pages */}
              <div className="border-t border-gray-100 mt-2 pt-2">
                <Link
                  to="/recent"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 text-base font-medium transition-colors ${
                    isActivePage('/recent') ? 'text-gray-900 bg-gray-50' : 'text-gray-600'
                  }`}
                >
                  Recent
                </Link>
                
                <Link
                  to="/favorites"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 text-base font-medium transition-colors ${
                    isActivePage('/favorites') ? 'text-gray-900 bg-gray-50' : 'text-gray-600'
                  }`}
                >
                  Favorites
                </Link>
                
                <Link
                  to="/downloads"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 text-base font-medium transition-colors ${
                    isActivePage('/downloads') ? 'text-gray-900 bg-gray-50' : 'text-gray-600'
                  }`}
                >
                  Downloads
                </Link>
              </div>

              {/* Auth Section */}
              {isAuthenticated ? (
                <div className="border-t border-gray-200 pt-4">
                  <div className="px-3 py-2">
                    <p className="text-sm text-gray-600">Hi, {user?.name}</p>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block mx-3 py-2 px-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-center"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
