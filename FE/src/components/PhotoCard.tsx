import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UnsplashPhoto } from '../services/api'
import { Heart, Download, Eye } from 'lucide-react'

interface PhotoCardProps {
  photo: UnsplashPhoto
}

const PhotoCard = React.forwardRef<HTMLDivElement, PhotoCardProps>(({ photo }, ref) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const navigate = useNavigate()

  // Check if photo is in favorites on mount
  React.useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favoritePhotos') || '[]')
    setIsFavorite(favorites.some((p: any) => p.id === photo.id))
  }, [photo.id])

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      const response = await fetch(photo.urls.full)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `unsplash-${photo.id}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      // Save to download history
      const downloadHistory = JSON.parse(localStorage.getItem('downloadHistory') || '[]')
      const filteredHistory = downloadHistory.filter((p: any) => p.id !== photo.id)
      const newHistory = [photo, ...filteredHistory].slice(0, 100) // Keep last 100 downloads
      localStorage.setItem('downloadHistory', JSON.stringify(newHistory))
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    const favorites = JSON.parse(localStorage.getItem('favoritePhotos') || '[]')
    const isCurrentlyFavorite = favorites.some((p: any) => p.id === photo.id)
    
    let newFavorites
    if (isCurrentlyFavorite) {
      newFavorites = favorites.filter((p: any) => p.id !== photo.id)
    } else {
      newFavorites = [photo, ...favorites]
    }
    
    localStorage.setItem('favoritePhotos', JSON.stringify(newFavorites))
    setIsFavorite(!isCurrentlyFavorite)
  }

  const handleCardClick = () => {
    // Save to recent photos
    const recentPhotos = JSON.parse(localStorage.getItem('recentPhotos') || '[]')
    const filteredRecent = recentPhotos.filter((p: any) => p.id !== photo.id)
    const newRecent = [photo, ...filteredRecent].slice(0, 50)
    localStorage.setItem('recentPhotos', JSON.stringify(newRecent))
    
    navigate(`/photo/${photo.id}`)
  }

  return (
    <div
      ref={ref}
      className="relative group cursor-pointer mb-4 break-inside-avoid transform transition-all duration-300 hover:scale-[1.02]"
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-2xl bg-gray-100 shadow-elegant shadow-hover">
        {isLoading && (
          <div 
            className="shimmer rounded-2xl"
            style={{ aspectRatio: `${photo.width}/${photo.height}` }}
          />
        )}
        
        <img
          src={photo.urls.regular}
          alt={photo.alt_description || 'Unsplash photo'}
          className={`w-full h-auto object-cover rounded-2xl transition-all duration-500 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          } ${isHovered ? 'scale-105' : 'scale-100'}`}
          onLoad={() => setIsLoading(false)}
          loading="lazy"
        />

        {/* Hover Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 rounded-2xl transition-all duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />

        {/* Stats Badge */}
        <div className={`absolute top-4 left-4 flex items-center gap-3 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}>
          {photo.likes && (
            <div className="flex items-center gap-1 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700">
              <Heart className="h-3.5 w-3.5" />
              <span>{photo.likes.toLocaleString()}</span>
            </div>
          )}
          {photo.views && (
            <div className="flex items-center gap-1 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700">
              <Eye className="h-3.5 w-3.5" />
              <span>{photo.views.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className={`absolute top-4 right-4 flex gap-2 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}>
          <button
            onClick={handleFavorite}
            className={`p-3 rounded-full backdrop-blur-md transition-all duration-300 transform hover:scale-110 ${
              isFavorite 
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/25' 
                : 'bg-white/90 text-gray-700 hover:bg-white hover:text-red-500'
            }`}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          
          <button
            onClick={handleDownload}
            className="p-3 rounded-full bg-white/90 text-gray-700 hover:bg-white hover:text-gray-900 backdrop-blur-md transition-all duration-300 transform hover:scale-110"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>

        {/* Author Info */}
        <div className={`absolute bottom-4 left-4 right-4 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={photo.user.profile_image.small}
                  alt={photo.user.name}
                  className="w-10 h-10 rounded-full border-2 border-white shadow-lg"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="text-white">
                <p className="font-semibold text-sm leading-tight drop-shadow-lg">{photo.user.name}</p>
                {photo.user.username && (
                  <p className="text-xs opacity-90 drop-shadow-lg">@{photo.user.username}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full">
                <span className="text-white text-xs font-medium">
                  {photo.width} × {photo.height}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Preview Indicator */}
        <div className={`absolute inset-0 pointer-events-none transition-all duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl">
              <Eye className="h-5 w-5 text-gray-700" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

PhotoCard.displayName = 'PhotoCard'

export default PhotoCard
