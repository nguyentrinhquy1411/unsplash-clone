import React from 'react';
import { useParams } from 'react-router-dom';
import InfinitePhotoGrid from '../components/photos/InfinitePhotoGrid';

const TopicPage: React.FC = () => {
  const { topic } = useParams<{ topic: string }>();

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 py-8">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 capitalize">
          {topic} Photos
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover beautiful {topic} photos from our community of photographers.
        </p>
      </div>
      
      <InfinitePhotoGrid topic={topic} />
    </div>
  );
};

export default TopicPage;
