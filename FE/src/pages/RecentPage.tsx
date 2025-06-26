import React from 'react';
import PhotoCard from '../components/PhotoCard';
import { Trash2 } from 'lucide-react';

const RecentPage: React.FC = () => {
  const [recentPhotos, setRecentPhotos] = React.useState<any[]>([]);

  React.useEffect(() => {
    const stored = localStorage.getItem('recentPhotos');
    if (stored) {
      try {
        setRecentPhotos(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse recent photos:', error);
      }
    }
  }, []);

  const clearRecent = () => {
    localStorage.removeItem('recentPhotos');
    setRecentPhotos([]);
  };

  if (recentPhotos.length === 0) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-semibold text-gray-900">Recent Photos</h1>
        <div className="text-center py-16">
          <div className="text-6xl mb-4">⏰</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No recent photos</h3>
          <p className="text-gray-600 mb-6">
            Photos you view will appear here for quick access.
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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Recent Photos</h1>
          <p className="text-gray-600 mt-1">{recentPhotos.length} photos viewed recently</p>
        </div>
        
        <button
          onClick={clearRecent}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          Clear All
        </button>
      </div>

      <div style={masonryStyle}>
        {recentPhotos.map((photo, index) => (
          <PhotoCard key={`${photo.id}-${index}`} photo={photo} />
        ))}
      </div>
    </div>
  );
};

export default RecentPage;
