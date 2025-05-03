
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Play } from 'lucide-react';

interface MusicPreview {
  id: string;
  title: string;
  description: string;
  audioUrl?: string;
  url?: string;
  recommended?: boolean;
}

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
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center"
            onClick={() => onPlay && onPlay(version)}
          >
            <Play className="w-4 h-4 mr-1" /> Ouvir
          </Button>
          
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
