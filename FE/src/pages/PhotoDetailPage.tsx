import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Download, Heart, ExternalLink, User, Eye, Calendar, Camera, Maximize2, X } from 'lucide-react';
import { fetchPhotoById } from '../services/api';

const PhotoDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: photo, isLoading, error } = useQuery({
    queryKey: ['photo', id],
    queryFn: () => fetchPhotoById(id!),
    enabled: !!id,
  });

  // Check if photo is in favorites on mount
  React.useEffect(() => {
    if (photo) {
      const favorites = JSON.parse(localStorage.getItem('favoritePhotos') || '[]');
      setIsFavorite(favorites.some((p: any) => p.id === photo.id));
    }
  }, [photo]);

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      // Save to download history
      if (photo) {
        const downloadHistory = JSON.parse(localStorage.getItem('downloadHistory') || '[]');
        const filteredHistory = downloadHistory.filter((p: any) => p.id !== photo.id);
        const newHistory = [photo, ...filteredHistory].slice(0, 100);
        localStorage.setItem('downloadHistory', JSON.stringify(newHistory));
      }
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleFavorite = () => {
    if (!photo) return;
    
    const favorites = JSON.parse(localStorage.getItem('favoritePhotos') || '[]');
    const isCurrentlyFavorite = favorites.some((p: any) => p.id === photo.id);
    
    let newFavorites;
    if (isCurrentlyFavorite) {
      newFavorites = favorites.filter((p: any) => p.id !== photo.id);
    } else {
      newFavorites = [photo, ...favorites];
    }
    
    localStorage.setItem('favoritePhotos', JSON.stringify(newFavorites));
    setIsFavorite(!isCurrentlyFavorite);
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-20 h-10 bg-gray-200 rounded-xl shimmer"></div>
          <div className="w-48 h-8 bg-gray-200 rounded-lg shimmer"></div>
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="aspect-[4/3] bg-gray-200 rounded-2xl shimmer"></div>
          </div>
          <div className="space-y-6">
            <div className="w-full h-8 bg-gray-200 rounded-lg shimmer"></div>
            <div className="w-full h-20 bg-gray-200 rounded-lg shimmer"></div>
            <div className="w-full h-32 bg-gray-200 rounded-lg shimmer"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !photo) {
    return (
      <div className="space-y-6 text-center">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
          <h3 className="text-lg font-semibold text-red-900 mb-2">Oops! Photo not found</h3>
          <p className="text-red-600">Failed to load photo details. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleFavorite}
              className={`p-3 rounded-xl transition-all duration-200 ${
                isFavorite 
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/25' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            
            <button
              onClick={() => handleDownload(photo.urls.full, `photo-${photo.id}.jpg`)}
              className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Download className="h-5 w-5" />
              Download
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Photo Preview */}
          <div className="lg:col-span-2">
            <div className="relative group">
              <div className="relative overflow-hidden rounded-2xl bg-gray-100 shadow-elegant">
                <img
                  src={photo.urls.regular}
                  alt={photo.alt_description || 'Photo'}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Fullscreen button */}
                <button
                  onClick={() => setIsFullscreen(true)}
                  className="absolute top-4 right-4 p-3 bg-black/50 backdrop-blur-md text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/70"
                >
                  <Maximize2 className="h-5 w-5" />
                </button>

                {/* Photo info overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="text-white">
                    <h1 className="text-2xl font-bold mb-2">
                      {photo.alt_description || 'Untitled Photo'}
                    </h1>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Camera className="h-4 w-4" />
                        {photo.width} × {photo.height}
                      </span>
                      {photo.views && (
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {photo.views.toLocaleString()} views
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Photo Title & Description */}
            <div className="space-y-3">
              <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                {photo.alt_description || 'Untitled Photo'}
              </h1>
              {photo.description && (
                <p className="text-lg text-gray-600 leading-relaxed">
                  {photo.description}
                </p>
              )}
            </div>

            {/* Author Card */}
            <div className="glass-morphism rounded-2xl p-6 shadow-elegant">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={photo.user.profile_image.medium}
                  alt={photo.user.name}
                  className="w-16 h-16 rounded-full border-2 border-white shadow-lg"
                />
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{photo.user.name}</h3>
                  <p className="text-gray-600">@{photo.user.username}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-white/50 rounded-xl">
                  <div className="text-2xl font-bold text-gray-900">{photo.user.total_photos}</div>
                  <div className="text-sm text-gray-600">Photos</div>
                </div>
                <div className="p-3 bg-white/50 rounded-xl">
                  <div className="text-2xl font-bold text-gray-900">{photo.user.total_likes}</div>
                  <div className="text-sm text-gray-600">Likes</div>
                </div>
              </div>
              
              <a
                href={`https://unsplash.com/@${photo.user.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-200"
              >
                <User className="h-4 w-4" />
                View Profile
              </a>
            </div>

            {/* Photo Statistics */}
            <div className="glass-morphism rounded-2xl p-6 shadow-elegant">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Statistics</h3>
              <div className="space-y-4">
                {[
                  { label: 'Views', value: photo.views?.toLocaleString() || 'N/A', icon: Eye },
                  { label: 'Downloads', value: photo.downloads?.toLocaleString() || 'N/A', icon: Download },
                  { label: 'Likes', value: photo.likes?.toLocaleString() || 'N/A', icon: Heart },
                  { label: 'Published', value: new Date(photo.created_at).toLocaleDateString(), icon: Calendar },
                ].map((stat, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <stat.icon className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-700">{stat.label}</span>
                    </div>
                    <span className="font-bold text-gray-900">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            {photo.tags && photo.tags.length > 0 && (
              <div className="glass-morphism rounded-2xl p-6 shadow-elegant">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Related Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {photo.tags.map((tag: any, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      #{tag.title}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* External Links */}
            <div className="flex gap-3">
              <a
                href={photo.links.html}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200"
              >
                <ExternalLink className="h-4 w-4" />
                View on Unsplash
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 p-3 bg-white/10 backdrop-blur-md text-white rounded-xl hover:bg-white/20 transition-all duration-200"
          >
            <X className="h-6 w-6" />
          </button>
          
          <div className="max-w-7xl max-h-full w-full h-full flex items-center justify-center">
            <img
              src={photo.urls.full}
              alt={photo.alt_description || 'Photo'}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
          
          <div className="absolute bottom-6 left-6 right-6 text-center text-white">
            <h2 className="text-2xl font-bold mb-2">{photo.alt_description || 'Untitled Photo'}</h2>
            <p className="text-white/80">by {photo.user.name}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default PhotoDetailPage;
