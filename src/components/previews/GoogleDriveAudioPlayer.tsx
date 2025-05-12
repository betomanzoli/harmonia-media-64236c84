
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface GoogleDriveAudioPlayerProps {
  fileId: string;
  title: string;
  subtitle?: string;
  isPreview?: boolean;
}

const GoogleDriveAudioPlayer: React.FC<GoogleDriveAudioPlayerProps> = ({
  fileId,
  title,
  subtitle,
  isPreview = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
  
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error("Erro ao reproduzir áudio:", error);
        });
      } else {
        audioRef.current.pause();
      }
      
      audioRef.current.muted = isMuted;
    }
  }, [isPlaying, isMuted]);
  
  useEffect(() => {
    const updateProgress = () => {
      if (audioRef.current) {
        const duration = audioRef.current.duration || 1;
        const currentTime = audioRef.current.currentTime;
        setProgress((currentTime / duration) * 100);
      }
    };
    
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener('timeupdate', updateProgress);
      audioElement.addEventListener('ended', () => setIsPlaying(false));
    }
    
    return () => {
      if (audioElement) {
        audioElement.removeEventListener('timeupdate', updateProgress);
        audioElement.removeEventListener('ended', () => setIsPlaying(false));
      }
    };
  }, []);
  
  const handlePlay = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.addEventListener('ended', () => setIsPlaying(false));
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleDriveRedirect = () => {
    const driveUrl = `https://drive.google.com/file/d/${fileId}/view`;
    window.open(driveUrl, '_blank');
  };

  const togglePlayer = () => {
    setShowPlayer(!showPlayer);
  };
  
  return (
    <div className="bg-gray-100 rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="font-medium">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handlePlay}
            className={isPlaying ? "bg-harmonia-green/20 border-harmonia-green text-harmonia-green" : ""}
          >
            {isPlaying ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
            {isPlaying ? "Pausar" : "Ouvir"}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            className="px-2"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      {isPlaying && (
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
          <div 
            className="bg-harmonia-green h-1.5 rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
      
      {isPreview && (
        <audio ref={audioRef} preload="metadata" className="hidden">
          <source src={audioUrl} type="audio/mpeg" />
          Seu navegador não suporta o elemento de áudio.
        </audio>
      )}
      
      <div className="flex justify-end mt-2">
        <Button 
          variant="link" 
          size="sm"
          className="text-xs text-gray-600 hover:text-harmonia-green p-0"
          onClick={handleDriveRedirect}
        >
          Abrir no Google Drive
        </Button>
      </div>
    </div>
  );
};

export default GoogleDriveAudioPlayer;
