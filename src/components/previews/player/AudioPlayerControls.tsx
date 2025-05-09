
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { formatTime } from '@/lib/audio-utils';

interface AudioPlayerControlsProps {
  src: string;
  title: string;
  onEnded: () => void;
  onError?: () => void;
}

const AudioPlayerControls: React.FC<AudioPlayerControlsProps> = ({
  src,
  title,
  onEnded,
  onError
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isGoogleDriveLink, setIsGoogleDriveLink] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Check if the source is a Google Drive link
  useEffect(() => {
    const isGDrive = src && (
      src.includes('drive.google.com') || 
      src.includes('docs.google.com')
    );
    setIsGoogleDriveLink(isGDrive);
  }, [src]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      onEnded();
    };
    
    const handleErrorEvent = () => {
      console.error("Error loading audio:", src);
      if (onError) onError();
    };
    
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleErrorEvent);
    
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleErrorEvent);
    };
  }, [src, onEnded, onError]);
  
  // Handle play/pause
  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play()
        .catch(error => {
          console.error("Playback failed:", error);
          if (onError) onError();
        });
    }
    setIsPlaying(!isPlaying);
  };
  
  // Handle seeking
  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.currentTime = value[0];
    setCurrentTime(value[0]);
  };
  
  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newVolume = value[0];
    audio.volume = newVolume;
    setVolume(newVolume);
  };
  
  // Handle restart
  const handleRestart = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.currentTime = 0;
    setCurrentTime(0);
    if (!isPlaying) {
      audio.play().catch(console.error);
      setIsPlaying(true);
    }
  };
  
  // Open in Google Drive
  const openInGoogleDrive = () => {
    if (src) {
      window.open(src, '_blank');
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg">
      <div className="mb-2 flex justify-between items-center">
        <div className="text-sm font-medium truncate max-w-[240px]">{title}</div>
        {isGoogleDriveLink && (
          <Button variant="outline" size="sm" onClick={openInGoogleDrive} className="ml-2 text-xs">
            <ExternalLink className="h-3 w-3 mr-1" />
            Abrir no Google Drive
          </Button>
        )}
      </div>
      
      <audio ref={audioRef} src={src} className="hidden" preload="metadata" />
      
      <div className="mb-3">
        <Slider
          value={[currentTime]}
          max={duration || 1}
          step={0.01}
          onValueChange={handleSeek}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="ghost" onClick={handleRestart}>
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button size="sm" className="bg-harmonia-green hover:bg-harmonia-green/90 rounded-full h-8 w-8 p-0" onClick={togglePlayPause}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button size="sm" variant="ghost" disabled>
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Volume2 className="h-4 w-4 text-gray-500" />
          <Slider
            value={[volume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="w-20"
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayerControls;
