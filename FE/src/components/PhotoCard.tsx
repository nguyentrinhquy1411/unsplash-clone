import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UnsplashPhoto } from '../services/api'
import { Heart, Download } from 'lucide-react'

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
      className="relative group cursor-pointer mb-6 break-inside-avoid"
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-lg bg-gray-100">
        {isLoading && (
          <div 
            className="animate-pulse bg-gray-200 rounded-lg"
            style={{ aspectRatio: `${photo.width}/${photo.height}` }}
          />
        )}
        
        <img
          src={photo.urls.regular}
          alt={photo.alt_description || 'Unsplash photo'}
          className={`w-full h-auto object-cover rounded-lg transition-all duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          } ${isHovered ? 'brightness-95' : ''}`}
          onLoad={() => setIsLoading(false)}
          loading="lazy"
        />

        {/* Hover Overlay */}
        <div className={`absolute inset-0 bg-black/20 rounded-lg transition-opacity duration-200 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />

        {/* Action Buttons */}
        <div className={`absolute top-3 right-3 flex space-x-2 transition-opacity duration-200 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <button
            onClick={handleFavorite}
            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
              isFavorite 
                ? 'bg-red-500 text-white' 
                : 'bg-white/90 text-gray-700 hover:bg-white'
            }`}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          
          <button
            onClick={handleDownload}
            className="p-2 rounded-full bg-white/90 text-gray-700 hover:bg-white backdrop-blur-sm transition-all duration-200"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>

        {/* Bottom Gradient for Author Info */}
        <div className={`absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/50 to-transparent rounded-b-lg transition-opacity duration-200 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />

        {/* Author Info */}
        <div className={`absolute bottom-3 left-3 flex items-center space-x-2 transition-opacity duration-200 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <img
            src={photo.user.profile_image.small}
            alt={photo.user.name}
            className="w-8 h-8 rounded-full border-2 border-white"
          />
          <div className="text-white">
            <p className="text-sm font-medium leading-tight">{photo.user.name}</p>
            {photo.user.username && (
              <p className="text-xs opacity-90">@{photo.user.username}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})

PhotoCard.displayName = 'PhotoCard'

export default PhotoCard
