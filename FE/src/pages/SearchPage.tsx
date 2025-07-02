import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import InfinitePhotoGrid from '../components/photos/InfinitePhotoGrid';
import { Search, X } from 'lucide-react';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput.trim());
      setSearchParams({ q: searchInput.trim() });
    }
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
    setSearchParams({});
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-6">
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
          Search Photos
        </h1>
        
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search for photos..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-12 pr-20 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-2">
              {searchInput && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button 
                type="submit"
                className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </form>

        {searchQuery && (
          <div className="flex items-center justify-center gap-2">
            <span className="text-gray-600">Showing results for:</span>
            <span className="font-medium text-gray-900">"{searchQuery}"</span>
            <button
              onClick={clearSearch}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {searchQuery ? (
        <InfinitePhotoGrid searchQuery={searchQuery} />
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Start searching</h3>
          <p className="text-gray-600">Enter a search term above to find photos</p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
