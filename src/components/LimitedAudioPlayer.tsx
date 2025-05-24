
import React from 'react';
import { useAudioPlayerControls } from '@/hooks/use-audio-player-controls';
import PlayButton from './audio/PlayButton';
import AudioProgress from './audio/AudioProgress';
import VolumeControl from './audio/VolumeControl';

interface LimitedAudioPlayerProps {
  audioSrc: string;
  previewDuration?: number;
  title?: string;
  subtitle?: string;
  className?: string;
}

const LimitedAudioPlayer: React.FC<LimitedAudioPlayerProps> = ({
  audioSrc,
  previewDuration = 30,
  title,
  subtitle,
  className = ""
}) => {
  const {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    volume,
    showVolumeControl,
    setShowVolumeControl,
    togglePlay,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleSliderChange,
    handleVolumeChange,
    handleEnded
  } = useAudioPlayerControls({ audioSrc, previewDuration });

  return (
    <div className={`flex flex-col space-y-2 bg-gray-50 p-3 rounded-md ${className}`}>
      {(title || subtitle) && (
        <div className="mb-1">
          {title && <h4 className="text-sm font-medium">{title}</h4>}
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      )}
      
      <audio
        ref={audioRef}
        src={audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
      
      <div className="flex items-center space-x-2">
        <PlayButton isPlaying={isPlaying} onClick={togglePlay} />
        
        <AudioProgress
          currentTime={currentTime}
          duration={duration}
          previewDuration={previewDuration}
          onSliderChange={handleSliderChange}
        />
        
        <VolumeControl
          volume={volume}
          showVolumeControl={showVolumeControl}
          onVolumeChange={handleVolumeChange}
          onVolumeButtonClick={() => setShowVolumeControl(!showVolumeControl)}
        />
      </div>
    </div>
  );
};

export default LimitedAudioPlayer;
