
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { DialogFooter } from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';

interface AddVersionFormProps {
  projectId: string; 
  onAddComplete: (versionName: string) => void; 
}

const AddVersionForm: React.FC<AddVersionFormProps> = ({ projectId, onAddComplete }) => {
  const [versionName, setVersionName] = useState('');
  const [description, setDescription] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [isRecommended, setIsRecommended] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!versionName.trim()) {
      toast({
        title: "Erro",
        description: "O nome da versão é obrigatório",
        variant: "destructive"
      });
      return;
    }
    
    if (!audioUrl.trim()) {
      toast({
        title: "Erro",
        description: "A URL do áudio é obrigatória",
        variant: "destructive"
      });
      return;
    }
    
    // Check if the URL is a valid Google Drive link
    const isDriveLink = audioUrl.includes('drive.google.com');
    
    if (!isDriveLink && !audioUrl.match(/^(http|https):\/\/[^ "]+$/)) {
      toast({
        title: "Erro",
        description: "Por favor, insira uma URL válida",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Process Google Drive links to extract file ID if needed
    let processedUrl = audioUrl;
    if (isDriveLink && audioUrl.includes('id=')) {
      const fileIdMatch = audioUrl.match(/id=([^&]+)/);
      if (fileIdMatch && fileIdMatch[1]) {
        processedUrl = `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
      }
    }
    
    // In a production environment, this would be uploaded to storage
    setTimeout(() => {
      // Get the project from localStorage
      const storedProjects = JSON.parse(localStorage.getItem('harmonIA_preview_projects') || '[]');
      const projectIndex = storedProjects.findIndex((p: any) => p.id === projectId);
      
      if (projectIndex !== -1) {
        const project = storedProjects[projectIndex];
        
        // Create new version object
        const newVersion = {
          id: `v${project.versions + 1}`,
          name: versionName,
          description: description,
          audioUrl: processedUrl,
          dateAdded: new Date().toLocaleDateString('pt-BR'),
          recommended: isRecommended
        };
        
        // Add the version to the project's versionsList or create it if it doesn't exist
        if (!project.versionsList) {
          project.versionsList = [newVersion];
        } else {
          // If this is marked as recommended, remove recommended from others
          if (isRecommended) {
            project.versionsList = project.versionsList.map((v: any) => ({
              ...v,
              recommended: false
            }));
          }
          
          project.versionsList.push(newVersion);
        }
        
        // Increment the versions count
        project.versions = (project.versionsList || []).length;
        
        // Update the project in localStorage
        storedProjects[projectIndex] = project;
        localStorage.setItem('harmonIA_preview_projects', JSON.stringify(storedProjects));
        
        // Call the callback
        onAddComplete(versionName);
      } else {
        toast({
          title: "Erro",
          description: "Projeto não encontrado",
          variant: "destructive"
        });
      }
      
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="version-name">Nome da Versão</Label>
        <Input 
          id="version-name"
          value={versionName}
          onChange={(e) => setVersionName(e.target.value)}
          placeholder="Ex: Versão Acústica"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea 
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descreva esta versão da música..."
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="audio-url">URL do Áudio (Google Drive ou outra fonte)</Label>
        <Input 
          id="audio-url"
          value={audioUrl}
          onChange={(e) => setAudioUrl(e.target.value)}
          placeholder="https://drive.google.com/file/d/..."
          required
        />
        <p className="text-xs text-gray-500">
          Cole o link de compartilhamento do Google Drive ou outra fonte de áudio online.
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="recommended"
          checked={isRecommended}
          onCheckedChange={setIsRecommended}
        />
        <Label htmlFor="recommended">Marcar como versão recomendada</Label>
      </div>
      
      <DialogFooter>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adicionando..." : "Adicionar Versão"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default AddVersionForm;
