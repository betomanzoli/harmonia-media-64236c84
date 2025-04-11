
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Upload, Music, FolderOpen } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useGoogleDriveAudio } from '@/hooks/audio/useGoogleDriveAudio';
import { getProjectFolderUrl } from '@/services/googleDriveService';

interface AddVersionFormProps {
  projectId: string;
  onAddComplete: (versionName: string) => void;
}

interface FormValues {
  versionName: string;
  description: string;
  audioSource: string;
  audioFileId: string;
  isRecommended: boolean;
  category: string;
}

const AddVersionForm: React.FC<AddVersionFormProps> = ({ projectId, onAddComplete }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showDriveSelector, setShowDriveSelector] = useState(false);
  const { audioFiles, isLoading } = useGoogleDriveAudio(projectId);
  const [selectedDriveFile, setSelectedDriveFile] = useState<string | null>(null);
  
  const form = useForm<FormValues>({
    defaultValues: {
      versionName: '',
      description: '',
      audioSource: 'upload',
      audioFileId: '',
      isRecommended: false,
      category: 'instrumental'
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const selectDriveFile = (fileId: string, fileName: string) => {
    setSelectedDriveFile(fileId);
    form.setValue('audioFileId', fileId);
    
    // Se não houver nome da versão definido, usar o nome do arquivo
    if (!form.getValues('versionName')) {
      form.setValue('versionName', fileName);
    }
    
    setShowDriveSelector(false);
  };

  const openGoogleDriveFolder = () => {
    const folderUrl = getProjectFolderUrl(projectId);
    window.open(folderUrl, '_blank');
  };

  const onSubmit = async (data: FormValues) => {
    if (data.audioSource === 'upload' && !selectedFile) {
      return;
    }
    
    if (data.audioSource === 'drive' && !selectedDriveFile) {
      return;
    }
    
    setIsUploading(true);
    
    // Simulação de upload ou processamento
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Em produção, aqui seria feito o upload ou processamento do arquivo
    console.log('Dados da versão a ser adicionada:', {
      projectId,
      versionName: data.versionName,
      description: data.description,
      isRecommended: data.isRecommended,
      category: data.category,
      audioSource: data.audioSource,
      fileName: selectedFile?.name || data.audioFileId,
      fileSize: selectedFile?.size || 'N/A'
    });
    
    // Simulação de criação da prévia de 30 segundos
    console.log('Criando prévia de 30 segundos...');
    
    setIsUploading(false);
    onAddComplete(data.versionName);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="versionName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da versão</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ex: Versão Acústica" 
                  {...field} 
                  required
                />
              </FormControl>
              <FormDescription>
                Um nome descritivo para identificar a versão
              </FormDescription>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="piano">Piano</SelectItem>
                  <SelectItem value="cordas">Cordas</SelectItem>
                  <SelectItem value="orquestra">Orquestra</SelectItem>
                  <SelectItem value="instrumental">Instrumental</SelectItem>
                  <SelectItem value="eletronica">Eletrônica</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                A categoria ajuda a organizar as prévias para o cliente
              </FormDescription>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição da versão</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva as características desta versão..." 
                  className="min-h-[120px]" 
                  {...field}
                  required
                />
              </FormControl>
              <FormDescription>
                Uma descrição clara ajuda o cliente a entender as diferenças entre as versões
              </FormDescription>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="audioSource"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fonte do áudio</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  if (value === "drive") {
                    setSelectedFile(null);
                  } else {
                    setSelectedDriveFile(null);
                    form.setValue('audioFileId', '');
                  }
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a fonte do áudio" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="upload">Upload de arquivo local</SelectItem>
                  <SelectItem value="drive">Selecionar do Google Drive</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Escolha de onde virá o arquivo de áudio
              </FormDescription>
            </FormItem>
          )}
        />
        
        {form.watch('audioSource') === 'upload' && (
          <div className="space-y-2">
            <FormLabel>Arquivo de áudio</FormLabel>
            <div className="border-2 border-dashed rounded-md p-6 text-center bg-gray-50">
              <Input
                type="file"
                id="audio-file"
                accept="audio/*"
                onChange={handleFileChange}
                className="hidden"
                required
              />
              
              {!selectedFile ? (
                <div className="cursor-pointer" onClick={() => document.getElementById('audio-file')?.click()}>
                  <Music className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 mb-1">Clique para selecionar o arquivo de áudio</p>
                  <p className="text-xs text-gray-400">MP3, WAV ou AIFF (máx. 20MB)</p>
                  <p className="text-xs text-harmonia-green mt-2">Uma prévia de 30 segundos será gerada automaticamente</p>
                </div>
              ) : (
                <div>
                  <div className="bg-green-50 text-green-700 rounded-md p-2 mb-2 inline-flex items-center">
                    <Music className="h-4 w-4 mr-2" />
                    {selectedFile.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </div>
                  <p className="text-xs text-harmonia-green mt-2">Uma prévia de 30 segundos será gerada automaticamente</p>
                  <button 
                    type="button" 
                    onClick={() => {
                      setSelectedFile(null);
                    }}
                    className="text-xs text-red-500 mt-2 hover:underline"
                  >
                    Remover arquivo
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        
        {form.watch('audioSource') === 'drive' && (
          <div className="space-y-2">
            <FormLabel>Arquivo do Google Drive</FormLabel>
            <div className="border-2 rounded-md p-4 bg-gray-50">
              {selectedDriveFile ? (
                <div className="flex flex-col items-center">
                  <div className="bg-blue-50 text-blue-700 rounded-md p-2 mb-2 inline-flex items-center">
                    <Music className="h-4 w-4 mr-2" />
                    {audioFiles.find(file => file.id === selectedDriveFile)?.name || 'Arquivo selecionado'}
                  </div>
                  <p className="text-xs text-harmonia-green mt-2">Uma prévia de 30 segundos será gerada automaticamente</p>
                  <button 
                    type="button" 
                    onClick={() => {
                      setSelectedDriveFile(null);
                      form.setValue('audioFileId', '');
                    }}
                    className="text-xs text-red-500 mt-2 hover:underline"
                  >
                    Remover seleção
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowDriveSelector(true)}
                    className="mb-2"
                  >
                    <Music className="h-4 w-4 mr-2" />
                    Selecionar arquivo do Google Drive
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={openGoogleDriveFolder}
                    className="text-xs"
                  >
                    <FolderOpen className="h-3 w-3 mr-1" />
                    Abrir pasta no Google Drive
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
        
        <FormField
          control={form.control}
          name="isRecommended"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Recomendar esta versão</FormLabel>
                <FormDescription>
                  Marcar como a versão recomendada para o cliente
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-3 pt-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onAddComplete('')}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={isUploading || 
              (form.watch('audioSource') === 'upload' && !selectedFile) || 
              (form.watch('audioSource') === 'drive' && !selectedDriveFile)}
          >
            {isUploading ? (
              <>
                <span className="animate-spin mr-2">
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </span>
                Enviando...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Adicionar versão
              </>
            )}
          </Button>
        </div>
      </form>
      
      {/* Dialog para seleção de arquivos do Google Drive */}
      <Dialog open={showDriveSelector} onOpenChange={setShowDriveSelector}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Selecionar arquivo do Google Drive</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={openGoogleDriveFolder}
              >
                <FolderOpen className="h-4 w-4 mr-2" />
                Abrir pasta no Google Drive
              </Button>
            </div>
            
            {isLoading ? (
              <div className="p-8 text-center">
                <p>Carregando arquivos...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto">
                {audioFiles.map((file) => (
                  <div 
                    key={file.id} 
                    className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50"
                    onClick={() => selectDriveFile(file.id, file.name)}
                  >
                    <Music className="h-5 w-5 text-gray-500 mr-3" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-gray-500">{file.category || 'Sem categoria'}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      Selecionar
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Form>
  );
};

export default AddVersionForm;
