
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { X } from 'lucide-react';
import LimitedAudioPlayer from '@/components/LimitedAudioPlayer';

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
  onTitleChange,
  onDescriptionChange,
  onAudioUrlChange,
  onRemove,
  canRemove,
}) => {
  return (
    <Card className="p-4 mb-4 relative">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-medium">Versão {index + 1}</h4>
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemove(index)}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor={`version-title-${index}`}>Título da Versão</Label>
          <Input
            id={`version-title-${index}`}
            value={title}
            onChange={(e) => onTitleChange(index, e.target.value)}
            placeholder="Ex: Versão Acústica"
            required
          />
        </div>

        <div>
          <Label htmlFor={`version-description-${index}`}>Descrição</Label>
          <Textarea
            id={`version-description-${index}`}
            value={description}
            onChange={(e) => onDescriptionChange(index, e.target.value)}
            placeholder="Descreva as características desta versão..."
            required
          />
        </div>

        <div>
          <Label htmlFor={`version-audio-${index}`}>Link do Google Drive</Label>
          <Input
            id={`version-audio-${index}`}
            value={audioUrl}
            onChange={(e) => onAudioUrlChange(index, e.target.value)}
            placeholder="https://drive.google.com/file/d/..."
            required
          />
          {audioUrl && (
            <div className="mt-2">
              <LimitedAudioPlayer
                audioSrc={audioUrl}
                previewDuration={30}
                title={title}
                subtitle="Prévia de 30 segundos"
              />
            </div>
          )}
          <p className="text-sm text-gray-500 mt-1">
            Compartilhe o link do Google Drive como "Qualquer pessoa com o link pode visualizar"
          </p>
        </div>
      </div>
    </Card>
  );
};

export default PreviewVersionInput;
