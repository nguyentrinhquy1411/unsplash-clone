import React from 'react';
import InfinitePhotoGrid from '../components/photos/InfinitePhotoGrid';
import SearchHero from '../components/SearchHero';

const HomePage: React.FC = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative text-center space-y-8 py-16 lg:py-24">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-br from-pink-100 to-orange-100 rounded-full blur-3xl opacity-20"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 leading-tight">
            Beautiful Free{' '}
            <span className="gradient-text">Images</span>{' '}
            & Pictures
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            The internet's source of freely-usable images.{' '}
            <span className="text-gray-900 font-medium">Powered by creators everywhere.</span>
          </p>
          
          {/* Search Hero */}
          <div className="mt-12">
            <SearchHero />
          </div>
          
          {/* Stats */}
          <div className="flex items-center justify-center gap-8 md:gap-12 mt-12 text-center">
            <div className="space-y-1">
              <div className="text-2xl md:text-3xl font-bold text-gray-900">3M+</div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">Photos</div>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div className="space-y-1">
              <div className="text-2xl md:text-3xl font-bold text-gray-900">200K+</div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">Contributors</div>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div className="space-y-1">
              <div className="text-2xl md:text-3xl font-bold text-gray-900">Free</div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">Always</div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Categories */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore by Category
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover stunning photos organized by popular themes and subjects
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 max-w-6xl mx-auto px-4">
          {[
            { name: 'Nature', emoji: '🌿', color: 'from-green-400 to-emerald-500' },
            { name: 'Architecture', emoji: '🏛️', color: 'from-gray-400 to-slate-500' },
            { name: 'Travel', emoji: '✈️', color: 'from-blue-400 to-cyan-500' },
            { name: 'Food', emoji: '🍽️', color: 'from-orange-400 to-red-500' },
            { name: 'Technology', emoji: '💻', color: 'from-purple-400 to-violet-500' },
            { name: 'Sports', emoji: '⚽', color: 'from-yellow-400 to-amber-500' },
            { name: 'Art', emoji: '🎨', color: 'from-pink-400 to-rose-500' },
            { name: 'People', emoji: '👥', color: 'from-indigo-400 to-blue-500' },
          ].map((category) => (
            <a
              key={category.name}
              href={`/topic/${category.name.toLowerCase()}`}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br shadow-elegant shadow-hover text-center text-white transform transition-all duration-300 hover:scale-105 aspect-square flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
              }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-90`}></div>
              <div className="relative z-10 space-y-2 p-4">
                <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl transition-all duration-300 group-hover:scale-110">
                  {category.emoji}
                </div>
                <div className="font-semibold text-sm sm:text-base md:text-lg lg:text-xl">
                  {category.name}
                </div>
              </div>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
          ))}
        </div>
      </div>
      
      {/* Photo Grid */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Latest Photos
          </h2>
          <p className="text-lg text-gray-600">
            Fresh, high-quality images uploaded by our community
          </p>
        </div>
        
        <InfinitePhotoGrid />
      </div>
    </div>
  );
};

export default HomePage;
