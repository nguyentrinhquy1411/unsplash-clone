import React, { useState } from 'react'
import { UnsplashPhoto } from '../services/api'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'

interface PhotoCardProps {
  photo: UnsplashPhoto
}

const PhotoCard: React.FC<PhotoCardProps> = ({ photo }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleDownload = async () => {
    try {
      const link = document.createElement('a')
      link.href = photo.urls.full
      link.download = `unsplash-${photo.id}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative group cursor-pointer" onClick={() => setIsModalOpen(true)}>
          <LazyLoadImage
            src={photo.urls.small}
            alt={photo.alt_description || photo.description || 'Unsplash photo'}
            effect="blur"
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            placeholder={
              <div className="w-full h-64 bg-gray-200 animate-pulse flex items-center justify-center">
                <span className="text-gray-400">Loading...</span>
              </div>
            }
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleDownload()
              }}
              className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-2 rounded-full shadow-md transition-all duration-200"
              title="Download"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <img
                src={photo.user.profile_image.small}
                alt={photo.user.name}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm font-medium text-gray-700">{photo.user.name}</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                {photo.likes}
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {photo.downloads}
              </span>
            </div>
          </div>
          
          {(photo.description || photo.alt_description) && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {photo.description || photo.alt_description}
            </p>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={() => setIsModalOpen(false)}>
          <div className="max-w-4xl max-h-full relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 z-10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={photo.urls.regular}
              alt={photo.alt_description || photo.description || 'Unsplash photo'}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 rounded-b-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={photo.user.profile_image.medium}
                    alt={photo.user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="font-medium">{photo.user.name}</p>
                    <p className="text-sm text-gray-300">@{photo.user.username}</p>
                  </div>
                </div>
                <button
                  onClick={handleDownload}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PhotoCard
