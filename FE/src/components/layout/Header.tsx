import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, Camera, LogOut, User, Heart, Download, Clock, History, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// Topics for navigation
const TOPICS = [
  { id: 'nature', label: 'Nature', icon: '🌿' },
  { id: 'architecture', label: 'Architecture', icon: '🏛️' },
  { id: 'travel', label: 'Travel', icon: '✈️' },
  { id: 'food', label: 'Food', icon: '🍽️' },
  { id: 'technology', label: 'Technology', icon: '💻' },
  { id: 'sports', label: 'Sports', icon: '⚽' },
  { id: 'art', label: 'Art', icon: '🎨' },
  { id: 'people', label: 'People', icon: '👥' },
];

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  // Load search history from localStorage
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    setSearchHistory(history);
  }, []);

  // Close search history when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchHistory(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent, query?: string) => {
    e.preventDefault();
    const searchTerm = query || searchQuery.trim();
    
    if (searchTerm) {
      // Save to search history
      const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
      const updatedHistory = [searchTerm, ...history.filter((item: string) => item !== searchTerm)].slice(0, 10);
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
      setSearchHistory(updatedHistory);
      
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setIsMobileMenuOpen(false);
      setShowSearchHistory(false);
      
      if (!query) {
        setSearchQuery('');
      }
    }
  };

  const handleSearchFromHistory = (historyItem: string) => {
    setSearchQuery(historyItem);
    const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
    handleSearch(fakeEvent, historyItem);
  };

  const clearSearchHistory = () => {
    localStorage.removeItem('searchHistory');
    setSearchHistory([]);
  };

  const removeFromHistory = (itemToRemove: string) => {
    const updatedHistory = searchHistory.filter(item => item !== itemToRemove);
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    setSearchHistory(updatedHistory);
  };

  const isActivePage = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-morphism border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* First Row: Logo, Search, Auth Actions */}
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 text-xl font-bold text-gray-900 hover:text-gray-700 transition-colors group"
          >
            <div className="p-2 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl group-hover:from-gray-800 group-hover:to-gray-600 transition-all duration-300">
              <Camera className="h-5 w-5 text-white" />
            </div>
            <span className="hidden sm:block tracking-tight">Unsplash</span>
          </Link>

          {/* Search Bar - Compact */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div 
              ref={searchRef}
              className="w-full relative"
              onMouseEnter={() => setShowSearchHistory(true)}
            >
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 group-focus-within:text-gray-600 transition-all duration-300 z-10" />
                  
                  <input
                    type="text"
                    placeholder="Search photos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowSearchHistory(true)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50/80 backdrop-blur-sm border border-gray-200/60 rounded-xl text-sm
                             focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900/30 focus:bg-white
                             hover:border-gray-300/80 hover:bg-gray-50
                             transition-all duration-300 ease-out
                             placeholder-gray-400 text-gray-900 font-medium
                             shadow-sm hover:shadow-md focus:shadow-lg"
                  />
                </div>
              </form>

              {/* Compact Search History Dropdown */}
              {showSearchHistory && searchHistory.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 py-2 z-50 max-h-80 overflow-hidden
                               animate-in slide-in-from-top-2 fade-in duration-300">
                  {/* Header */}
                  <div className="px-4 py-2 border-b border-gray-100/80">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                        <History className="h-3 w-3 text-gray-500" />
                        Recent
                      </span>
                      <button
                        onClick={clearSearchHistory}
                        className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded-md hover:bg-gray-100 transition-all duration-200"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                  
                  {/* History Items */}
                  <div className="py-1 max-h-60 overflow-y-auto custom-scrollbar">
                    {searchHistory.slice(0, 6).map((item, index) => (
                      <div
                        key={index}
                        className="group flex items-center justify-between mx-2 px-3 py-2 hover:bg-gray-50/80 cursor-pointer transition-all duration-200 rounded-lg"
                        onClick={() => handleSearchFromHistory(item)}
                      >
                        <div className="flex items-center gap-2">
                          <History className="h-3 w-3 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
                          <span className="text-xs text-gray-700 group-hover:text-gray-900 font-medium transition-colors duration-200 truncate">{item}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromHistory(item);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 hover:text-red-600 rounded-md transition-all duration-200"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-1">
            {/* Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1">
              <Link
                to="/recent"
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActivePage('/recent') 
                    ? 'bg-gray-900 text-white shadow-lg' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Clock className="h-4 w-4" />
                <span>Recent</span>
              </Link>
              
              <Link
                to="/favorites"
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActivePage('/favorites') 
                    ? 'bg-gray-900 text-white shadow-lg' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Heart className="h-4 w-4" />
                <span>Favorites</span>
              </Link>
              
              <Link
                to="/downloads"
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActivePage('/downloads') 
                    ? 'bg-gray-900 text-white shadow-lg' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Download className="h-4 w-4" />
                <span>Downloads</span>
              </Link>
            </div>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-900 to-gray-700 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium">{user?.email || 'User'}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Second Row: Topics Navigation */}
        <div className="hidden lg:block border-t border-gray-100/50">
          <nav className="flex items-center justify-center space-x-6 py-4">
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActivePage('/') 
                  ? 'bg-gray-100 text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span>🏠</span>
              <span>Home</span>
            </Link>
            
            {TOPICS.map((topic) => (
              <Link
                key={topic.id}
                to={`/topic/${topic.id}`}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  location.pathname === `/topic/${topic.id}` 
                    ? 'bg-gray-100 text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="text-base">{topic.icon}</span>
                <span>{topic.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200/50 bg-white/95 backdrop-blur-lg">
            <div className="px-4 pt-4 pb-6 space-y-4">
              {/* Mobile Search */}
              <div className="space-y-4">
                <form onSubmit={handleSearch}>
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-gray-600 group-focus-within:scale-110 transition-all duration-300" />
                    <input
                      type="text"
                      placeholder="Search photos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-6 py-4 bg-white/95 backdrop-blur-sm border-2 border-gray-200/60 rounded-2xl text-base
                               focus:ring-3 focus:ring-gray-900/10 focus:border-gray-900/40 focus:bg-white
                               hover:border-gray-300/80 hover:bg-white
                               transition-all duration-300 ease-out
                               placeholder-gray-400 text-gray-900 font-medium
                               shadow-md hover:shadow-lg focus:shadow-xl
                               transform-gpu group-focus-within:scale-[1.01]"
                    />
                  </div>
                </form>

                {/* Enhanced Mobile Search History */}
                {searchHistory.length > 0 && (
                  <div className="bg-gradient-to-br from-gray-50/90 to-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-200/50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <div className="p-1 bg-gray-200 rounded-md">
                          <History className="h-3 w-3 text-gray-600" />
                        </div>
                        Recent
                      </span>
                      <button
                        onClick={clearSearchHistory}
                        className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded-md hover:bg-gray-200/50 transition-all duration-200 font-medium"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="space-y-1">
                      {searchHistory.slice(0, 5).map((item, index) => (
                        <button
                          key={index}
                          onClick={() => handleSearchFromHistory(item)}
                          className="w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-white/80 rounded-xl transition-all duration-200 flex items-center gap-3 group
                                   hover:shadow-md hover:scale-[1.01] transform-gpu"
                        >
                          <div className="p-1 text-gray-400 group-hover:text-gray-600 group-hover:bg-gray-100 rounded-md transition-all duration-200">
                            <History className="h-3 w-3" />
                          </div>
                          <span className="font-medium">{item}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Navigation */}
              <div className="space-y-2">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                    isActivePage('/') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span>🏠</span>
                  <span>Home</span>
                </Link>
                
                {/* Topics Section */}
                <div className="pt-2">
                  <div className="px-4 py-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Topics</span>
                  </div>
                  {TOPICS.map((topic) => (
                    <Link
                      key={topic.id}
                      to={`/topic/${topic.id}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                        location.pathname === `/topic/${topic.id}` ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-lg">{topic.icon}</span>
                      <span>{topic.label}</span>
                    </Link>
                  ))}
                </div>
                
                {/* Other Pages */}
                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <Link
                    to="/recent"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                      isActivePage('/recent') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Clock className="h-5 w-5" />
                    <span>Recent</span>
                  </Link>
                  
                  <Link
                    to="/favorites"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                      isActivePage('/favorites') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Heart className="h-5 w-5" />
                    <span>Favorites</span>
                  </Link>
                  
                  <Link
                    to="/downloads"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                      isActivePage('/downloads') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Download className="h-5 w-5" />
                    <span>Downloads</span>
                  </Link>
                </div>

                {/* Auth Section */}
                {isAuthenticated ? (
                  <div className="border-t border-gray-100 pt-4 space-y-2">
                    <div className="flex items-center gap-3 px-4 py-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-700 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-base font-medium text-gray-900">{user?.email || 'User'}</span>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-200"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="border-t border-gray-100 pt-4 space-y-3">
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center px-4 py-3 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-200"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-200 text-base font-medium shadow-lg"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
