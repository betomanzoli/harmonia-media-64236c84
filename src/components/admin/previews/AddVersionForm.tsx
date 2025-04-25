
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Music, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePreviewProjects } from '@/hooks/admin/usePreviewProjects';

interface AddVersionFormProps {
  projectId: string;
  onAddComplete: (versionName: string) => void;
}

const AddVersionForm: React.FC<AddVersionFormProps> = ({ projectId, onAddComplete }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isRecommended, setIsRecommended] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const { updateProject } = usePreviewProjects();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };
  
  const handleAddVersion = () => {
    if (!name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe um nome para a versão.",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedFile) {
      toast({
        title: "Arquivo obrigatório",
        description: "Por favor, selecione um arquivo de áudio.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulação de upload de arquivo
    setTimeout(() => {
      const newVersion = {
        id: `v${Date.now()}`,
        name,
        description,
        recommended: isRecommended,
        dateAdded: new Date().toLocaleDateString('pt-BR'),
        fileId: 'demo-file-id',
      };
      
      // Retrieve project and update versions list
      updateProject(projectId, (project) => {
        const versionsList = project.versionsList || [];
        
        // If this is set as recommended, remove recommended from others
        const updatedVersions = isRecommended 
          ? versionsList.map(v => ({ ...v, recommended: false }))
          : [...versionsList];
        
        // Add the new version
        updatedVersions.push(newVersion);
        
        return {
          versions: updatedVersions.length,
          versionsList: updatedVersions
        };
      });
      
      toast({
        title: "Versão adicionada",
        description: `A versão "${name}" foi adicionada com sucesso.`
      });
      
      setIsLoading(false);
      onAddComplete(name);
    }, 1500);
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="version-name">Nome da versão</Label>
        <Input 
          id="version-name"
          placeholder="Ex: Versão Acústica" 
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="version-description">Descrição (opcional)</Label>
        <Textarea 
          id="version-description"
          placeholder="Descreva as características desta versão..." 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="version-file">Arquivo de áudio</Label>
        <div className="border border-dashed rounded-md p-6 text-center">
          {selectedFile ? (
            <div className="space-y-2">
              <Music className="h-8 w-8 mx-auto text-harmonia-green" />
              <p>{selectedFile.name}</p>
              <p className="text-xs text-gray-500">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedFile(null)}
              >
                Selecionar outro arquivo
              </Button>
            </div>
          ) : (
            <label className="cursor-pointer block">
              <div className="space-y-2">
                <Upload className="h-8 w-8 mx-auto text-gray-400" />
                <p>Clique para selecionar ou arraste o arquivo de áudio</p>
                <p className="text-xs text-gray-500">MP3, WAV até 50MB</p>
              </div>
              <Input 
                id="version-file"
                type="file" 
                accept="audio/*"
                className="hidden"
                onChange={handleSelectFile}
              />
            </label>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="recommended" 
          checked={isRecommended}
          onCheckedChange={setIsRecommended}
        />
        <Label htmlFor="recommended">Marcar como versão recomendada</Label>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={() => onAddComplete('')}>Cancelar</Button>
        <Button onClick={handleAddVersion} disabled={isLoading}>
          {isLoading ? "Adicionando..." : "Adicionar Versão"}
        </Button>
      </div>
    </div>
  );
};

export default AddVersionForm;
