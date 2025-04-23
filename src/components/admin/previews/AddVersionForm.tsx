
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from '@/hooks/use-toast';
import { DialogFooter } from "@/components/ui/dialog";
import { usePreviewProjects } from '@/hooks/admin/usePreviewProjects';
import { Upload, FileMusic, Trash } from 'lucide-react';

interface AddVersionFormProps {
  projectId: string;
  onAddComplete: (versionName: string) => void;
}

const AddVersionForm: React.FC<AddVersionFormProps> = ({ projectId, onAddComplete }) => {
  const [versionName, setVersionName] = useState('');
  const [versionDescription, setVersionDescription] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isRecommended, setIsRecommended] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { getProjectById, updateProject } = usePreviewProjects();

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Check if file is audio
      if (!file.type.startsWith('audio/')) {
        toast({
          title: "Formato inválido",
          description: "Por favor, selecione apenas arquivos de áudio.",
          variant: "destructive"
        });
        return;
      }
      
      setAudioFile(file);
    }
  };

  const handleAddVersion = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!versionName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe um nome para a versão.",
        variant: "destructive"
      });
      return;
    }
    
    if (!audioFile) {
      toast({
        title: "Arquivo obrigatório",
        description: "Por favor, selecione um arquivo de áudio.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Get current project
      const project = getProjectById(projectId);
      if (!project) {
        throw new Error("Projeto não encontrado");
      }
      
      // Create file ID for Google Drive (in a real app, this would come from actual upload)
      // This simulates a successful file upload to Google Drive
      const mockFileId = `file-${Math.random().toString(36).substring(2, 15)}`;
      
      // Simulate upload progress
      const simulateProgress = () => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.floor(Math.random() * 20);
          if (progress > 100) progress = 100;
          setUploadProgress(progress);
          
          if (progress === 100) {
            clearInterval(interval);
            finishUpload(mockFileId);
          }
        }, 500);
      };
      
      const finishUpload = (fileId: string) => {
        // Generate version ID
        const versionId = `v${(project.versions + 1).toString().padStart(2, '0')}`;
        
        // Create new version object
        const newVersion = {
          id: versionId,
          name: versionName,
          description: versionDescription,
          fileId: fileId,
          audioUrl: `https://drive.google.com/uc?export=view&id=${fileId}`,
          dateAdded: new Date().toLocaleDateString('pt-BR'),
          recommended: isRecommended
        };
        
        // Update project versions
        const currentVersions = project.versionsList || [];
        const updatedVersions = [...currentVersions, newVersion];
        
        // If this is marked as recommended, remove recommendation from other versions
        if (isRecommended) {
          updatedVersions.forEach(v => {
            if (v.id !== versionId) v.recommended = false;
          });
        }
        
        // Update project in storage
        updateProject(projectId, {
          versions: updatedVersions.length,
          versionsList: updatedVersions,
          lastActivityDate: new Date().toLocaleDateString('pt-BR')
        });
        
        // Reset form
        setVersionName('');
        setVersionDescription('');
        setAudioFile(null);
        setIsRecommended(false);
        setIsUploading(false);
        setUploadProgress(0);
        
        // Call callback
        onAddComplete(versionName);
        
        toast({
          title: "Versão adicionada",
          description: `A versão "${versionName}" foi adicionada com sucesso.`
        });
      };
      
      // Start progress simulation
      simulateProgress();
      
    } catch (error) {
      console.error('Erro ao adicionar versão:', error);
      toast({
        title: "Erro ao adicionar versão",
        description: "Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.",
        variant: "destructive"
      });
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleAddVersion} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="version-name">Nome da versão</Label>
        <Input
          id="version-name"
          value={versionName}
          onChange={(e) => setVersionName(e.target.value)}
          placeholder="Ex: Versão Acústica"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="version-description">Descrição</Label>
        <Textarea
          id="version-description"
          value={versionDescription}
          onChange={(e) => setVersionDescription(e.target.value)}
          placeholder="Descreva as características desta versão..."
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="audio-file">Arquivo de áudio</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="audio-file"
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelection}
            accept="audio/*"
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1"
          >
            {audioFile ? (
              <>
                <FileMusic className="mr-2 h-4 w-4" />
                {audioFile.name}
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Selecionar arquivo de áudio
              </>
            )}
          </Button>
          {audioFile && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setAudioFile(null)}
              className="text-red-500 hover:text-red-600"
            >
              <Trash className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="recommended" 
          checked={isRecommended}
          onCheckedChange={(checked) => setIsRecommended(checked as boolean)}
        />
        <label
          htmlFor="recommended"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Marcar como versão recomendada
        </label>
      </div>
      
      {isUploading && (
        <div className="space-y-2">
          <div className="text-sm text-gray-500">Enviando arquivo...</div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-harmonia-green h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <div className="text-right text-xs text-gray-500">{uploadProgress}%</div>
        </div>
      )}
      
      <DialogFooter>
        <Button 
          type="submit" 
          disabled={isUploading}
          className="bg-harmonia-green hover:bg-harmonia-green/90"
        >
          {isUploading ? 'Enviando...' : 'Adicionar versão'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default AddVersionForm;
