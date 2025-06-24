import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { InfinitePhotoGrid } from '../components/photos/InfinitePhotoGrid';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
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
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Search Photos
        </h1>
        
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search for photos..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10 pr-20 h-12 text-lg"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
              {searchInput && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <Button type="submit" size="sm" className="h-8">
                Search
              </Button>
            </div>
          </div>
        </form>
      </div>

      {searchQuery ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              Results for "{searchQuery}"
            </h2>
            <Button variant="outline" onClick={clearSearch}>
              <X className="h-4 w-4 mr-2" />
              Clear search
            </Button>
          </div>
          <InfinitePhotoGrid searchQuery={searchQuery} />
        </div>
      ) : (
        <div className="text-center py-12">
          <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">Start your search</h3>
          <p className="text-muted-foreground">
            Enter a keyword above to discover amazing photos
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
