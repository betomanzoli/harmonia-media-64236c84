
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Play, Download } from 'lucide-react';
import { MusicPreview } from '@/types/project.types';

interface PreviewVersionCardProps {
  version: MusicPreview;
  isSelected: boolean;
  isApproved: boolean;
  feedback?: string;
  onPlay?: (version: MusicPreview) => void;
  onSelect: (id: string) => void;
  onFeedbackChange?: (id: string, feedback: string) => void;
}

const PreviewVersionCard: React.FC<PreviewVersionCardProps> = ({
  version,
  isSelected,
  isApproved,
  feedback,
  onPlay,
  onSelect,
  onFeedbackChange
}) => {
  console.log('Rendering PreviewVersionCard:', { isSelected, isApproved, version });
  
  const handleDownloadFinal = () => {
    if (version.finalVersionUrl) {
      window.open(version.finalVersionUrl, '_blank');
    }
  };
  
  const handleDownloadStems = () => {
    if (version.stemsUrl) {
      window.open(version.stemsUrl, '_blank');
    }
  };
  
  return (
    <Card 
      className={`p-6 transition-all ${
        isSelected ? 'border-green-500 ring-1 ring-green-500' : 'hover:border-green-400'
      }`}
    >
      <div className="flex justify-between items-start mb-4 flex-wrap">
        <div>
          <h3 className="font-bold text-lg">{version.title}</h3>
          {version.recommended && (
            <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full mt-1">
              Recomendada
            </span>
          )}
        </div>
        <div className="flex gap-2 flex-wrap mt-2 sm:mt-0">
          {/* Play button - always visible */}
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center"
            onClick={() => onPlay && onPlay(version)}
          >
            <Play className="w-4 h-4 mr-1" /> Ouvir
          </Button>
          
          {/* Selection button logic */}
          {isSelected ? (
            <Button 
              variant="outline" 
              size="sm"
              className="bg-green-50 text-green-700 border-green-300"
              disabled
            >
              <Check className="w-4 h-4 mr-2" />
              Selecionada
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm"
              className="hover:bg-green-50 hover:text-green-700"
              onClick={() => onSelect(version.id)}
            >
              Selecionar
            </Button>
          )}
          
          {/* Final Version download button - only for approved projects */}
          {isApproved && version.finalVersionUrl && (
            <Button 
              variant="outline" 
              size="sm"
              className="bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100"
              onClick={handleDownloadFinal}
            >
              <Download className="w-4 h-4 mr-2" />
              Versão Final
            </Button>
          )}
          
          {/* Stems download button - only for approved projects with specific packages */}
          {isApproved && version.stemsUrl && (
            <Button 
              variant="outline" 
              size="sm"
              className="bg-purple-50 text-purple-700 border-purple-300 hover:bg-purple-100"
              onClick={handleDownloadStems}
            >
              <Download className="w-4 h-4 mr-2" />
              Stems
            </Button>
          )}
        </div>
      </div>
      
      <p className="text-gray-600 mb-4">{version.description}</p>
      
      {onFeedbackChange && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Feedback específico para esta versão:
          </label>
          <textarea
            className="w-full p-2 border rounded-md"
            rows={2}
            value={feedback}
            onChange={(e) => onFeedbackChange(version.id, e.target.value)}
            placeholder="Escreva seu feedback específico para esta versão..."
          />
        </div>
      )}
    </Card>
  );
};

export default PreviewVersionCard;
