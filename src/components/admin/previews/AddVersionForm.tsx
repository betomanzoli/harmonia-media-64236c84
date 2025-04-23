
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
import { useGoogleDriveAudio } from '@/hooks/audio/useGoogleDriveAudio';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddVersionFormProps {
  projectId: string;
  onAddComplete: (versionName: string) => void;
}

const AddVersionForm: React.FC<AddVersionFormProps> = ({ projectId, onAddComplete }) => {
  const [versionName, setVersionName] = useState('');
  const [description, setDescription] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [selectedDriveFileId, setSelectedDriveFileId] = useState<string>('');
  const [isRecommended, setIsRecommended] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'upload' | 'drive'>('drive');
  const { toast } = useToast();
  const { getProjectById, updateProject } = usePreviewProjects();
  const { audioFiles, isLoading: audioFilesLoading } = useGoogleDriveAudio();

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
    
    if (!versionName || !description || (uploadMethod === 'upload' && !audioFile) || (uploadMethod === 'drive' && !selectedDriveFileId)) {
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
      
      // Determinar o fileId (do Google Drive ou simulado)
      let fileId = '';
      let fileName = '';
      let fileSize = 0;
      let fileType = '';
      
      if (uploadMethod === 'drive') {
        // Use the selected Google Drive file
        fileId = selectedDriveFileId;
        
        // Get file details from audioFiles
        const fileDetails = audioFiles.find(file => file.id === selectedDriveFileId);
        if (fileDetails) {
          fileName = fileDetails.name;
          // These would be approximations or defaults since we don't have the actual values
          fileSize = 1024 * 1024; // 1MB placeholder
          fileType = 'audio/mp3'; // Default type
        }
      } else if (audioFile) {
        // Simulate upload - in a real implementation, we'd upload to Google Drive
        // and get back the fileId, but here we'll just pretend
        fileId = `simulated-${Date.now()}`;
        fileName = audioFile.name;
        fileSize = audioFile.size;
        fileType = audioFile.type;
        
        console.log('Simulating upload of file:', audioFile.name);
        
        // Simulando um tempo de processamento
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
      // Gerar URL de prévia baseada no Google Drive
      const previewUrl = `/preview/${projectId}`;
      
      // Criar nova versão
      const now = new Date();
      const newVersion = {
        id: `v${(project.versions || 0) + 1}`,
        name: versionName,
        description: description,
        url: previewUrl,
        fileId: fileId, // Important! Store the file ID
        fileName: fileName,
        fileSize: fileSize,
        fileType: fileType,
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
        data: { versionName, description, isRecommended, fileId }
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
        
        <div className="space-y-3">
          <Label>Método de adição do áudio</Label>
          <div className="flex gap-4">
            <Button
              type="button"
              variant={uploadMethod === 'drive' ? "default" : "outline"}
              className={uploadMethod === 'drive' ? "bg-harmonia-green hover:bg-harmonia-green/90" : ""}
              onClick={() => setUploadMethod('drive')}
            >
              Selecionar do Google Drive
            </Button>
            <Button
              type="button"
              variant={uploadMethod === 'upload' ? "default" : "outline"}
              className={uploadMethod === 'upload' ? "bg-harmonia-green hover:bg-harmonia-green/90" : ""}
              onClick={() => setUploadMethod('upload')}
            >
              Fazer upload de arquivo
            </Button>
          </div>
        </div>
        
        {uploadMethod === 'drive' ? (
          <div className="space-y-2">
            <Label htmlFor="drive-file">Arquivo do Google Drive</Label>
            {audioFilesLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Carregando arquivos disponíveis...</span>
              </div>
            ) : (
              <Select
                value={selectedDriveFileId}
                onValueChange={setSelectedDriveFileId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um arquivo de áudio" />
                </SelectTrigger>
                <SelectContent>
                  {audioFiles.map(file => (
                    <SelectItem key={file.id} value={file.id}>
                      {file.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        ) : (
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
        )}
        
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
