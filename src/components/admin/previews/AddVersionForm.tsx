
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { VersionItem } from '@/hooks/admin/usePreviewProjects';

export interface AddVersionFormProps {
  projectId: string;
  onAddVersion: (newVersion: VersionItem) => void;
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
  const [recommended, setRecommended] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !audioUrl) return;
    
    setIsSubmitting(true);
    
    // Create new version object
    const newVersion: VersionItem = {
      id: `v${Date.now()}`,
      name,
      description,
      audioUrl,
      recommended,
      dateAdded: new Date().toLocaleDateString('pt-BR')
    };
    
    // Call the add version function
    onAddVersion(newVersion);
    
    // Reset form
    setName('');
    setDescription('');
    setAudioUrl('');
    setRecommended(false);
    setIsSubmitting(false);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome da Versão</Label>
        <Input
          id="name"
          placeholder="Ex: Versão Piano Solo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descrição (opcional)</Label>
        <Textarea
          id="description"
          placeholder="Descreva os detalhes desta versão"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="audioUrl">URL do Google Drive</Label>
        <Input
          id="audioUrl"
          placeholder="URL do arquivo de áudio no Google Drive"
          value={audioUrl}
          onChange={(e) => setAudioUrl(e.target.value)}
          required
        />
        <p className="text-xs text-muted-foreground">
          Cole a URL de compartilhamento do arquivo no Google Drive
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="recommended"
          checked={recommended}
          onCheckedChange={setRecommended}
        />
        <Label htmlFor="recommended">Marcar como versão recomendada</Label>
      </div>
      
      <div className="flex justify-end space-x-2 pt-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button 
          type="submit"
          disabled={isSubmitting || !name || !audioUrl}
        >
          {isSubmitting ? 'Adicionando...' : 'Adicionar Versão'}
        </Button>
      </div>
    </form>
  );
};

export default AddVersionForm;
