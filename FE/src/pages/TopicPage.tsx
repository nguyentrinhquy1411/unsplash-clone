import React from 'react';
import { useParams } from 'react-router-dom';
import { InfinitePhotoGrid } from '../components/photos/InfinitePhotoGrid';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';

// Predefined topics with descriptions and keywords
const TOPICS = {
  nature: {
    title: 'Nature',
    description: 'Stunning landscapes, wildlife, and natural beauty',
    keywords: 'nature landscape wildlife mountains forest ocean',
    gradient: 'from-green-500 to-blue-500'
  },
  architecture: {
    title: 'Architecture',
    description: 'Beautiful buildings, structures, and urban photography',
    keywords: 'architecture building city urban structure design',
    gradient: 'from-gray-500 to-blue-500'
  },
  travel: {
    title: 'Travel',
    description: 'Explore the world through breathtaking travel photography',
    keywords: 'travel destination vacation culture landmark',
    gradient: 'from-purple-500 to-pink-500'
  },
  food: {
    title: 'Food',
    description: 'Delicious food photography and culinary art',
    keywords: 'food cooking cuisine restaurant meal delicious',
    gradient: 'from-orange-500 to-red-500'
  },
  technology: {
    title: 'Technology',
    description: 'Modern tech, gadgets, and digital innovation',
    keywords: 'technology computer phone digital innovation gadget',
    gradient: 'from-blue-500 to-cyan-500'
  },
  sports: {
    title: 'Sports',
    description: 'Action-packed sports and fitness photography',
    keywords: 'sports fitness exercise athlete action game',
    gradient: 'from-red-500 to-yellow-500'
  },
  art: {
    title: 'Art',
    description: 'Creative artworks, paintings, and artistic expression',
    keywords: 'art painting creative design artwork gallery',
    gradient: 'from-pink-500 to-purple-500'
  },
  people: {
    title: 'People',
    description: 'Portraits, lifestyle, and human connections',
    keywords: 'people portrait person human lifestyle family',
    gradient: 'from-indigo-500 to-purple-500'
  }
};

const TopicPage: React.FC = () => {
  const { topic } = useParams<{ topic: string }>();
  const topicInfo = topic ? TOPICS[topic as keyof typeof TOPICS] : null;

  if (!topicInfo) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Topic not found</h1>
        <p className="text-muted-foreground">
          The topic you're looking for doesn't exist.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Topic Header */}
      <Card className="overflow-hidden">
        <div className={`h-32 bg-gradient-to-r ${topicInfo.gradient} relative`}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-4 left-6 text-white">
            <Badge variant="secondary" className="mb-2">
              Topic
            </Badge>
            <h1 className="text-3xl font-bold">{topicInfo.title}</h1>
          </div>
        </div>
        <CardContent className="pt-6">
          <p className="text-lg text-muted-foreground">
            {topicInfo.description}
          </p>
        </CardContent>
      </Card>

      {/* Photos Grid */}
      <InfinitePhotoGrid 
        searchQuery={topicInfo.keywords}
        topic={topic}
      />
    </div>
  );
};

export default TopicPage;
