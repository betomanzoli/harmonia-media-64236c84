
import React from 'react';
import { Play, Pause } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useAudioPlayer } from '@/hooks/use-audio-player';

interface LimitedAudioPlayerProps {
  title: string;
  subtitle: string;
  audioSrc: string;
  previewDuration?: number; // Preview duration in seconds (default: 30s)
}

export const LimitedAudioPlayer: React.FC<LimitedAudioPlayerProps> = ({ 
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

  // Format time as mm:ss
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <Button 
          onClick={togglePlayPause} 
          size="icon" 
          className="w-12 h-12 rounded-full bg-harmonia-green hover:bg-harmonia-green/90 text-black"
        >
          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </Button>
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-gray-400 text-sm">{subtitle}</p>
          <span className="text-xs text-harmonia-green mt-1 block">
            Prévia de {previewDuration} segundos
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <Slider
          value={[currentTime]}
          max={Math.min(duration, previewDuration)}
          step={0.1}
          onValueChange={(values) => handleSliderChange(values[0])}
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(Math.min(duration, previewDuration))}</span>
        </div>
      </div>
      
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
