
import React from 'react';
import LimitedAudioPlayer from '@/components/LimitedAudioPlayer';

interface AudioExampleProps {
  title: string;
  subtitle: string;
  audioSrc: string;
  genre?: string;
}

const AudioExample: React.FC<AudioExampleProps> = ({ 
  title, 
  subtitle, 
  audioSrc,
  genre
}) => {
  return (
    <div className="mb-6">
      <LimitedAudioPlayer 
        title={title} 
        subtitle={genre ? `${subtitle} | ${genre}` : subtitle} 
        audioSrc={audioSrc}
        previewDuration={30}
      />
    </div>
  );
};

export default AudioExample;
