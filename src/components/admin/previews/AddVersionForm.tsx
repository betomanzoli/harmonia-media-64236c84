
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2, Upload } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { usePreviewProjects } from '@/hooks/admin/usePreviewProjects';

interface AddVersionFormProps {
  projectId: string;
  onAddComplete: (versionName: string) => void;
}

const AddVersionForm: React.FC<AddVersionFormProps> = ({ projectId, onAddComplete }) => {
  const [versionName, setVersionName] = useState('');
  const [description, setDescription] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isRecommended, setIsRecommended] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { getProjectById, updateProject } = usePreviewProjects();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Verificar se é um arquivo de áudio
      if (!file.type.startsWith('audio/')) {
        toast({
          title: "Tipo de arquivo inválido",
          description: "Por favor, selecione um arquivo de áudio",
          variant: "destructive"
        });
        return;
      }
      
      // Verificar tamanho (limite de 20MB)
      const maxSize = 20 * 1024 * 1024; // 20MB em bytes
      if (file.size > maxSize) {
        toast({
          title: "Arquivo muito grande",
          description: "O tamanho máximo permitido é 20MB",
          variant: "destructive"
        });
        return;
      }
      
      setAudioFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!versionName || !description || !audioFile) {
      toast({
        title: "Dados incompletos",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Obter projeto atual
      const project = getProjectById(projectId);
      
      if (!project) {
        throw new Error("Projeto não encontrado");
      }
      
      // Em produção, aqui faria upload do arquivo
      // Simulando um upload bem-sucedido
      console.log('Simulando upload do arquivo:', audioFile.name);
      
      // Simulando um tempo de processamento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Gerar URL de prévia (em produção seria a URL real do arquivo)
      const previewUrl = `/previews/${projectId}/${encodeURIComponent(versionName.toLowerCase().replace(/\s+/g, '-'))}`;
      
      // Criar nova versão
      const now = new Date();
      const newVersion = {
        id: `v${(project.versions || 0) + 1}`,
        name: versionName,
        description: description,
        url: previewUrl,
        fileSize: audioFile.size,
        fileType: audioFile.type,
        fileName: audioFile.name,
        dateAdded: now.toLocaleDateString('pt-BR'),
        recommended: isRecommended
      };
      
      // Atualizar projeto com nova versão
      const newVersionsList = project.versionsList ? [...project.versionsList, newVersion] : [newVersion];
      updateProject(projectId, {
        versions: newVersionsList.length,
        versionsList: newVersionsList,
        lastActivityDate: now.toLocaleDateString('pt-BR')
      });
      
      // Adicionar ao histórico
      const historyItem = {
        action: `Versão "${versionName}" adicionada`,
        timestamp: now.toLocaleDateString('pt-BR') + ' ' + now.toLocaleTimeString('pt-BR'),
        data: { versionName, description, isRecommended }
      };
      
      const newHistory = project.history ? [historyItem, ...project.history] : [historyItem];
      updateProject(projectId, { history: newHistory });
      
      toast({
        title: "Versão adicionada com sucesso",
        description: `A versão "${versionName}" foi adicionada ao projeto ${projectId}`
      });
      
      onAddComplete(versionName);
    } catch (error) {
      console.error('Erro ao adicionar versão:', error);
      toast({
        title: "Erro ao adicionar versão",
        description: "Ocorreu um erro ao adicionar a versão. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="version-name">Nome da versão</Label>
          <Input
            id="version-name"
            value={versionName}
            onChange={(e) => setVersionName(e.target.value)}
            placeholder="Ex: Versão Orquestral"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="version-description">Descrição da versão</Label>
          <Textarea
            id="version-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detalhe as características desta versão..."
            rows={4}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="audio-file">Arquivo de áudio</Label>
          <div className="flex items-center gap-2">
            <Input
              id="audio-file"
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              required
              className="flex-1"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Formatos aceitos: MP3, WAV, AAC. Tamanho máximo: 20MB
          </p>
        </div>
        
        <div className="flex items-center space-x-2 pt-2">
          <Checkbox 
            id="is-recommended" 
            checked={isRecommended}
            onCheckedChange={(checked) => setIsRecommended(checked === true)}
          />
          <Label htmlFor="is-recommended" className="font-normal">
            Marcar como versão recomendada para o cliente
          </Label>
        </div>
      </div>
      
      <DialogFooter>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adicionando...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Adicionar versão
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default AddVersionForm;
