
import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Star, Download, Info, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";

interface Version {
  id: string;
  name: string;
  url?: string;  // Make this optional for compatibility
  audioUrl?: string; // Add this for new code
  dateAdded: string;
  recommended?: boolean;
}

interface PreviewVersionsListProps {
  versions: Version[];
  onDeleteVersion?: (id: string) => void;
}

const PreviewVersionsList: React.FC<PreviewVersionsListProps> = ({ versions, onDeleteVersion }) => {
  const { toast } = useToast();
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previewDuration = 30; // 30 seconds preview
  const timeoutRef = useRef<number | null>(null);

  const handlePlay = (version: Version) => {
    if (playingId === version.id) {
      // Pause the current playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        if (timeoutRef.current) {
          window.clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
      setPlayingId(null);
    } else {
      // Stop currently playing audio if any
      if (audioRef.current) {
        audioRef.current.pause();
        if (timeoutRef.current) {
          window.clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }

      // Start new audio
      if (audioRef.current) {
        // Use audioUrl if available, otherwise fall back to url
        const audioSource = version.audioUrl || version.url;
        if (!audioSource) {
          toast({
            title: "Erro ao reproduzir",
            description: "Não foi possível encontrar o arquivo de áudio.",
            variant: "destructive"
          });
          return;
        }
        
        audioRef.current.src = audioSource;
        audioRef.current.currentTime = 0;
        audioRef.current.play();
        
        // Set timeout to stop after preview duration
        timeoutRef.current = window.setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.pause();
            setPlayingId(null);
            toast({
              title: "Prévia finalizada",
              description: "Esta é apenas uma prévia de 30 segundos."
            });
          }
        }, previewDuration * 1000);
        
        setPlayingId(version.id);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      
      // Stop at preview duration
      if (audioRef.current.currentTime >= previewDuration) {
        audioRef.current.pause();
        setPlayingId(null);
        if (timeoutRef.current) {
          window.clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        toast({
          title: "Prévia finalizada",
          description: "Esta é apenas uma prévia de 30 segundos."
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
      const newTime = value[0];
      
      // Don't allow seeking beyond preview time
      if (newTime > previewDuration) {
        audioRef.current.currentTime = previewDuration;
        setCurrentTime(previewDuration);
        toast({
          title: "Prévia limitada",
          description: "Esta é apenas uma prévia de 30 segundos."
        });
      } else {
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
      }
    }
  };

  const handleDownload = (version: Version) => {
    // Use audioUrl if available, otherwise fall back to url
    const audioSource = version.audioUrl || version.url;
    if (!audioSource) {
      toast({
        title: "Erro ao baixar",
        description: "Não foi possível encontrar o arquivo de áudio.",
        variant: "destructive"
      });
      return;
    }
    
    // Full version download for admin purposes
    window.open(audioSource, '_blank');
    toast({
      title: "Download iniciado",
      description: `Baixando a versão: ${version.name}`
    });
  };

  const handleDelete = (id: string) => {
    if (onDeleteVersion) {
      // Stop audio if playing this version
      if (playingId === id && audioRef.current) {
        audioRef.current.pause();
        setPlayingId(null);
      }
      
      onDeleteVersion(id);
      toast({
        title: "Versão removida",
        description: "A versão foi removida com sucesso."
      });
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Versões do projeto</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Hidden audio element */}
        <audio 
          ref={audioRef} 
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setPlayingId(null)}
        />
        
        <div className="space-y-4">
          {versions.map((version) => (
            <div 
              key={version.id} 
              className={`
                flex flex-col sm:flex-row sm:items-center justify-between 
                border-b pb-4 gap-3
                ${version.recommended ? 'bg-harmonia-green/5 -mx-2 p-2 rounded border border-harmonia-green/20' : ''}
              `}
            >
              <div className="flex-1">
                <div className="flex items-center">
                  <h3 className="font-medium">{version.name}</h3>
                  {version.recommended && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <span className="ml-2 inline-flex items-center">
                            <Star className="h-4 w-4 fill-harmonia-green text-harmonia-green" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Versão recomendada para o cliente</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                <p className="text-sm text-gray-500">Adicionado em {version.dateAdded}</p>
                
                {/* Display audio player when this version is playing */}
                {playingId === version.id && (
                  <div className="mt-2 space-y-1">
                    <Slider
                      value={[currentTime]}
                      max={Math.min(previewDuration, duration)}
                      step={0.1}
                      onValueChange={handleSliderChange}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(Math.min(previewDuration, duration))}</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handlePlay(version)}
                  className={playingId === version.id ? "bg-harmonia-green/10 text-harmonia-green" : "text-harmonia-green"}
                >
                  {playingId === version.id ? (
                    <>
                      <Pause className="h-4 w-4 mr-1" />
                      Pausar
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-1" />
                      Ouvir
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDownload(version)}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
                
                {onDeleteVersion && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDelete(version.id)}
                    className="text-red-500 hover:bg-red-50"
                  >
                    <Trash className="h-4 w-4 mr-1" />
                    Remover
                  </Button>
                )}
              </div>
            </div>
          ))}
          
          {versions.length === 0 && (
            <div className="text-center py-8">
              <Info className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma versão disponível ainda.</p>
              <p className="text-sm text-gray-400 mt-2">Adicione uma nova versão para o cliente avaliar.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PreviewVersionsList;
