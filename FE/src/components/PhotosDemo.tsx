import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchRandomPhotos, searchPhotos, UnsplashPhoto } from '../store/photosSlice';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

const PhotosDemo: React.FC = () => {
  const dispatch = useAppDispatch();
  const { photos, isLoading, error } = useAppSelector((state) => state.photos);
  
  const [count, setCount] = useState('10');
  const [query, setQuery] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<UnsplashPhoto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGetRandomPhotos = () => {
    dispatch(fetchRandomPhotos({ count: parseInt(count) }));
  };

  const handleSearchPhotos = () => {
    if (query.trim()) {
      dispatch(searchPhotos({ query: query.trim(), perPage: parseInt(count) }));
    }
  };

  const handleClear = () => {
    setQuery('');
    setSelectedPhoto(null);
    setIsModalOpen(false);
  };

  const openModal = (photo: UnsplashPhoto) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPhoto(null);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">Unsplash Clone</h1>
        <p className="text-muted-foreground text-center">
          Browse beautiful photos from our API
        </p>
      </div>

      {/* Controls Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Photo Controls</CardTitle>
          <CardDescription>
            Get random photos or search for specific images
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search-input">Search Photos</Label>
              <Input
                id="search-input"
                type="text"
                placeholder="Enter search term..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchPhotos()}
              />
            </div>
            <div className="w-full sm:w-32">
              <Label htmlFor="count-select">Count</Label>
              <Select value={count} onValueChange={setCount}>
                <SelectTrigger id="count-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
            <div className="flex flex-wrap gap-2">
            <Button onClick={handleGetRandomPhotos} disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Get Random Photos'}
            </Button>
            <Button onClick={handleSearchPhotos} disabled={isLoading || !query.trim()}>
              Search Photos
            </Button>
            <Button variant="outline" onClick={handleClear}>
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert className="mb-6 border-red-500 bg-red-50">
          <AlertDescription className="text-red-700">
            {error}
          </AlertDescription>
        </Alert>
      )}      {/* Success Alert */}
      {!isLoading && !error && photos.length > 0 && (
        <Alert className="mb-6 border-green-500 bg-green-50">
          <AlertDescription className="text-green-700">
            Successfully loaded {photos.length} photo{photos.length !== 1 ? 's' : ''}
          </AlertDescription>
        </Alert>
      )}

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: parseInt(count) }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <Skeleton className="w-full h-48 mb-3" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Photos Grid */}
      {!isLoading && photos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <Card 
              key={photo.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => openModal(photo)}
            >              <CardContent className="p-0">
                <div className="aspect-square overflow-hidden rounded-t-lg">
                  <img
                    src={photo.urls.regular}
                    alt={photo.alt_description || photo.description || 'Photo'}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-1 line-clamp-1">
                    {photo.alt_description || photo.description || 'Untitled'}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    by {photo.user.name || photo.user.username}
                  </p>
                  <div className="flex gap-1">
                    <Badge variant="secondary" className="text-xs">
                      {photo.width}×{photo.height}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}      {/* No Results */}
      {!isLoading && !error && photos.length === 0 && query && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No photos found for "{query}". Try a different search term.
          </p>
        </div>
      )}

      {/* Photo Modal using Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          {selectedPhoto && (            <>
              <DialogHeader>
                <DialogTitle>{selectedPhoto.alt_description || selectedPhoto.description || 'Untitled'}</DialogTitle>
                <DialogDescription>
                  Photo by {selectedPhoto.user.name || selectedPhoto.user.username}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="flex justify-center">
                  <img
                    src={selectedPhoto.urls.regular}
                    alt={selectedPhoto.alt_description || selectedPhoto.description || 'Photo'}
                    className="max-w-full max-h-96 object-contain rounded-lg"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Author</Label>
                    <p className="text-sm text-muted-foreground">{selectedPhoto.user.name || selectedPhoto.user.username}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Dimensions</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedPhoto.width} × {selectedPhoto.height} pixels
                    </p>
                  </div>
                  
                  {(selectedPhoto.description || selectedPhoto.alt_description) && (
                    <div className="md:col-span-2">
                      <Label className="text-sm font-medium">Description</Label>
                      <p className="text-sm text-muted-foreground">{selectedPhoto.description || selectedPhoto.alt_description}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button asChild>
                    <a 
                      href={selectedPhoto.urls.full} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      View Full Size
                    </a>
                  </Button>
                  <Button variant="outline" onClick={closeModal}>
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PhotosDemo;
