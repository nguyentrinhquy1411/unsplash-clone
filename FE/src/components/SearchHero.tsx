import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, History, X, Sparkles, Zap } from 'lucide-react';

const TRENDING_SEARCHES = [
  'nature', 'mountains', 'ocean', 'sunset', 'city', 'flowers', 'architecture', 'space'
];

const SearchHero: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [currentTrendingIndex, setCurrentTrendingIndex] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Load search history from localStorage
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    setSearchHistory(history);
  }, []);

  // Animate trending searches
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTrendingIndex((prev) => (prev + 1) % TRENDING_SEARCHES.length);
    }, 3000);
    return () => clearInterval(interval);
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

  const handleTrendingSearch = (trendingItem: string) => {
    setSearchQuery(trendingItem);
    const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
    handleSearch(fakeEvent, trendingItem);
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

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Main Search Container */}
      <div 
        ref={searchRef}
        className="relative w-full"
        onMouseEnter={() => setShowSearchHistory(true)}
      >
        <form onSubmit={handleSearch} className="w-full">
          <div className="relative group">
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-focus-within:opacity-100 transition-all duration-500 scale-110"></div>
            
            {/* Search Icon */}
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6 group-focus-within:text-gray-600 group-focus-within:scale-110 transition-all duration-300 z-10" />
            
            {/* Search Input */}
            <input
              type="text"
              placeholder={`Try "${TRENDING_SEARCHES[currentTrendingIndex]}" or search for anything...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSearchHistory(true)}
              className="w-full pl-16 pr-8 py-6 bg-white/95 backdrop-blur-xl border-2 border-gray-200/60 rounded-3xl text-xl
                       focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400/50 focus:bg-white focus:shadow-2xl
                       hover:border-gray-300/80 hover:bg-white
                       transition-all duration-500 ease-out
                       placeholder-gray-400 text-gray-900 font-medium
                       shadow-xl hover:shadow-2xl
                       group-focus-within:scale-[1.02] transform-gpu"
            />
            
            {/* Sparkle Animation */}
            <div className="absolute right-6 top-1/2 transform -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-all duration-300">
              <Sparkles className="h-5 w-5 text-blue-400 animate-pulse" />
            </div>
          </div>
        </form>

        {/* Search History Dropdown */}
        {showSearchHistory && (searchHistory.length > 0 || TRENDING_SEARCHES.length > 0) && (
          <div className="absolute top-full left-0 right-0 mt-4 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 py-4 z-50 max-h-96 overflow-hidden
                         animate-in slide-in-from-top-2 fade-in duration-500">
            
            {/* Recent Searches */}
            {searchHistory.length > 0 && (
              <div className="mb-4">
                <div className="px-6 py-3 border-b border-gray-100/80">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-800 flex items-center gap-2">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <History className="h-4 w-4 text-blue-600" />
                      </div>
                      Recent searches
                    </span>
                    <button
                      onClick={clearSearchHistory}
                      className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium"
                    >
                      Clear all
                    </button>
                  </div>
                </div>
                
                <div className="px-3 py-2 max-h-48 overflow-y-auto custom-scrollbar">
                  {searchHistory.slice(0, 5).map((item, index) => (
                    <div
                      key={index}
                      className="group flex items-center justify-between px-4 py-3 hover:bg-blue-50/50 cursor-pointer transition-all duration-200 rounded-2xl
                                 hover:shadow-md hover:scale-[1.01] transform-gpu"
                      onClick={() => handleSearchFromHistory(item)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 text-gray-400 group-hover:text-blue-600 group-hover:bg-blue-100 rounded-lg transition-all duration-200">
                          <History className="h-4 w-4" />
                        </div>
                        <span className="text-gray-700 group-hover:text-gray-900 font-medium transition-colors duration-200">{item}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromHistory(item);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Searches */}
            <div>
              <div className="px-6 py-3 border-b border-gray-100/80">
                <span className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-pink-50 to-orange-50 rounded-lg">
                    <Zap className="h-4 w-4 text-orange-600" />
                  </div>
                  Trending searches
                </span>
              </div>
              
              <div className="px-3 py-2">
                <div className="flex flex-wrap gap-2">
                  {TRENDING_SEARCHES.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleTrendingSearch(item)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 transform-gpu
                                ${index === currentTrendingIndex 
                                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-gray-100/80">
              <p className="text-xs text-gray-500 text-center">
                Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">Enter</kbd> to search or click on any suggestion
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchHero;
