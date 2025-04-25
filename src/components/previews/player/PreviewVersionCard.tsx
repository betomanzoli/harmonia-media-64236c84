
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Check } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";

interface MusicPreview {
  id: string;
  title: string;
  description: string;
  audioUrl?: string;
  url?: string;
}

interface PreviewVersionCardProps {
  version: MusicPreview;
  isSelected: boolean;
  isApproved: boolean;
  feedback?: string;
  onPlay: (version: MusicPreview) => void;
  onSelect: (id: string) => void;
  onFeedbackChange: (versionId: string, feedback: string) => void;
}

const PreviewVersionCard: React.FC<PreviewVersionCardProps> = ({
  version,
  isSelected,
  isApproved,
  feedback,
  onPlay,
  onSelect,
  onFeedbackChange,
}) => {
  return (
    <Card 
      className={`p-6 transition-all ${isSelected ? 'border-harmonia-green ring-1 ring-harmonia-green' : 'hover:border-harmonia-green/50'}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg">{version.title}</h3>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onPlay(version)}
            className="text-harmonia-green hover:bg-harmonia-green/10"
          >
            <Play className="w-4 h-4 mr-2" />
            Ouvir
          </Button>
          
          {isSelected ? (
            <Button 
              variant="outline" 
              size="sm"
              className="bg-harmonia-green/10 text-harmonia-green border-harmonia-green"
              disabled
            >
              <Check className="w-4 h-4 mr-2" />
              Selecionada
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm"
              className="hover:bg-harmonia-green/10 hover:text-harmonia-green"
              onClick={() => onSelect(version.id)}
              disabled={isApproved}
            >
              Selecionar
            </Button>
          )}
        </div>
      </div>
      
      <p className="text-gray-600 mb-4">{version.description}</p>
      
      {!isApproved && (
        <div className="mt-4 pt-4 border-t">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Suas considerações sobre esta versão:
          </label>
          <Textarea
            placeholder="Digite aqui seu feedback sobre esta versão..."
            value={feedback || ''}
            onChange={(e) => onFeedbackChange(version.id, e.target.value)}
            className="min-h-[100px]"
          />
        </div>
      )}
    </Card>
  );
};

export default PreviewVersionCard;
