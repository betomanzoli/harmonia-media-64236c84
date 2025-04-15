
import React, { useState, useRef, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Função para processar URLs do Google Drive
  const processGoogleDriveUrl = (url: string) => {
    // Se já é uma URL formatada para visualização ou download direto, use-a
    if (url.includes('export=view') || url.includes('export=download')) {
      return url;
    }
    
    // Verificar se é uma URL de compartilhamento do Google Drive
    if (url.includes('drive.google.com/file/d/')) {
      const fileIdMatch = url.match(/\/d\/([^\/]+)/);
      if (fileIdMatch && fileIdMatch[1]) {
        return `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
      }
    }
    
    // Verificar se é apenas o ID do arquivo
    if (url.match(/^[a-zA-Z0-9_-]{25,}$/)) {
      return `https://drive.google.com/uc?export=view&id=${url}`;
    }
    
    // Se não conseguiu identificar como URL do Google Drive, retornar original
    return url;
  };
  
  useEffect(() => {
    setError(null);
    const processedAudioSrc = processGoogleDriveUrl(audioSrc);
    console.log("URL de áudio processada:", processedAudioSrc);

    const audio = new Audio(processedAudioSrc);
    audioRef.current = audio;
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLimited(audio.duration > previewDuration);
      console.log("Áudio carregado, duração:", audio.duration);
    };
    
    const handleLoadError = (e: any) => {
      console.error("Erro ao carregar áudio:", e);
      setError("Não foi possível carregar este áudio. Verifique se a URL está correta.");
      toast({
        title: "Erro ao carregar áudio",
        description: "Verifique se a URL está correta e se o arquivo está acessível",
        variant: "destructive"
      });
    };
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      
      // Se estiver limitado e passar do tempo de prévia, pause o áudio
      if (isLimited && audio.currentTime >= previewDuration) {
        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false);
        toast({
          title: "Prévia finalizada",
          description: "Esta é apenas uma prévia de 30 segundos. A versão completa estará disponível após a aprovação.",
        });
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
    audio.addEventListener('error', handleLoadError);
    
    // Prevenir download do áudio
    document.addEventListener('contextmenu', preventContextMenu);
    
    // Criar elemento de áudio oculto para melhorar compatibilidade com navegadores
    const audioElement = document.createElement('audio');
    audioElement.src = processedAudioSrc;
    audioElement.controls = false;
    audioElement.setAttribute('controlsList', 'nodownload');
    audioElement.style.display = 'none';
    audioElement.oncontextmenu = () => false;
    document.body.appendChild(audioElement);
    audioElementRef.current = audioElement;
    
    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleLoadError);
      document.removeEventListener('contextmenu', preventContextMenu);
      
      // Remover elemento de áudio oculto
      if (audioElementRef.current) {
        document.body.removeChild(audioElementRef.current);
      }
    };
  }, [audioSrc, previewDuration, isLimited, toast]);
  
  const preventContextMenu = (e: MouseEvent) => {
    if ((e.target as HTMLElement)?.closest('audio')) {
      e.preventDefault();
      return false;
    }
  };
  
  const togglePlayPause = () => {
    if (!audioRef.current || error) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // Se atingiu o limite, reinicie do início
      if (isLimited && currentTime >= previewDuration) {
        audioRef.current.currentTime = 0;
        setCurrentTime(0);
      }
      
      audioRef.current.play().catch(error => {
        console.error("Erro ao reproduzir áudio:", error);
        toast({
          title: "Erro ao reproduzir",
          description: "Não foi possível reproduzir o áudio. Tente novamente.",
          variant: "destructive"
        });
      });
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const handleSliderChange = (value: number[]) => {
    if (!audioRef.current || error) return;
    
    const newTime = value[0];
    
    // Se estiver limitado, não permita deslizar além do tempo de prévia
    if (isLimited && newTime > previewDuration) {
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
      
      {error ? (
        <div className="p-3 text-sm text-red-500 bg-red-100/10 border border-red-300/20 rounded">
          {error}
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlayPause}
            className="w-10 h-10 rounded-full bg-harmonia-green text-white flex items-center justify-center hover:bg-harmonia-green/90 transition-colors"
            disabled={!!error}
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
              disabled={!!error}
            />
            
            <div className="flex justify-between text-xs text-gray-500">
              <span>{formatTime(currentTime)}</span>
              <div className="flex items-center">
                {isLimited && <Lock className="w-3 h-3 mr-1" />}
                <span>{formatTime(isLimited ? previewDuration : duration)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default LimitedAudioPlayer;
