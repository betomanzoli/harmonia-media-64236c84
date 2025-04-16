
import React, { useState, useRef, useEffect } from 'react';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface LimitedAudioPlayerProps {
  title: string;
  subtitle?: string;
  audioSrc: string;
  previewDuration?: number; // In seconds
}

const LimitedAudioPlayer: React.FC<LimitedAudioPlayerProps> = ({
  title,
  subtitle,
  audioSrc,
  previewDuration = 30
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [limitReached, setLimitReached] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      
      // Check if preview limit has been reached
      if (previewDuration && audio.currentTime >= previewDuration) {
        audio.pause();
        setIsPlaying(false);
        setLimitReached(true);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [previewDuration]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (limitReached) {
      // Reset to beginning if limit was reached
      audio.currentTime = 0;
      setLimitReached(false);
    }

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSliderChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    // Only allow seeking within the preview duration
    const newTime = Math.min(value[0], previewDuration || audio.duration);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
    
    if (limitReached && newTime < previewDuration) {
      setLimitReached(false);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume;
    } else {
      audio.volume = 0;
    }
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = value[0];
    audio.volume = newVolume;
    setVolume(newVolume);
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Calculate max player value (either preview duration or full audio duration)
  const maxValue = previewDuration ? Math.min(previewDuration, duration) : duration;

  return (
    <div className="bg-gray-900 rounded-lg p-3">
      <audio ref={audioRef} src={audioSrc} preload="metadata" />
      
      <div className="flex items-center gap-3 mb-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full bg-harmonia-green hover:bg-harmonia-green/90 text-white"
          onClick={togglePlayPause}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        
        <div className="flex-1">
          <Slider 
            value={[currentTime]} 
            max={maxValue}
            step={0.01}
            onValueChange={handleSliderChange}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{previewDuration ? `${formatTime(previewDuration)} (Prévia)` : formatTime(duration)}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-gray-400 hover:text-white"
            onClick={toggleMute}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
          
          <div className="w-20 hidden sm:block">
            <Slider 
              value={[isMuted ? 0 : volume]} 
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
            />
          </div>
        </div>
      </div>
      
      {limitReached && (
        <div className="text-center text-xs text-harmonia-green mt-2">
          Limite de prévia atingido. Clique no botão de play para ouvir novamente.
        </div>
      )}
    </div>
  );
};

export default LimitedAudioPlayer;
