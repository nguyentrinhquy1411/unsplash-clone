import { Calendar, Camera, Download, Heart } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Skeleton } from "../ui/skeleton";

interface UnsplashPhoto {
  id: string;
  created_at: string;
  updated_at: string;
  width: number;
  height: number;
  color: string;
  description: string | null;
  alt_description: string | null;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  user: {
    id: string;
    username: string;
    name: string;
    profile_image: {
      small: string;
      medium: string;
      large: string;
    };
  };
  likes: number;
  downloads: number;
}

interface PhotoGridProps {
  photos: UnsplashPhoto[];
  isLoading?: boolean;
  columns?: number;
  className?: string;
  onPhotoClick?: (photo: UnsplashPhoto) => void;
  onDownload?: (photo: UnsplashPhoto) => void;
  onFavorite?: (photo: UnsplashPhoto) => void;
  favorites?: string[];
}

interface PhotoCardProps {
  photo: UnsplashPhoto;
  onPhotoClick?: (photo: UnsplashPhoto) => void;
  onDownload?: (photo: UnsplashPhoto) => void;
  onFavorite?: (photo: UnsplashPhoto) => void;
  isFavorite?: boolean;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ photo, onPhotoClick, onDownload, onFavorite, isFavorite = false }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const aspectRatio = photo.height / photo.width;
  const gridRowSpan = Math.ceil(aspectRatio * 10) + 10;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownload?.(photo);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavorite?.(photo);
  };

  return (
    <Card
      className={cn(
        "group cursor-pointer overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]",
        "bg-gradient-to-br from-background to-muted/30"
      )}
      onClick={() => onPhotoClick?.(photo)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0 relative">
        {/* Loading Skeleton */}
        {!isImageLoaded && <Skeleton className="w-full h-64 absolute inset-0" />}

        {/* Main Image */}
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={photo.urls.small}
            alt={photo.alt_description || photo.description || "Photo"}
            className={cn(
              "w-full h-auto object-cover transition-all duration-700",
              isImageLoaded ? "opacity-100" : "opacity-0",
              isHovered && "scale-110"
            )}
            onLoad={() => setIsImageLoaded(true)}
            loading="lazy"
          />

          {/* Color Accent Border */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `linear-gradient(135deg, ${photo.color}20 0%, transparent 50%, ${photo.color}10 100%)`,
            }}
          />

          {/* Hover Overlay */}
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent",
              "opacity-0 group-hover:opacity-100 transition-all duration-300"
            )}
          >
            {/* Top Actions */}
            <div className="absolute top-3 right-3 flex space-x-2">
              <Button
                size="icon"
                variant="secondary"
                className={cn(
                  "h-8 w-8 backdrop-blur-sm",
                  isFavorite ? "bg-red-500 text-white hover:bg-red-600" : "bg-white/90 hover:bg-white"
                )}
                onClick={handleFavorite}
              >
                <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
              </Button>

              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 bg-white/90 hover:bg-white backdrop-blur-sm"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>

            {/* Bottom Info */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-center justify-between">
                {/* User Info */}
                <div className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8 border-2 border-white/50">
                    <AvatarImage src={photo.user.profile_image.small} />
                    <AvatarFallback className="text-xs">{photo.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-white font-semibold text-sm">{photo.user.name}</p>
                    <p className="text-white/80 text-xs">@{photo.user.username}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center space-x-3 text-white">
                  <div className="flex items-center space-x-1">
                    <Heart className="h-3 w-3" />
                    <span className="text-xs font-medium">{photo.likes.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Download className="h-3 w-3" />
                    <span className="text-xs font-medium">{photo.downloads.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Photo Info Bar */}
        <div className="p-3 bg-background/95 backdrop-blur">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                {photo.width} × {photo.height}
              </Badge>
              {photo.description && (
                <span className="text-xs text-muted-foreground truncate max-w-32">{photo.description}</span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">{formatDate(photo.created_at)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const PhotoGrid: React.FC<PhotoGridProps> = ({
  photos,
  isLoading = false,
  columns = 4,
  className,
  onPhotoClick,
  onDownload,
  onFavorite,
  favorites = [],
}) => {
  const navigate = useNavigate();
  const [selectedPhoto, setSelectedPhoto] = useState<UnsplashPhoto | null>(null);

  // Local state for favorites if not provided
  const [localFavorites, setLocalFavorites] = useState<string[]>(() => {
    const stored = localStorage.getItem("favoritePhotos");
    return stored ? JSON.parse(stored).map((p: any) => p.id) : [];
  });

  const gridStyle = {
    gridTemplateColumns: "1fr", // chỉ 1 cột
    gridAutoRows: "auto", // chiều cao tự động theo nội dung
  };

  const handlePhotoClick = (photo: UnsplashPhoto) => {
    // Save to recent photos
    const recentPhotos = JSON.parse(localStorage.getItem("recentPhotos") || "[]");
    const filteredRecent = recentPhotos.filter((p: any) => p.id !== photo.id);
    const newRecent = [photo, ...filteredRecent].slice(0, 50); // Keep last 50
    localStorage.setItem("recentPhotos", JSON.stringify(newRecent));

    // Navigate to photo detail or open modal
    if (onPhotoClick) {
      setSelectedPhoto(photo);
      onPhotoClick(photo);
    } else {
      navigate(`/photo/${photo.id}`);
    }
  };

  const handleDownload = async (photo: UnsplashPhoto) => {
    try {
      const response = await fetch(photo.urls.full);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `photo-${photo.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      onDownload?.(photo);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleFavorite = (photo: UnsplashPhoto) => {
    const favoritePhotos = JSON.parse(localStorage.getItem("favoritePhotos") || "[]");
    const isFavorite = favoritePhotos.some((p: any) => p.id === photo.id);

    let newFavorites;
    if (isFavorite) {
      newFavorites = favoritePhotos.filter((p: any) => p.id !== photo.id);
    } else {
      newFavorites = [photo, ...favoritePhotos];
    }

    localStorage.setItem("favoritePhotos", JSON.stringify(newFavorites));
    setLocalFavorites(newFavorites.map((p: any) => p.id));
    onFavorite?.(photo);
  };
  const isFavorite = (photoId: string) => {
    return favorites.includes(photoId) || localFavorites.includes(photoId);
  };

  if (isLoading) {
    return (
      <div className={cn("grid gap-4", className)} style={gridStyle}>
        {Array.from({ length: 12 }).map((_, index) => (
          <Card key={index} className="overflow-hidden border-0">
            <CardContent className="p-0">
              <Skeleton className="w-full h-64" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className={cn("grid gap-6", className)} style={gridStyle}>
        {photos.map((photo) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            onPhotoClick={handlePhotoClick}
            onDownload={handleDownload}
            onFavorite={handleFavorite}
            isFavorite={isFavorite(photo.id)}
          />
        ))}
      </div>

      {/* Photo Detail Modal */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          {selectedPhoto && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>Photo by {selectedPhoto.user.name}</span>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleDownload(selectedPhoto)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onFavorite?.(selectedPhoto)}>
                      <Heart
                        className={cn(
                          "h-4 w-4 mr-2",
                          favorites.includes(selectedPhoto.id) && "fill-current text-red-500"
                        )}
                      />
                      {favorites.includes(selectedPhoto.id) ? "Favorited" : "Add to Favorites"}
                    </Button>
                  </div>
                </DialogTitle>
                <DialogDescription>
                  <div className="flex items-center space-x-4 mt-2">
                    <Avatar>
                      <AvatarImage src={selectedPhoto.user.profile_image.medium} />
                      <AvatarFallback>{selectedPhoto.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{selectedPhoto.user.name}</p>
                      <p className="text-sm text-muted-foreground">@{selectedPhoto.user.username}</p>
                    </div>
                  </div>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <img
                  src={selectedPhoto.urls.regular}
                  alt={selectedPhoto.alt_description || selectedPhoto.description || "Photo"}
                  className="w-full max-h-96 object-contain rounded-lg"
                />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Camera className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {selectedPhoto.width} × {selectedPhoto.height}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Heart className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedPhoto.likes.toLocaleString()} likes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Download className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedPhoto.downloads.toLocaleString()} downloads</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(selectedPhoto.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {selectedPhoto.description && (
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-muted-foreground">{selectedPhoto.description}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PhotoGrid;
