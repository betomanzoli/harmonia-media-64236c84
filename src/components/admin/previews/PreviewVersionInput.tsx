import React from 'react';
import { Trash } from 'lucide-react';
import LimitedAudioPlayer from '@/components/LimitedAudioPlayer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";

interface PreviewVersionInputProps {
  index: number;
  title: string;
  description: string;
  audioUrl: string;
  recommended: boolean;
  onTitleChange: (index: number, value: string) => void;
  onDescriptionChange: (index: number, value: string) => void;
  onAudioUrlChange: (index: number, value: string) => void;
  onRecommendedChange: (index: number, value: boolean) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

const PreviewVersionInput: React.FC<PreviewVersionInputProps> = ({
  index,
  title,
  description,
  audioUrl,
  recommended,
  onTitleChange,
  onDescriptionChange,
  onAudioUrlChange,
  onRecommendedChange,
  onRemove,
  canRemove
}) => {
  return (
    <Card className="relative">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Versão {index + 1}</h4>
            {canRemove && (
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                className="text-red-600 hover:text-red-800"
                onClick={() => onRemove(index)}
              >
                <Trash className="w-4 h-4" />
              </Button>
            )}
          </div>
          
          <div className="space-y-3">
            <div>
              <label htmlFor={`version-title-${index}`} className="block text-sm font-medium mb-1">
                Título
              </label>
              <Input
                id={`version-title-${index}`}
                placeholder="Ex: Versão Acústica"
                value={title}
                onChange={(e) => onTitleChange(index, e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor={`version-description-${index}`} className="block text-sm font-medium mb-1">
                Descrição
              </label>
              <Textarea
                id={`version-description-${index}`}
                placeholder="Descreva esta versão musical"
                value={description}
                onChange={(e) => onDescriptionChange(index, e.target.value)}
                rows={2}
              />
            </div>
            
            <div>
              <label htmlFor={`version-audio-${index}`} className="block text-sm font-medium mb-1">
                URL do Google Drive
              </label>
              <Input
                id={`version-audio-${index}`}
                placeholder="https://drive.google.com/file/d/ID_DO_ARQUIVO/view"
                value={audioUrl}
                onChange={(e) => onAudioUrlChange(index, e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Cole o link de compartilhamento do áudio no Google Drive
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id={`version-recommended-${index}`}
                checked={recommended}
                onCheckedChange={(checked) => onRecommendedChange(index, checked as boolean)}
              />
              <label htmlFor={`version-recommended-${index}`} className="text-sm font-medium">
                Marcar como versão recomendada
              </label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PreviewVersionInput;
