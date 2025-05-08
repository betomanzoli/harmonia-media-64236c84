
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Download, CheckCircle, Music, Disc } from 'lucide-react';
import AudioPlayer from '../player/AudioPlayer';
import { MusicPreview } from '@/types/project.types';

interface PreviewVersionCardProps {
  version: MusicPreview;
  isSelected: boolean;
  onSelect: () => void;
  isApproved: boolean;
}

const PreviewVersionCard: React.FC<PreviewVersionCardProps> = ({ 
  version, 
  isSelected,
  onSelect,
  isApproved
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  // When a version is approved and has final version URL
  const hasFinalVersion = isApproved && version.final_version_url;
  const finalVersionUrl = hasFinalVersion 
    ? version.final_version_url 
    : '';
    
  // When a version is approved and has stems URL 
  const hasStems = isApproved && version.stems_url;
  const stemsUrl = hasStems
    ? version.stems_url
    : '';
  
  // Reset playing state when selected version changes
  useEffect(() => {
    if (!isSelected) {
      setIsPlaying(false);
    }
  }, [isSelected]);
  
  // Decide which audio URL to use
  const audioSrc = version.audio_url;
  
  if (!audioSrc) {
    return null;
  }
  
  const handlePlayPause = () => {
    if (!isSelected) {
      onSelect();
    }
    setIsPlaying(!isPlaying);
  };
  
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'Data desconhecida';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch (e) {
      console.error('Error formatting date:', e);
      return 'Data inválida';
    }
  };
  
  return (
    <Card className={`overflow-hidden transition-all ${
      isSelected 
        ? 'border-harmonia-green border-2'
        : 'hover:border-gray-300'
    }`}>
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {version.title || version.name}
              </h3>
              {version.recommended && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                  Recomendada
                </span>
              )}
              {version.final && isApproved && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                  Final
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Adicionada em {formatDate(version.date_added || version.created_at)}
            </p>
            <p className="mt-2 text-gray-700">
              {version.description}
            </p>
          </div>
          
          <Button
            variant={isPlaying && isSelected ? "default" : "outline"}
            size="sm"
            onClick={handlePlayPause}
            className={`flex items-center space-x-1 ${
              isPlaying && isSelected ? 'bg-harmonia-green hover:bg-harmonia-green/90' : ''
            }`}
          >
            <Play className="h-4 w-4" />
            <span>
              {isPlaying && isSelected ? 'Pausar' : 'Play'}
            </span>
          </Button>
        </div>
        
        {/* Download buttons for final version and stems when approved */}
        {isApproved && (
          <div className="flex flex-wrap gap-2 mt-4">
            {hasFinalVersion && (
              <Button 
                variant="outline" 
                size="sm"
                asChild
                className="text-xs"
              >
                <a href={finalVersionUrl} target="_blank" rel="noopener noreferrer" download>
                  <Download className="h-3 w-3 mr-1" />
                  Versão Final
                </a>
              </Button>
            )}
            
            {hasStems && (
              <Button 
                variant="outline" 
                size="sm"
                asChild
                className="text-xs"
              >
                <a href={stemsUrl} target="_blank" rel="noopener noreferrer" download>
                  <Music className="h-3 w-3 mr-1" />
                  Stems
                </a>
              </Button>
            )}
          </div>
        )}
      </div>
      
      {isSelected && (
        <div className="border-t">
          <AudioPlayer 
            src={audioSrc} 
            isPlaying={isPlaying} 
            onPlayPause={setIsPlaying}
          />
        </div>
      )}
    </Card>
  );
};

export default PreviewVersionCard;
