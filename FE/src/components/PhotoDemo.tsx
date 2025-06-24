import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { photosApi, UnsplashPhoto } from '../services/api'
import PhotoCard from './PhotoCard'
import LoadingSpinner from './LoadingSpinner'

const PhotoDemo: React.FC = () => {
  const [count, setCount] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')

  const {
    data: photos,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['randomPhotos', count, searchQuery],
    queryFn: () => photosApi.getRandomPhotos(count, searchQuery || undefined),
  })

  const handleRefresh = () => {
    refetch()
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    refetch()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Unsplash Photo Gallery Demo
        </h1>
        <p className="text-gray-600 mb-6">
          Explore beautiful photos from Unsplash API
        </p>
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Search photos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              Search
            </button>
          </form>
          
          <div className="flex items-center gap-2">
            <label htmlFor="count" className="text-sm font-medium text-gray-700">
              Count:
            </label>
            <select
              id="count"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
            </select>
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
          >
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-red-800 font-semibold mb-2">Error Loading Photos</h3>
            <p className="text-red-600 text-sm mb-4">
              {error instanceof Error ? error.message : 'Something went wrong'}
            </p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Photos Grid */}
      {photos && photos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {photos.map((photo: UnsplashPhoto) => (
            <PhotoCard key={photo.id} photo={photo} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {photos && photos.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <p className="text-lg mb-2">No photos found</p>
            <p className="text-sm text-gray-400">Try a different search term</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default PhotoDemo
