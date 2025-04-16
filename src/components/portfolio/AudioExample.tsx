
import React from 'react';
import LimitedAudioPlayer from '@/components/LimitedAudioPlayer';
import { Card } from "@/components/ui/card";

interface AudioExampleProps {
  title: string;
  subtitle: string;
  audioSrc: string;
  genre?: string;
  type?: string;
}

const AudioExample: React.FC<AudioExampleProps> = ({ 
  title, 
  subtitle, 
  audioSrc,
  genre,
  type
}) => {
  return (
    <Card className="p-4">
      <div className="mb-3">
        <h3 className="font-bold">{title}</h3>
        <p className="text-sm text-gray-500">
          {subtitle}
          {genre && <span className="ml-1">| {genre}</span>}
          {type && <span className="ml-1">| {type}</span>}
        </p>
      </div>
      <LimitedAudioPlayer 
        title={title} 
        subtitle={genre ? `${subtitle} | ${genre}` : subtitle} 
        audioSrc={audioSrc}
        previewDuration={30}
      />
    </Card>
  );
};

export default AudioExample;
