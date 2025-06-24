import React from 'react';
import { PhotoGrid } from '../components/photos/PhotoGrid';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardTitle } from '../components/ui/card';
import { Heart, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';

const FavoritesPage: React.FC = () => {
  // In a real app, this would come from local storage or state management
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Favorite Photos</h1>
        </div>
        
        <Card className="text-center py-12">
          <CardContent>
            <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <CardTitle className="mb-2">No favorite photos</CardTitle>
            <p className="text-muted-foreground mb-4">
              Heart photos you love to save them here.
            </p>
            <Button variant="outline" onClick={() => window.history.back()}>
              Browse Photos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Favorite Photos</h1>
          <p className="text-muted-foreground">
            {favoritePhotos.length} photo{favoritePhotos.length !== 1 ? 's' : ''} saved
          </p>
        </div>
        <Button variant="outline" onClick={clearFavorites}>
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </div>

      <Alert>
        <Heart className="h-4 w-4" />
        <AlertDescription>
          Favorite photos are stored locally and will be cleared when you clear your browser data.
        </AlertDescription>
      </Alert>

      <PhotoGrid photos={favoritePhotos} />
    </div>
  );
};

export default FavoritesPage;
