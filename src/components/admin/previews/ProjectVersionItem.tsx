
import React from 'react';
import { X } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from 'lucide-react';

interface VersionItem {
  title: string;
  description: string;
  audioFile: File | null;
}

interface ProjectVersionItemProps {
  version: VersionItem;
  index: number;
  onRemove: (index: number) => void;
  onTitleChange: (index: number, value: string) => void;
  onDescriptionChange: (index: number, value: string) => void;
  onFileChange: (index: number, event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProjectVersionItem: React.FC<ProjectVersionItemProps> = ({
  version,
  index,
  onRemove,
  onTitleChange,
  onDescriptionChange,
  onFileChange
}) => {
  return (
    <Card key={index} className="p-4 border-l-4 border-l-harmonia-green/60">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium">Versão {index + 1}</h4>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm"
          onClick={() => onRemove(index)}
          className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-100/20"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Título da Versão</label>
          <Input
            value={version.title}
            onChange={e => onTitleChange(index, e.target.value)}
            placeholder="Ex: Versão Acústica"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Arquivo de Áudio</label>
          <div className="flex items-center">
            <Input
              type="file"
              accept="audio/*"
              onChange={e => onFileChange(index, e)}
              className="hidden"
              id={`audio-file-${index}`}
              required={!version.audioFile}
            />
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => document.getElementById(`audio-file-${index}`)?.click()}
              className="w-full flex items-center justify-center"
            >
              <Upload className="w-4 h-4 mr-2" />
              {version.audioFile ? version.audioFile.name : "Selecionar Arquivo"}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Descrição da Versão</label>
        <Textarea
          value={version.description}
          onChange={e => onDescriptionChange(index, e.target.value)}
          placeholder="Descreva as características desta versão musical..."
          required
          className="min-h-[120px]"
        />
      </div>
    </Card>
  );
};

export default ProjectVersionItem;
