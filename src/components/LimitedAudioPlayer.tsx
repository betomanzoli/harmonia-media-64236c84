
import React from 'react';
import PlayButton from './audio/PlayButton';
import AudioProgress from './audio/AudioProgress';
import { useAudioPlayer } from '@/hooks/use-audio-player';

interface LimitedAudioPlayerProps {
  title: string;
  subtitle: string;
  audioSrc: string;
  previewDuration?: number; // Preview duration in seconds (default: 30s)
}

const LimitedAudioPlayer: React.FC<LimitedAudioPlayerProps> = ({ 
  title, 
  subtitle, 
  audioSrc,
  previewDuration = 30 
}) => {
  const {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    togglePlayPause,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleSliderChange,
    handleEnded
  } = useAudioPlayer({ audioSrc, previewDuration });

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
        <PlayButton isPlaying={isPlaying} onClick={togglePlayPause} />
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-gray-400 text-sm">{subtitle}</p>
          <span className="text-xs text-harmonia-green mt-1 block">
            Prévia de 30 segundos
          </span>
        </div>
      </div>

      <AudioProgress 
        currentTime={currentTime}
        duration={duration}
        previewDuration={previewDuration}
        onSliderChange={handleSliderChange}
      />
      
      <audio 
        ref={audioRef} 
        src={audioSrc} 
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        className="hidden"
      />
    </div>
  );
};

export default LimitedAudioPlayer;
