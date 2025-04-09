
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAdminStorage, StorageType } from '@/services/adminStorageService';

export interface UploadedFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
}

export function useFileUpload(storageType: StorageType) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const { toast } = useToast();
  const storage = useAdminStorage();

  // Upload a single file
  const uploadFile = async (file: File, metadata?: Record<string, any>): Promise<UploadedFile | null> => {
    if (!file) return null;
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + Math.random() * 20;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 500);
      
      // Upload the file using our storage service
      const result = await storage.uploadFile(storageType, file, metadata);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (result.success && result.fileUrl && result.fileId) {
        const uploadedFile: UploadedFile = {
          id: result.fileId,
          name: file.name,
          url: result.fileUrl,
          type: file.type,
          size: file.size,
          uploadedAt: new Date().toISOString()
        };
        
        setUploadedFiles(prev => [...prev, uploadedFile]);
        
        toast({
          title: "Upload concluído",
          description: `${file.name} foi enviado com sucesso.`,
        });
        
        return uploadedFile;
      } else {
        throw new Error("Falha ao fazer upload do arquivo");
      }
    } catch (error) {
      console.error("Erro no upload:", error);
      
      toast({
        title: "Erro no upload",
        description: "Não foi possível enviar o arquivo. Tente novamente.",
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  
  // Upload multiple files
  const uploadMultipleFiles = async (files: File[], metadata?: Record<string, any>): Promise<UploadedFile[]> => {
    if (!files.length) return [];
    
    const uploadedResults: UploadedFile[] = [];
    
    try {
      setIsUploading(true);
      
      for (let i = 0; i < files.length; i++) {
        // Update progress based on current file index
        setUploadProgress((i / files.length) * 100);
        
        const result = await uploadFile(files[i], metadata);
        if (result) {
          uploadedResults.push(result);
        }
      }
      
      // If at least some files were uploaded successfully
      if (uploadedResults.length > 0) {
        if (uploadedResults.length === files.length) {
          toast({
            title: "Uploads concluídos",
            description: `${files.length} arquivos foram enviados com sucesso.`,
          });
        } else {
          toast({
            title: "Uploads parcialmente concluídos",
            description: `${uploadedResults.length} de ${files.length} arquivos foram enviados.`,
            variant: "default",
          });
        }
      }
      
      return uploadedResults;
    } catch (error) {
      console.error("Erro no upload múltiplo:", error);
      
      toast({
        title: "Erro nos uploads",
        description: "Alguns arquivos não puderam ser enviados. Tente novamente.",
        variant: "destructive",
      });
      
      return uploadedResults;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  
  // Open the respective Google Drive folder
  const openStorageFolder = () => {
    storage.openFolder(storageType);
  };
  
  // Get the folder URL
  const getFolderUrl = () => {
    return storage.getFolderUrl(storageType);
  };
  
  // Reset state
  const resetUploadState = () => {
    setUploadedFiles([]);
    setIsUploading(false);
    setUploadProgress(0);
  };

  return {
    isUploading,
    uploadProgress,
    uploadedFiles,
    uploadFile,
    uploadMultipleFiles,
    openStorageFolder,
    getFolderUrl,
    resetUploadState
  };
}
