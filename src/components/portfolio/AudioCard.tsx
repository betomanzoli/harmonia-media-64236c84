
import React from 'react';
import { Card } from "@/components/ui/card";
import LimitedAudioPlayer from '@/components/LimitedAudioPlayer';

interface AudioCardProps {
  title: string;
  description: string;
  audioUrl: string;
  featured?: boolean;
  imageUrl?: string;
  tags?: string[];
}

const AudioCard: React.FC<AudioCardProps> = ({ 
  title, 
  description, 
  audioUrl,
  featured,
  imageUrl,
  tags
}) => {
  return (
    <Card className={`p-4 ${featured ? 'border-green-500 border-2' : ''}`}>
      <div className="mb-3">
        <h3 className="font-bold">{title}</h3>
        {featured && <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full ml-2">Destaque</span>}
        <p className="text-sm text-gray-400 mt-1">{description}</p>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.map((tag, index) => (
              <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      {imageUrl && (
        <div className="mb-3 rounded-md overflow-hidden">
          <img src={imageUrl} alt={title} className="w-full h-36 object-cover" />
        </div>
      )}
      <LimitedAudioPlayer 
        title={title} 
        subtitle={description} 
        audioSrc={audioUrl}
        previewDuration={30}
      />
    </Card>
  );
};

export default AudioCard;
