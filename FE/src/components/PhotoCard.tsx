import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UnsplashPhoto } from '../services/api'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Heart, Download, Eye, Calendar } from 'lucide-react'
import { cn } from '../lib/utils'

interface PhotoCardProps {
  photo: UnsplashPhoto
}

const PhotoCard = React.forwardRef<HTMLDivElement, PhotoCardProps>(({ photo }, ref) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const navigate = useNavigate()

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

  const handlePhotoClick = () => {
    // Save to recent photos
    const recentPhotos = JSON.parse(localStorage.getItem('recentPhotos') || '[]')
    const filteredRecent = recentPhotos.filter((p: any) => p.id !== photo.id)
    const newRecent = [photo, ...filteredRecent].slice(0, 50)
    localStorage.setItem('recentPhotos', JSON.stringify(newRecent))
    
    // Navigate to photo detail
    navigate(`/photo/${photo.id}`)
  }
  // For masonry layout with CSS columns, we don't need to calculate grid spans
  // The CSS columns will handle the natural stacking

  React.useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favoritePhotos') || '[]')
    setIsFavorite(favorites.some((p: any) => p.id === photo.id))
  }, [photo.id])

  return (
    <Card 
      ref={ref}
      className={cn(
        "group cursor-pointer overflow-hidden border-0 bg-card hover:shadow-lg transition-all duration-300",
        "break-inside-avoid mb-6 w-full inline-block"
      )}
      onClick={handlePhotoClick}
    >
      <div className="relative overflow-hidden">
        {/* Loading skeleton */}
        {isLoading && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}
          {/* Photo Image */}
        <img
          src={photo.urls.small}
          alt={photo.alt_description || photo.description || 'Photo'}
          className={cn(
            "w-full h-auto block object-cover transition-transform duration-300 group-hover:scale-105",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

        {/* Action buttons - top right */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 bg-white/90 hover:bg-white text-black"
            onClick={handleFavorite}
          >
            <Heart 
              className={cn(
                "h-4 w-4",
                isFavorite ? "fill-red-500 text-red-500" : ""
              )} 
            />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 bg-white/90 hover:bg-white text-black"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>

        {/* Stats overlay - bottom left */}
        <div className="absolute bottom-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Badge variant="secondary" className="bg-white/90 text-black">
            <Heart className="h-3 w-3 mr-1" />
            {photo.likes}
          </Badge>
          {photo.downloads && (
            <Badge variant="secondary" className="bg-white/90 text-black">
              <Download className="h-3 w-3 mr-1" />
              {photo.downloads}
            </Badge>
          )}
        </div>
      </div>

      {/* Card Content */}
      <CardContent className="p-4">
        {/* User info */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={photo.user.profile_image.small} alt={photo.user.name} />
              <AvatarFallback>{photo.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{photo.user.name}</p>
              <p className="text-xs text-muted-foreground truncate">@{photo.user.username}</p>
            </div>
          </div>
          
          {/* Date */}
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            {new Date(photo.created_at).toLocaleDateString()}
          </div>
        </div>

        {/* Description */}
        {(photo.description || photo.alt_description) && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {photo.description || photo.alt_description}
          </p>
        )}

        {/* Footer stats */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              {photo.views?.toLocaleString() || 'N/A'} views
            </span>
            <span className="flex items-center">
              <Heart className="h-3 w-3 mr-1" />
              {photo.likes} likes
            </span>
          </div>
          <Badge variant="outline" className="text-xs">
            {photo.width} × {photo.height}
          </Badge>
        </div>
      </CardContent>    </Card>
  )
})

PhotoCard.displayName = 'PhotoCard'

export default PhotoCard
