
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface LimitedAudioPlayerProps {
  audioUrl: string;
  previewDuration?: number; // Duration in seconds
  className?: string;
  title?: string;
  subtitle?: string;
  audioSrc?: string;
}

const LimitedAudioPlayer: React.FC<LimitedAudioPlayerProps> = ({
  audioUrl,
  audioSrc,
  title,
  subtitle,
  previewDuration = 30, // Default to 30 seconds preview
  className,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number>(0);

  // Use audioSrc as fallback if audioUrl is not provided
  const finalAudioUrl = audioUrl || audioSrc || '';

  useEffect(() => {
    const audio = new Audio(finalAudioUrl);
    audioRef.current = audio;
    
    audio.addEventListener('loadedmetadata', () => {
      setDuration(Math.min(audio.duration, previewDuration));
      setIsLoaded(true);
    });
    
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setCurrentTime(0);
      cancelAnimationFrame(animationRef.current);
    });
    
    audio.volume = volume;
    
    return () => {
      audio.pause();
      audio.src = '';
      audio.removeEventListener('loadedmetadata', () => {});
      audio.removeEventListener('ended', () => {});
      cancelAnimationFrame(animationRef.current);
    };
  }, [finalAudioUrl, previewDuration]);
  
  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      cancelAnimationFrame(animationRef.current);
    } else {
      audioRef.current.play();
      animationRef.current = requestAnimationFrame(updateProgress);
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const updateProgress = () => {
    if (!audioRef.current) return;
    
    const currentTime = audioRef.current.currentTime;
    setCurrentTime(currentTime);
    
    if (currentTime >= previewDuration) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
      return;
    }
    
    animationRef.current = requestAnimationFrame(updateProgress);
  };
  
  const handleTimeChange = (value: number[]) => {
    if (!audioRef.current) return;
    
    const newTime = value[0];
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };
  
  const handleVolumeChange = (value: number[]) => {
    if (!audioRef.current) return;
    
    const newVolume = value[0];
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };
  
  const toggleMute = () => {
    if (!audioRef.current) return;
    
    if (isMuted) {
      audioRef.current.volume = volume || 0.7;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };
  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  return (
    <div className={cn("w-full p-4 bg-card rounded-md border border-border", className)}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="font-semibold text-lg">{title}</h3>}
          {subtitle && <p className="text-gray-400 text-sm">{subtitle}</p>}
        </div>
      )}
      
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-10 w-10 rounded-full bg-primary/10 hover:bg-primary/20 text-primary"
          onClick={togglePlayPause}
          disabled={!isLoaded}
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </Button>
        
        <div className="flex-1">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <Slider
            value={[currentTime]}
            min={0}
            max={duration}
            step={0.01}
            onValueChange={handleTimeChange}
            disabled={!isLoaded}
            className="cursor-pointer"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full"
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <Slider
            value={[isMuted ? 0 : volume]}
            min={0}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="w-20 cursor-pointer"
          />
        </div>
      </div>
      
      <div className="mt-2 text-xs text-muted-foreground">
        <p>Prévia limitada a {previewDuration} segundos</p>
      </div>
    </div>
  );
};

export default LimitedAudioPlayer;
