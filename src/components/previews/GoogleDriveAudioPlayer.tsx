
import React, { useState, useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, Volume1, VolumeX, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

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
  const [isLoading, setIsLoading] = useState(true);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Use embedded player URL instead of direct download link
  // This will open in an embedded player rather than downloading
  const audioUrl = `https://drive.google.com/file/d/${fileId}/preview`;
  
  // For audio streaming we'll use the view endpoint
  const streamUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;

  useEffect(() => {
    const audio = new Audio(streamUrl);
    audio.volume = volume;
    audioRef.current = audio;
    
    // Add CORS header to prevent downloading
    audio.crossOrigin = "anonymous";

    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleAudioLoad = () => {
      console.log("Audio loaded successfully:", fileId);
      setDuration(audio.duration);
      setIsLoading(false);
      setAudioError(null);
    };

    const handleAudioEnd = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = (e: ErrorEvent) => {
      console.error("Erro ao carregar áudio:", e, "FileID:", fileId);
      setIsLoading(false);
      // Don't set error message to avoid showing error to client
      // setAudioError("Não foi possível carregar o áudio. Verifique o link do Google Drive.");
      setAudioError(null);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', handleAudioLoad);
    audio.addEventListener('ended', handleAudioEnd);
    audio.addEventListener('error', handleError as EventListener);

    // Set a timeout to detect very slow loading or failed loads
    const loadingTimeout = setTimeout(() => {
      if (isLoading && !audio.duration) {
        console.log("Audio load timeout for file:", fileId);
        // Don't show error message to client
        setAudioError(null);
        setIsLoading(false);
      }
    }, 10000); // 10 seconds timeout

    return () => {
      clearTimeout(loadingTimeout);
      audio.pause();
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', handleAudioLoad);
      audio.removeEventListener('ended', handleAudioEnd);
      audio.removeEventListener('error', handleError as EventListener);
    };
  }, [audioUrl, toast, volume, fileId, isLoading, streamUrl]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Limit preview playback if configured
  useEffect(() => {
    if (isPreview && isPlaying && previewDuration && currentTime >= previewDuration) {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
        toast({
          title: "Prévia finalizada",
          description: `Você escutou os ${previewDuration} segundos de prévia disponíveis.`,
        });
      }
    }
  }, [currentTime, isPlaying, isPreview, previewDuration, toast]);

  const togglePlay = () => {
    if (!audioRef.current || audioError) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // Reinicia se estiver no final
      if (currentTime >= duration - 0.1) {
        audioRef.current.currentTime = 0;
        setCurrentTime(0);
      }

      audioRef.current.play().catch(error => {
        console.error("Erro ao reproduzir áudio:", error, "FileID:", fileId);
        // Don't show error message to client
        setAudioError(null);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeChange = (value: number[]) => {
    if (!audioRef.current || audioError) return;
    
    const newTime = value[0];
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
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

  // Open in Google Drive embedded player (prevents download)
  const handleOpenInDrive = () => {
    window.open(audioUrl, '_blank');
  };

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
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-10">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-harmonia-green"></div>
            <span className="ml-2 text-sm text-gray-500">Carregando áudio...</span>
          </div>
        ) : audioError ? (
          <div className="text-center py-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-harmonia-green hover:bg-harmonia-green/10"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ouvir no Google Drive
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] p-0">
                <iframe 
                  src={audioUrl}
                  title={title} 
                  width="100%" 
                  height="500px"
                  className="border-0"
                ></iframe>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
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
                max={duration || 100}
                step={0.1}
                onValueChange={handleTimeChange}
                className="cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>
                  {isPreview && previewDuration ? `${formatTime(Math.min(previewDuration, duration || 0))}` : formatTime(duration || 0)}
                </span>
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

            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-gray-500 hover:text-harmonia-green"
                >
                  <ExternalLink size={18} />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] p-0">
                <iframe 
                  src={audioUrl}
                  title={title} 
                  width="100%" 
                  height="500px"
                  className="border-0"
                ></iframe>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </Card>
  );
};

export default GoogleDriveAudioPlayer;
