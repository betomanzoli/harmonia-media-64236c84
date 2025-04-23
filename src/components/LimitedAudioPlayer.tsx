
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, Volume1, VolumeX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from "@/lib/utils";

interface LimitedAudioPlayerProps {
  audioSrc: string;
  previewDuration?: number; // Duration in seconds
  title?: string;
  subtitle?: string;
  className?: string;
}

const LimitedAudioPlayer: React.FC<LimitedAudioPlayerProps> = ({
  audioSrc,
  previewDuration = 30, // Default to 30 seconds
  title,
  subtitle,
  className
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Create audio element
  useEffect(() => {
    const audio = new Audio(audioSrc);
    audio.volume = volume;
    audioRef.current = audio;

    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      
      // Stop playback if we exceed the preview duration
      if (previewDuration && audio.currentTime >= previewDuration) {
        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false);
        setCurrentTime(0);
        toast({
          title: "Prévia finalizada",
          description: `Esta é uma prévia de ${previewDuration} segundos.`,
        });
      }
    };

    const handleAudioLoad = () => {
      // If the full audio is available, set the duration
      setDuration(Math.min(previewDuration, audio.duration || previewDuration));
    };

    const handleAudioEnd = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = () => {
      toast({
        title: "Erro ao carregar áudio",
        description: "Não foi possível reproduzir o arquivo de áudio.",
        variant: "destructive"
      });
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', handleAudioLoad);
    audio.addEventListener('ended', handleAudioEnd);
    audio.addEventListener('error', handleError);

    return () => {
      audio.pause();
      audio.remove();
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', handleAudioLoad);
      audio.removeEventListener('ended', handleAudioEnd);
      audio.removeEventListener('error', handleError);
    };
  }, [audioSrc, previewDuration, toast, volume]);

  // Toggle play/pause
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      if (currentTime >= previewDuration) {
        audioRef.current.currentTime = 0;
        setCurrentTime(0);
      }
      audioRef.current.play().catch(error => {
        console.error("Error playing audio:", error);
        toast({
          title: "Erro ao reproduzir",
          description: "Tente novamente ou utilize o botão 'Ouvir' para abrir em nova aba.",
          variant: "destructive"
        });
      });
    }
    setIsPlaying(!isPlaying);
  };

  // Handle time change
  const handleTimeChange = (value: number[]) => {
    if (!audioRef.current) return;
    const newTime = value[0];
    
    // Don't let users seek past the preview duration
    const seekTime = Math.min(newTime, previewDuration);
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    if (!audioRef.current) return;
    const newVolume = value[0];
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  // Format time display
  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  // Volume icon based on current volume
  const VolumeIcon = () => {
    if (volume === 0) return <VolumeX size={16} />;
    if (volume < 0.5) return <Volume1 size={16} />;
    return <Volume2 size={16} />;
  };

  // Maximum time to show in display
  const maxTime = Math.min(previewDuration, duration || previewDuration);

  return (
    <div className={cn("flex flex-col space-y-2 bg-gray-50 p-3 rounded-md", className)}>
      {(title || subtitle) && (
        <div className="mb-1">
          {title && <h4 className="text-sm font-medium">{title}</h4>}
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      )}
      
      <div className="flex items-center space-x-2">
        <Button
          onClick={togglePlay}
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 rounded-full"
        >
          {isPlaying ? 
            <Pause className="h-3.5 w-3.5" /> : 
            <Play className="h-3.5 w-3.5 ml-0.5" />
          }
        </Button>
        
        <div className="flex-1 space-y-1">
          <Slider 
            value={[currentTime]} 
            max={maxTime}
            step={0.1}
            onValueChange={handleTimeChange}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(maxTime)}</span>
          </div>
        </div>
        
        <div className="relative">
          <Button
            onClick={() => setShowVolumeControl(!showVolumeControl)}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <VolumeIcon />
          </Button>
          
          {showVolumeControl && (
            <div className="absolute bottom-full right-0 mb-1 p-3 bg-white shadow-md rounded-md w-32">
              <Slider
                value={[volume]}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LimitedAudioPlayer;
