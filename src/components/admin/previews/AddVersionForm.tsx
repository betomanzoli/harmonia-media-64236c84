
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Upload, Music } from 'lucide-react';

interface AddVersionFormProps {
  projectId: string;
  onAddComplete: (versionName: string) => void;
}

interface FormValues {
  versionName: string;
  description: string;
  audioFile: FileList;
  isRecommended: boolean;
}

const AddVersionForm: React.FC<AddVersionFormProps> = ({ projectId, onAddComplete }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const form = useForm<FormValues>({
    defaultValues: {
      versionName: '',
      description: '',
      isRecommended: false
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      form.setValue('audioFile', e.target.files);
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (!selectedFile) {
      return;
    }
    
    setIsUploading(true);
    
    // Simulação de upload
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Em produção, aqui seria feito o upload real do arquivo para o servidor
    console.log('Dados da versão a ser adicionada:', {
      projectId,
      versionName: data.versionName,
      description: data.description,
      isRecommended: data.isRecommended,
      fileName: selectedFile.name,
      fileSize: selectedFile.size
    });
    
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
                <button 
                  type="button" 
                  onClick={() => {
                    setSelectedFile(null);
                    form.setValue('audioFile', undefined as any);
                  }}
                  className="text-xs text-red-500 mt-2 hover:underline"
                >
                  Remover arquivo
                </button>
              </div>
            )}
          </div>
        </div>
        
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
            disabled={isUploading || !selectedFile}
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
    </Form>
  );
};

export default AddVersionForm;
