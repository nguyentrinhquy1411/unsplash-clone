import React from 'react';
import { InfinitePhotoGrid } from '../components/photos/InfinitePhotoGrid';

const HomePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          Beautiful Free Images & Pictures
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          The internet's source of freely-usable images. Powered by creators everywhere.
        </p>
      </div>
      
      <InfinitePhotoGrid />
    </div>
  );
};

export default HomePage;
