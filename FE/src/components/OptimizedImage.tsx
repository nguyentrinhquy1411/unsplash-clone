import React from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  placeholderSrc?: string
  onClick?: () => void
  loading?: 'lazy' | 'eager'
  effect?: 'blur' | 'opacity' | 'black-and-white'
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  placeholderSrc,
  onClick,
  loading = 'lazy',
  effect = 'blur'
}) => {
  // Generate a placeholder based on dimensions and color
  const placeholder = placeholderSrc || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width || 400}' height='${height || 300}' viewBox='0 0 ${width || 400} ${height || 300}'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af'%3ELoading...%3C/text%3E%3C/svg%3E`;

  return (
    <LazyLoadImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`transition-opacity duration-300 ${className}`}
      placeholderSrc={placeholder}
      effect={effect}
      onClick={onClick}
      loading={loading}
      threshold={100} // Start loading 100px before image comes into view
      onError={(e) => {
        // Fallback if image fails to load
        const target = e.currentTarget as HTMLImageElement;
        target.src = placeholder;
      }}
      style={{
        objectFit: 'cover',
        backgroundColor: '#f3f4f6', // Light gray background while loading
      }}
    />
  )
}

export default OptimizedImage
