
import React, { useState, useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, Volume1, VolumeX, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GoogleDriveAudioPlayerProps {
  fileId: string;
  title: string;
  subtitle?: string;
  isPreview?: boolean;
  previewDuration?: number; // duração da prévia em segundos
}

const GoogleDriveAudioPlayer: React.FC<GoogleDriveAudioPlayerProps> = ({
  fileId,
  title,
  subtitle,
  isPreview = true,
  previewDuration = 30
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Google Drive direct stream URL
  const audioUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

  useEffect(() => {
    const audio = new Audio(audioUrl);
    audio.volume = volume;
    audioRef.current = audio;

    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      
      // Se for prévia e passar do tempo limite, pare a reprodução
      if (isPreview && audio.currentTime >= previewDuration) {
        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false);
        setCurrentTime(0);
        toast({
          title: "Prévia finalizada",
          description: "Esta é apenas uma prévia de 30 segundos. A versão completa estará disponível após a aprovação.",
        });
      }
    };

    const handleAudioLoad = () => {
      setDuration(isPreview ? Math.min(previewDuration, audio.duration) : audio.duration);
    };

    const handleAudioEnd = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', handleAudioLoad);
    audio.addEventListener('ended', handleAudioEnd);

    return () => {
      audio.pause();
      audio.currentTime = 0;
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', handleAudioLoad);
      audio.removeEventListener('ended', handleAudioEnd);
    };
  }, [audioUrl, isPreview, previewDuration, toast, volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // Se for prévia e o tempo atual estiver no limite, volte ao início
      if (isPreview && currentTime >= previewDuration) {
        audioRef.current.currentTime = 0;
        setCurrentTime(0);
      }

      audioRef.current.play().catch(error => {
        console.error("Erro ao reproduzir áudio:", error);
        toast({
          title: "Erro ao reproduzir",
          description: "Não foi possível reproduzir o áudio do Google Drive. Tente novamente.",
          variant: "destructive"
        });
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeChange = (value: number[]) => {
    if (!audioRef.current) return;
    
    const newTime = value[0];
    
    // Se for prévia, não permita deslizar além do tempo permitido
    if (isPreview && newTime > previewDuration) {
      audioRef.current.currentTime = previewDuration;
      setCurrentTime(previewDuration);
      toast({
        title: "Prévia limitada",
        description: "Esta é apenas uma prévia de 30 segundos.",
      });
    } else {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    if (!audioRef.current) return;
    const newVolume = value[0];
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const VolumeIcon = () => {
    if (volume === 0) return <VolumeX size={18} />;
    if (volume < 0.5) return <Volume1 size={18} />;
    return <Volume2 size={18} />;
  };

  // Calcular o tempo máximo para exibição
  const maxDisplayTime = isPreview ? Math.min(previewDuration, duration) : duration;

  return (
    <Card className="p-4 shadow-sm">
      <div className="flex flex-col space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-sm">{title}</h3>
            {subtitle && (
              <p className="text-xs text-gray-500">{subtitle}</p>
            )}
          </div>
          
          {isPreview && (
            <span className="text-xs px-2 py-0.5 bg-harmonia-green/20 text-harmonia-green rounded-full flex items-center">
              <Lock className="w-3 h-3 mr-1" />
              Prévia 30s
            </span>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <Button
            onClick={togglePlay}
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full border-harmonia-green text-harmonia-green hover:bg-harmonia-green/10"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </Button>

          <div className="flex-1">
            <Slider
              value={[currentTime]}
              max={maxDisplayTime || 100}
              step={0.1}
              onValueChange={handleTimeChange}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(maxDisplayTime || 0)}</span>
            </div>
          </div>

          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-harmonia-green"
              onClick={() => setShowVolumeControl(!showVolumeControl)}
            >
              <VolumeIcon />
            </Button>
            
            {showVolumeControl && (
              <div className="absolute bottom-full right-0 p-3 bg-white shadow-md rounded-md mb-2 w-32 z-10">
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
    </Card>
  );
};

export default GoogleDriveAudioPlayer;
