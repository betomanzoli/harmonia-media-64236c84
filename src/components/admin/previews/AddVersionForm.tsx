
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { VersionItem } from '@/hooks/admin/usePreviewProjects';
import { v4 as uuidv4 } from 'uuid';

export interface AddVersionFormProps {
  projectId: string;
  onAddVersion: (version: VersionItem) => void;
  onCancel: () => void;
}

const AddVersionForm: React.FC<AddVersionFormProps> = ({ 
  projectId, 
  onAddVersion,
  onCancel
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [isRecommended, setIsRecommended] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Erro ao adicionar versão",
        description: "O título da versão é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    if (!audioUrl.trim()) {
      toast({
        title: "Erro ao adicionar versão",
        description: "A URL do áudio é obrigatória.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    const newVersion: VersionItem = {
      id: uuidv4(),
      name: name.trim(),
      description: description.trim(),
      audioUrl: audioUrl.trim(),
      dateAdded: new Date().toLocaleDateString('pt-BR'),
      recommended: isRecommended
    };

    // In a real implementation, you might upload the file first
    setTimeout(() => {
      setIsLoading(false);
      onAddVersion(newVersion);
      toast({
        title: "Versão adicionada",
        description: "A nova versão foi adicionada com sucesso ao projeto."
      });
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="version-name">Nome da Versão</Label>
          <Input
            id="version-name"
            placeholder="Ex: Versão Acústica"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="audio-url">URL do Áudio</Label>
          <Input
            id="audio-url"
            placeholder="https://drive.google.com/file/..."
            value={audioUrl}
            onChange={(e) => setAudioUrl(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="description">Descrição da Versão</Label>
        <Textarea
          id="description"
          placeholder="Descreva os detalhes desta versão..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="recommended" 
          checked={isRecommended}
          onCheckedChange={(checked) => setIsRecommended(!!checked)} 
        />
        <Label htmlFor="recommended">
          Marcar como versão recomendada
        </Label>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Adicionando..." : "Adicionar Versão"}
        </Button>
      </div>
    </form>
  );
};

export default AddVersionForm;
