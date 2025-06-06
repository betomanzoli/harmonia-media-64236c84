
import React, { useState, useRef, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Lock } from 'lucide-react';

interface LimitedAudioPlayerProps {
  audioSrc: string;
  title: string;
  subtitle: string;
  previewDuration?: number; // duração da prévia em segundos (padrão: 30s)
}

const LimitedAudioPlayer: React.FC<LimitedAudioPlayerProps> = ({ 
  audioSrc, 
  title,
  subtitle,
  previewDuration = 30
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLimited, setIsLimited] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    const audio = new Audio(audioSrc);
    audioRef.current = audio;
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLimited(audio.duration > previewDuration);
    };
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      
      // Se estiver limitado e passar do tempo de prévia, pause o áudio
      if (isLimited && audio.currentTime >= previewDuration) {
        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false);
      }
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      audio.currentTime = 0;
    };
    
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    
    // Prevenir download do áudio
    document.addEventListener('contextmenu', preventContextMenu);
    
    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      document.removeEventListener('contextmenu', preventContextMenu);
    };
  }, [audioSrc, previewDuration, isLimited]);
  
  const preventContextMenu = (e: MouseEvent) => {
    if ((e.target as HTMLElement)?.closest('audio')) {
      e.preventDefault();
    }
  };
  
  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // Se atingiu o limite, reinicie do início
      if (isLimited && currentTime >= previewDuration) {
        audioRef.current.currentTime = 0;
        setCurrentTime(0);
      }
      
      audioRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const handleSliderChange = (value: number[]) => {
    if (!audioRef.current) return;
    
    const newTime = value[0];
    
    // Se estiver limitado, não permita deslizar além do tempo de prévia
    if (isLimited && newTime > previewDuration) {
      audioRef.current.currentTime = previewDuration;
      setCurrentTime(previewDuration);
    } else {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };
  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  const maxTime = isLimited ? previewDuration : duration;

  return (
    <Card className="p-4 space-y-3">
      {(title || subtitle) && (
        <div className="mb-2">
          {title && <h3 className="font-medium">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}
      
      <div className="flex items-center gap-3">
        <button
          onClick={togglePlayPause}
          className="w-10 h-10 rounded-full bg-harmonia-green text-white flex items-center justify-center hover:bg-harmonia-green/90 transition-colors"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
        
        <div className="flex-grow space-y-1">
          <Slider
            value={[currentTime]}
            max={maxTime}
            step={0.1}
            onValueChange={handleSliderChange}
            className="cursor-pointer"
          />
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>{formatTime(currentTime)}</span>
            <div className="flex items-center gap-1">
              {isLimited && (
                <>
                  <Lock className="w-3 h-3" />
                  <span className="text-xs">Prévia limitada</span>
                </>
              )}
              <span className="ml-1">{formatTime(maxTime)}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default LimitedAudioPlayer;
