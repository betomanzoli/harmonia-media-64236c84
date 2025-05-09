
import React from 'react';
import { Slider } from "@/components/ui/slider";
import { PlayCircle, PauseCircle, Volume2, VolumeX } from 'lucide-react';
import { formatTime } from '@/lib/audio-utils';

interface AudioPlayerControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  progress: number;
  isMuted: boolean;
  togglePlay: () => void;
  setProgress: (progress: number) => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
}

const AudioPlayerControls: React.FC<AudioPlayerControlsProps> = ({
  isPlaying,
  currentTime,
  duration,
  volume,
  progress,
  isMuted,
  togglePlay,
  setProgress,
  toggleMute,
  setVolume
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center space-x-3 mb-2">
        <button 
          onClick={togglePlay} 
          className="focus:outline-none text-harmonia-green hover:text-harmonia-green/80"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <PauseCircle className="w-9 h-9" />
          ) : (
            <PlayCircle className="w-9 h-9" />
          )}
        </button>
        
        <div className="flex-1">
          <Slider
            value={[progress]}
            max={100}
            step={0.1}
            onValueChange={(values) => setProgress(values[0])}
            className="cursor-pointer"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={toggleMute}
            className="focus:outline-none text-gray-500 hover:text-gray-700"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
          
          <div className="w-20">
            <Slider
              value={[isMuted ? 0 : volume]}
              max={100}
              step={1}
              onValueChange={(values) => setVolume(values[0])}
              className="cursor-pointer"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-between text-xs text-gray-500">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default AudioPlayerControls;
