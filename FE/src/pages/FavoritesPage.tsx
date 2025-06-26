import React from 'react';
import PhotoCard from '../components/PhotoCard';
import { Trash2 } from 'lucide-react';

const FavoritesPage: React.FC = () => {
  const [favoritePhotos, setFavoritePhotos] = React.useState<any[]>([]);

  React.useEffect(() => {
    // Load favorite photos from localStorage
    const stored = localStorage.getItem('favoritePhotos');
    if (stored) {
      try {
        setFavoritePhotos(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse favorite photos:', error);
      }
    }
  }, []);

  const clearFavorites = () => {
    localStorage.removeItem('favoritePhotos');
    setFavoritePhotos([]);
  };

  if (favoritePhotos.length === 0) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-gray-900">Favorite Photos</h1>
        </div>
        
        <div className="text-center py-16">
          <div className="text-6xl mb-4">❤️</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No favorite photos</h3>
          <p className="text-gray-600 mb-6">
            Heart photos you love to save them here.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Browse Photos
          </button>
        </div>
      </div>
    );
  }

  const masonryStyle: React.CSSProperties = {
    columnCount: 3,
    columnGap: '20px',
    columnFill: 'balance' as const,
  };

  const getResponsiveColumns = () => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  };

  const responsiveStyle: React.CSSProperties = {
    ...masonryStyle,
    columnCount: getResponsiveColumns(),
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Favorite Photos</h1>
          <p className="text-gray-600 mt-1">{favoritePhotos.length} photos saved</p>
        </div>
        
        <button
          onClick={clearFavorites}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          Clear All
        </button>
      </div>

      <div style={responsiveStyle}>
        {favoritePhotos.map((photo, index) => (
          <PhotoCard key={`${photo.id}-${index}`} photo={photo} />
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;
