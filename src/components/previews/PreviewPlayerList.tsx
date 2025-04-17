
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, Check, Loader2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

interface Preview {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
}

interface PreviewPlayerListProps {
  previews: Preview[];
  selectedPreview: string | null;
  setSelectedPreview: (id: string) => void;
  isApproved?: boolean;
}

const PreviewPlayerList: React.FC<PreviewPlayerListProps> = ({
  previews,
  selectedPreview,
  setSelectedPreview,
  isApproved = false
}) => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const { toast } = useToast();
  const MAX_PREVIEW_TIME = 30; // 30 seconds preview limit
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Reset player when switching tracks
  useEffect(() => {
    if (audioRef.current && currentlyPlaying) {
      setIsLoading(true);
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  }, [currentlyPlaying]);

  const handlePlayPause = (preview: Preview) => {
    if (!audioRef.current) return;
    
    // If clicking the same preview that's currently playing
    if (currentlyPlaying === preview.id) {
      if (audioRef.current.paused) {
        // Resume playback
        audioRef.current.play().catch(error => {
          console.error("Play error:", error);
          toast({
            title: "Erro ao reproduzir",
            description: "Não foi possível reproduzir o áudio. Tente novamente.",
            variant: "destructive"
          });
        });
      } else {
        // Pause playback
        audioRef.current.pause();
        if (timeoutRef.current) {
          window.clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
    } else {
      // Clicking a different preview, stop the current one
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      // Load and play the new one
      audioRef.current.src = preview.audioUrl;
      setCurrentlyPlaying(preview.id);
      
      audioRef.current.play().catch(error => {
        console.error("Play error:", error);
        setCurrentlyPlaying(null);
        toast({
          title: "Erro ao reproduzir",
          description: "Não foi possível reproduzir o áudio. Tente novamente.",
          variant: "destructive"
        });
      });
      
      // Set a timeout to stop after 30 seconds
      timeoutRef.current = window.setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.pause();
          setCurrentlyPlaying(null);
          toast({
            title: "Prévia finalizada",
            description: "Esta é apenas uma prévia de 30 segundos. Aprovando o projeto, você terá acesso à versão completa.",
          });
        }
      }, MAX_PREVIEW_TIME * 1000);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      
      // Stop at preview duration
      if (audioRef.current.currentTime >= MAX_PREVIEW_TIME) {
        audioRef.current.pause();
        setCurrentlyPlaying(null);
        if (timeoutRef.current) {
          window.clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        toast({
          title: "Prévia finalizada",
          description: "Esta é apenas uma prévia de 30 segundos. Aprovando o projeto, você terá acesso à versão completa.",
        });
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setIsLoading(false);
    }
  };
  
  const handleSliderChange = (value: number[]) => {
    if (audioRef.current) {
      const newTime = value[0];
      
      // Don't allow seeking beyond preview time
      if (newTime > MAX_PREVIEW_TIME) {
        audioRef.current.currentTime = MAX_PREVIEW_TIME;
        setCurrentTime(MAX_PREVIEW_TIME);
        toast({
          title: "Prévia limitada",
          description: "Esta é apenas uma prévia de 30 segundos. Aprovando o projeto, você terá acesso à versão completa.",
        });
      } else {
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handlePreviewSelect = (previewId: string) => {
    // If already playing this preview, don't change selection
    if (currentlyPlaying === previewId) return;
    
    // If already selected, deselect
    if (selectedPreview === previewId) {
      setSelectedPreview('');
    } else {
      setSelectedPreview(previewId);
    }
  };

  return (
    <div className="space-y-4">
      {/* Hidden audio element for playback */}
      <audio 
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setCurrentlyPlaying(null)}
        onPlay={() => {}}
        onPause={() => {}}
        onError={() => {
          setIsLoading(false);
          setCurrentlyPlaying(null);
          toast({
            title: "Erro",
            description: "Ocorreu um erro ao carregar o áudio. Por favor, tente novamente.",
            variant: "destructive"
          });
        }}
      />

      <p className="text-amber-500 text-sm mb-2">
        * As prévias estão limitadas a 30 segundos. Após a aprovação, você receberá a versão completa.
      </p>
      
      {previews.map((preview) => (
        <Card 
          key={preview.id} 
          className={`overflow-hidden transition-all ${
            selectedPreview === preview.id 
              ? 'border-harmonia-green ring-1 ring-harmonia-green' 
              : 'hover:border-gray-300'
          }`}
        >
          <CardContent className="p-0">
            <div 
              className="p-4 flex flex-col md:flex-row gap-4 cursor-pointer"
              onClick={() => handlePreviewSelect(preview.id)}
            >
              <div className="flex-1">
                <div className="flex items-center">
                  <h3 className="text-lg font-medium">{preview.title}</h3>
                  {isApproved && selectedPreview === preview.id && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <Check className="w-3 h-3 mr-1" />
                      Aprovada
                    </span>
                  )}
                </div>
                <p className="text-gray-500 mt-1">{preview.description}</p>
                
                {/* Audio player controls */}
                {currentlyPlaying === preview.id && (
                  <div className="mt-4 space-y-1">
                    <Slider 
                      value={[currentTime]} 
                      max={Math.min(MAX_PREVIEW_TIME, duration)} 
                      step={0.1}
                      onValueChange={handleSliderChange}
                      disabled={isLoading}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(Math.min(MAX_PREVIEW_TIME, duration))}</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-end">
                <Button
                  variant={currentlyPlaying === preview.id ? "default" : "outline"}
                  className={`h-12 w-12 rounded-full p-0 ${
                    currentlyPlaying === preview.id 
                      ? 'bg-harmonia-green hover:bg-harmonia-green/90' 
                      : 'text-harmonia-green hover:bg-harmonia-green/10'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayPause(preview);
                  }}
                  disabled={isLoading}
                >
                  {isLoading && currentlyPlaying === preview.id ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : currentlyPlaying === preview.id && !audioRef.current?.paused ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PreviewPlayerList;
