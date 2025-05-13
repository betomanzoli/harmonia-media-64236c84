
import { useToast } from '@/hooks/use-toast';

// Define the StorageType type
export type StorageType = 
  | 'briefings'
  | 'audio'
  | 'portfolio'
  | 'orders'
  | 'customers'
  | 'previews'
  | 'integrations'
  | 'invoices'
  | 'final_versions';

// Define folder map with folder IDs
export const STORAGE_FOLDER_MAP: Record<StorageType, string> = {
  briefings: 'briefings_folder_id',
  audio: 'audio_folder_id',
  portfolio: 'portfolio_folder_id',
  orders: 'orders_folder_id',
  customers: 'customers_folder_id',
  previews: 'previews_folder_id',
  integrations: 'integrations_folder_id',
  invoices: 'invoices_folder_id',
  final_versions: 'final_versions_folder_id'
};

export const syncStorageData = async (
  storageType: string, 
  data: any, 
  fileName?: string
): Promise<{ success: boolean, fileUrl?: string, fileId?: string }> => {
  try {
    console.log(`Syncing ${storageType} data:`, data);
    
    // Mock implementation - in real app, this would use the Google Drive API
    const mockFileId = `file_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    const mockUrl = `https://drive.google.com/file/d/${mockFileId}/view`;
    
    // Simulate successful storage operation
    console.log(`Data synced successfully to ${storageType}/${fileName || 'data.json'}`);
    
    return {
      success: true,
      fileUrl: mockUrl,
      fileId: mockFileId
    };
  } catch (error) {
    console.error(`Error syncing ${storageType} data:`, error);
    return { success: false };
  }
};

export const STORAGE_FOLDERS = {
  PROJECTS_BASE: 'projects_folder_id',
  MARKETING_ASSETS: 'marketing_assets_folder_id',
  PREVIEWS_BASE: 'previews_folder_id',
  DOWNLOADS_BASE: 'downloads_folder_id',
  INVOICES: 'invoices_folder_id'
};

// Admin Storage Hook
export const useAdminStorage = () => {
  const { toast } = useToast();
  
  // Get folder URL based on storage type
  const getFolderUrl = (storageType: StorageType): string => {
    const folderId = STORAGE_FOLDER_MAP[storageType];
    return googleDriveService.getFolderUrl(folderId);
  };
  
  // Open folder in Google Drive
  const openFolder = (storageType: StorageType): void => {
    const folderUrl = getFolderUrl(storageType);
    window.open(folderUrl, '_blank');
  };
  
  // Upload a file to a specific storage type
  const uploadFile = async (
    storageType: StorageType, 
    file: File, 
    metadata?: Record<string, any>
  ): Promise<{ success: boolean, fileUrl?: string, fileId?: string }> => {
    try {
      const folderId = STORAGE_FOLDER_MAP[storageType];
      
      // Create a FormData object if we're sending this to an actual API
      const formData = new FormData();
      formData.append('file', file);
      
      if (metadata) {
        formData.append('metadata', JSON.stringify(metadata));
      }
      
      // Mock upload implementation
      console.log(`Uploading ${file.name} to folder ${folderId}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a mock file ID
      const fileId = await googleDriveService.uploadFile(folderId, file);
      const fileUrl = googleDriveService.getFileViewUrl(fileId);
      
      toast({
        title: "Upload bem-sucedido",
        description: `${file.name} foi enviado para ${storageType}.`,
      });
      
      return {
        success: true,
        fileUrl,
        fileId
      };
    } catch (error) {
      console.error(`Error uploading file to ${storageType}:`, error);
      
      toast({
        title: "Erro no upload",
        description: "Não foi possível enviar o arquivo. Tente novamente.",
        variant: "destructive",
      });
      
      return { success: false };
    }
  };
  
  // Save storage settings
  const saveStorageSettings = async (
    storageType: StorageType, 
    settings: Record<string, any>
  ): Promise<boolean> => {
    try {
      console.log(`Saving settings for ${storageType}:`, settings);
      
      // Mock implementation
      localStorage.setItem(`${storageType}_settings`, JSON.stringify(settings));
      localStorage.setItem(`${storageType}_lastSync`, new Date().toISOString());
      
      toast({
        title: "Configurações salvas",
        description: `As configurações de ${storageType} foram atualizadas.`,
      });
      
      return true;
    } catch (error) {
      console.error(`Error saving settings for ${storageType}:`, error);
      
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações. Tente novamente.",
        variant: "destructive",
      });
      
      return false;
    }
  };
  
  // Get storage settings
  const getStorageSettings = (storageType: StorageType): Record<string, any> | null => {
    try {
      const settings = localStorage.getItem(`${storageType}_settings`);
      return settings ? JSON.parse(settings) : null;
    } catch (error) {
      console.error(`Error getting settings for ${storageType}:`, error);
      return null;
    }
  };
  
  // Get last sync timestamp
  const getLastSync = (storageType: StorageType): string | null => {
    return localStorage.getItem(`${storageType}_lastSync`);
  };
  
  return {
    getFolderUrl,
    openFolder,
    uploadFile,
    saveStorageSettings,
    getStorageSettings,
    getLastSync
  };
};

export const googleDriveService = {
  // Get folder URL from folder ID
  getFolderUrl: (folderId: string): string => {
    return `https://drive.google.com/drive/folders/${folderId}`;
  },
  
  // Get file view URL from file ID
  getFileViewUrl: (fileId: string): string => {
    return `https://drive.google.com/file/d/${fileId}/view`;
  },
  
  // Get file download URL from file ID
  getFileDownloadUrl: (fileId: string): string => {
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  },
  
  // Mock function to upload a file to Google Drive
  uploadFile: async (folderId: string, file: File): Promise<string> => {
    // In a real implementation, this would use the Google Drive API
    console.log(`Uploading file ${file.name} to folder ${folderId}`);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate a mock file ID
    const fileId = `file_${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    
    console.log(`File uploaded successfully. File ID: ${fileId}`);
    return fileId;
  },
  
  // Mock function to create a project folder in Google Drive
  createProjectFolder: async (projectId: string, projectName: string): Promise<string> => {
    // In a real implementation, this would use the Google Drive API
    console.log(`Creating folder for project ${projectId} - ${projectName}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate a mock folder ID
    const folderId = `folder_${projectId}_${Date.now()}`;
    
    console.log(`Project folder created successfully. Folder ID: ${folderId}`);
    return folderId;
  }
};
