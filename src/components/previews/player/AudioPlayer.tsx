
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface AudioPlayerProps {
  src: string;
  isPlaying: boolean;
  onPlayPause: (isPlaying: boolean) => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  src, 
  isPlaying,
  onPlayPause
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Create audio element if it doesn't exist
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio(src);
      audioRef.current = audio;
      
      // Set up event listeners
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleEnded);
    }

    return () => {
      // Clean up audio element and listeners when component unmounts
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioRef.current.removeEventListener('ended', handleEnded);
      }
    };
  }, [src]);

  // Handle play/pause changes
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        // Try to play and catch any errors (browsers may block autoplay)
        audioRef.current.play()
          .catch(error => {
            console.error('Error playing audio:', error);
            onPlayPause(false);
          });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, onPlayPause]);

  // Update audio src when it changes
  useEffect(() => {
    if (audioRef.current && audioRef.current.src !== src) {
      audioRef.current.src = src;
      setCurrentTime(0);
      
      // If it was playing, try to play the new source
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.error('Error playing new audio source:', err);
          onPlayPause(false);
        });
      }
    }
  }, [src, isPlaying, onPlayPause]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setCurrentTime(0);
    onPlayPause(false);
  };

  const handleSliderChange = (value: number[]) => {
    if (audioRef.current && value.length > 0) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const togglePlayPause = () => {
    onPlayPause(!isPlaying);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="p-4 space-y-2">
      <div className="flex items-center gap-4">
        <Button 
          onClick={togglePlayPause} 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 rounded-full"
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
            max={duration || 100} 
            step={0.1} 
            onValueChange={handleSliderChange} 
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
