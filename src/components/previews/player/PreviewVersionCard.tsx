
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, VolumeX, Volume2, Star, ExternalLink } from 'lucide-react';
import BandcampEmbedPlayer from '../BandcampEmbedPlayer';
import { BandcampUtils } from '@/components/admin/bandcamp/BandcampUtils';

interface PreviewVersionCardProps {
  version: {
    id: string;
    title: string;
    description: string;
    audioUrl?: string;
    url?: string;
    fileId?: string;
    recommended?: boolean;
    bandcampUrl?: string;
  };
  isSelected: boolean;
  isApproved: boolean;
  feedback?: string;
  onSelect: (id: string) => void;
  onPlay: (version: any) => void;
  onFeedbackChange?: (id: string, feedback: string) => void;
}

const PreviewVersionCard: React.FC<PreviewVersionCardProps> = ({
  version,
  isSelected,
  isApproved,
  feedback,
  onSelect,
  onPlay,
  onFeedbackChange
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Check if the audioUrl is a Bandcamp embed URL
  const isBandcampEmbed = version.audioUrl && version.audioUrl.includes('bandcamp.com/EmbeddedPlayer');
  
  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // If we have a Bandcamp embed, extract original URL if possible or open embed
    if (isBandcampEmbed || version.bandcampUrl) {
      const urlToOpen = version.bandcampUrl || version.audioUrl;
      if (urlToOpen) {
        window.open(urlToOpen, '_blank');
      }
      return;
    }
    
    setIsPlaying(true);
    onPlay(version);
    setTimeout(() => setIsPlaying(false), 1000);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const handleSelect = () => {
    if (!isApproved) {
      onSelect(version.id);
    }
  };

  return (
    <Card className={`
      cursor-pointer transition-all hover:border-harmonia-green/50
      ${isSelected ? 'border-2 border-harmonia-green shadow-md' : ''}
      ${isApproved && isSelected ? 'border-green-500' : ''}
    `} onClick={handleSelect}>
      <CardHeader className="flex flex-row items-start justify-between pb-2 bg-zinc-400">
        <div className="flex items-center">
          <CardTitle className="text-lg text-black">{version.title}</CardTitle>
          {version.recommended && (
            <span className="ml-2 text-yellow-500 flex items-center text-sm font-medium">
              <Star className="h-4 w-4 fill-yellow-500" />
              <span className="ml-1">Recomendada</span>
            </span>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="bg-zinc-400">
        <p className="text-sm text-black mb-4">{version.description}</p>
        
        {/* Show Bandcamp embed if available */}
        {isBandcampEmbed && (
          <div className="mb-4">
            <BandcampEmbedPlayer 
              embedUrl={version.audioUrl}
              title="Preview Audio"
              fallbackUrl={version.bandcampUrl}
              className="bg-white border"
            />
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handlePlay} className="flex items-center">
              <Play className="h-4 w-4 mr-1" />
              {isBandcampEmbed || version.bandcampUrl ? 'Abrir' : 'Ouvir'}
            </Button>
            
            {(isBandcampEmbed || version.bandcampUrl) && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={(e) => {
                  e.stopPropagation();
                  const urlToOpen = version.bandcampUrl || version.audioUrl;
                  if (urlToOpen) {
                    window.open(urlToOpen, '_blank');
                  }
                }}
                className="h-8 w-8"
                title="Abrir no Bandcamp"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
            
            {!isBandcampEmbed && !version.bandcampUrl && (
              <Button variant="ghost" size="icon" onClick={toggleMute} className="h-8 w-8">
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            )}
          </div>
          
          {isSelected && (
            <span className="text-sm font-medium text-green-700">
              Selecionada
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PreviewVersionCard;
