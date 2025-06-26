import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, Camera } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

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

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-xl font-semibold text-gray-900 hover:text-gray-700 transition-colors"
          >
            <Camera className="h-6 w-6" />
            <span>Unsplash</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-gray-900 ${
                isActivePage('/') ? 'text-gray-900' : 'text-gray-600'
              }`}
            >
              Home
            </Link>
            
            {TOPICS.slice(0, 6).map((topic) => (
              <Link
                key={topic.id}
                to={`/topic/${topic.id}`}
                className={`text-sm font-medium transition-colors hover:text-gray-900 ${
                  location.pathname === `/topic/${topic.id}` ? 'text-gray-900' : 'text-gray-600'
                }`}
              >
                {topic.label}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search photos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-gray-900"
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

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="px-3 py-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search photos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 bg-gray-50 border-0"
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
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
