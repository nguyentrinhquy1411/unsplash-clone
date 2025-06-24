import React from 'react';
import { PhotoGrid } from '../components/photos/PhotoGrid';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardTitle } from '../components/ui/card';
import { Clock, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';

const RecentPage: React.FC = () => {
  // In a real app, this would come from local storage or state management
  const [recentPhotos, setRecentPhotos] = React.useState<any[]>([]);

  React.useEffect(() => {
    // Load recent photos from localStorage
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Recent Photos</h1>
        </div>
        
        <Card className="text-center py-12">
          <CardContent>
            <Clock className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <CardTitle className="mb-2">No recent photos</CardTitle>
            <p className="text-muted-foreground mb-4">
              Photos you view will appear here for quick access.
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
          <h1 className="text-3xl font-bold">Recent Photos</h1>
          <p className="text-muted-foreground">
            {recentPhotos.length} photo{recentPhotos.length !== 1 ? 's' : ''} viewed recently
          </p>
        </div>
        <Button variant="outline" onClick={clearRecent}>
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </div>

      <Alert>
        <Clock className="h-4 w-4" />
        <AlertDescription>
          Recent photos are stored locally and will be cleared when you clear your browser data.
        </AlertDescription>
      </Alert>

      <PhotoGrid photos={recentPhotos} />
    </div>
  );
};

export default RecentPage;
