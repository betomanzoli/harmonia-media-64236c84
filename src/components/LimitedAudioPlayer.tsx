
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

interface LimitedAudioPlayerProps {
  title: string;
  subtitle: string;
  audioSrc: string;
  previewDuration?: number; // Duração da prévia em segundos (padrão: 30s)
}

const LimitedAudioPlayer: React.FC<LimitedAudioPlayerProps> = ({ 
  title, 
  subtitle, 
  audioSrc,
  previewDuration = 30 
}) => {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previewTimerRef = useRef<number | null>(null);
  
  // Resetar o player quando a fonte de áudio muda
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [audioSrc]);
  
  // Limpar o timer quando o componente é desmontado
  useEffect(() => {
    return () => {
      if (previewTimerRef.current) {
        clearTimeout(previewTimerRef.current);
      }
    };
  }, []);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        if (previewTimerRef.current) {
          clearTimeout(previewTimerRef.current);
          previewTimerRef.current = null;
        }
      } else {
        audioRef.current.play();
        
        // Configurar o timer para parar após a duração da prévia
        if (previewDuration && !previewTimerRef.current) {
          // Calcular tempo restante da prévia
          const remainingPreviewTime = Math.max(0, previewDuration - currentTime) * 1000;
          
          // Se já passou do tempo da prévia, não deixar tocar mais
          if (currentTime >= previewDuration) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setCurrentTime(0);
            setIsPlaying(false);
            toast({
              title: "Prévia limitada",
              description: "Esta é apenas uma prévia de 30 segundos. Entre em contato para ouvir a versão completa."
            });
            return;
          }
          
          previewTimerRef.current = window.setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.pause();
              setIsPlaying(false);
              toast({
                title: "Prévia finalizada",
                description: "Esta é apenas uma prévia de 30 segundos. Entre em contato para ouvir a versão completa."
              });
            }
            previewTimerRef.current = null;
          }, remainingPreviewTime);
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      setCurrentTime(current);
      
      // Verificar se ultrapassou o limite da prévia
      if (previewDuration && current >= previewDuration) {
        audioRef.current.pause();
        setIsPlaying(false);
        if (previewTimerRef.current) {
          clearTimeout(previewTimerRef.current);
          previewTimerRef.current = null;
        }
        toast({
          title: "Prévia finalizada",
          description: "Esta é apenas uma prévia de 30 segundos. Entre em contato para ouvir a versão completa."
        });
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSliderChange = (value: number[]) => {
    if (audioRef.current) {
      // Não permitir que o usuário arraste para além do tempo da prévia
      if (previewDuration && value[0] > previewDuration) {
        audioRef.current.currentTime = previewDuration;
        setCurrentTime(previewDuration);
        toast({
          title: "Prévia limitada",
          description: "Esta é apenas uma prévia de 30 segundos. Entre em contato para ouvir a versão completa."
        });
      } else {
        audioRef.current.currentTime = value[0];
        setCurrentTime(value[0]);
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Calcular o valor máximo do slider (limitar ao tempo da prévia)
  const maxSliderValue = previewDuration ? Math.min(duration, previewDuration) : duration;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
        <Button 
          onClick={togglePlayPause} 
          variant="outline" 
          size="icon" 
          className="w-12 h-12 rounded-full border-harmonia-green bg-harmonia-green/10"
        >
          {isPlaying ? (
            <Pause className="h-5 w-5 text-harmonia-green" />
          ) : (
            <Play className="h-5 w-5 text-harmonia-green" />
          )}
        </Button>
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-gray-400 text-sm">{subtitle}</p>
          <span className="text-xs text-harmonia-green mt-1 block">
            Prévia de 30 segundos
          </span>
        </div>
      </div>
      <div className="space-y-2">
        <Slider 
          value={[currentTime]} 
          max={maxSliderValue || 100} 
          step={0.1} 
          onValueChange={handleSliderChange} 
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <span>
            {previewDuration && duration > previewDuration 
              ? `${formatTime(Math.min(currentTime, previewDuration))} / ${formatTime(previewDuration)}`
              : formatTime(duration)
            }
          </span>
        </div>
      </div>
      
      <audio 
        ref={audioRef} 
        src={audioSrc} 
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />
    </div>
  );
};

export default LimitedAudioPlayer;
