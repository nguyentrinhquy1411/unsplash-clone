import React from 'react';
import InfinitePhotoGrid from '../components/photos/InfinitePhotoGrid';

const HomePage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 py-12">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900">
          Beautiful Free Images & Pictures
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          The internet's source of freely-usable images. Powered by creators everywhere.
        </p>
      </div>
      
      <InfinitePhotoGrid />
    </div>
  );
};

export default HomePage;
