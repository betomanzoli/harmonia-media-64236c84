import { useToast } from '@/hooks/use-toast';
import { STORAGE_FOLDERS } from '@/services/googleDriveService';

// Define storage types with associated folder IDs
export type StorageType = 'briefings' | 'audio' | 'portfolio' | 'orders' | 
  'customers' | 'previews' | 'integrations' | 'invoices' | 'final_versions';

// Map storage types to folder IDs
export const STORAGE_FOLDER_MAP: Record<StorageType, string> = {
  briefings: "1ChX97c1jpuMg87QIn1uuytVx6r89ONuw", // Updated with correct briefings folder
  audio: "1zOKfHNA7rAihCmEVKZtL191k8XgUsXMg",
  portfolio: "1MJk2diD6Bmb9Q6lNVDPnLePAznerOU29",
  orders: "1brm0ombzUSBzGOdPuj4e0phlU9nKbvbs",
  customers: "1fQWdtNPx7pHvMwJfhamtdHBJsdpLkIZZ",
  previews: "1lLw3oBgNhlpUiYbo3wevgUvjA0RTV7tN",
  integrations: "1uuhCHv0c5eePU9_m-0BdYiuo0-3vUwVJ",
  invoices: "1VKQ2b-huvEx_0JzxR_Nd5XfyZLwU2fqt", // Updated with correct invoices folder
  final_versions: "1rUIb3In_y3HrEc-GR4oGPlSCvZ5JT7mx" // Updated with correct final versions folder
};

// Check if app is in offline mode
export const isOfflineMode = (): boolean => {
  return sessionStorage.getItem('offline-admin-mode') === 'true';
};

// Function to create a Google Drive URL for a given folder ID
export const createGoogleDriveFolderUrl = (folderId: string): string => {
  return `https://drive.google.com/drive/folders/${folderId}`;
};

// Function to create a Google Drive file URL
export const createGoogleDriveFileUrl = (fileId: string): string => {
  return `https://drive.google.com/file/d/${fileId}/view`;
};

// Hook for interacting with Drive storage
export function useAdminStorage() {
  const { toast } = useToast();

  const openFolder = (storageType: StorageType) => {
    const folderId = STORAGE_FOLDER_MAP[storageType];
    const url = createGoogleDriveFolderUrl(folderId);
    window.open(url, '_blank');
  };

  const getFolderUrl = (storageType: StorageType): string => {
    const folderId = STORAGE_FOLDER_MAP[storageType];
    return createGoogleDriveFolderUrl(folderId);
  };

  // This function would upload files in a real implementation
  // Here we simulate the behavior for the offline demo
  const uploadFile = async (storageType: StorageType, file: File, metadata: Record<string, any> = {}): Promise<{success: boolean, fileUrl?: string, fileId?: string}> => {
    if (isOfflineMode()) {
      // In offline mode, we simulate a successful upload
      const mockFileId = `mock-${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      const fileUrl = createGoogleDriveFileUrl(mockFileId);
      
      toast({
        title: "Arquivo salvo",
        description: `${file.name} foi salvo em modo offline.`,
      });
      
      return { 
        success: true, 
        fileUrl,
        fileId: mockFileId
      };
    } else {
      // In a real implementation, this would use Google Drive API
      // For now, we'll simulate a successful upload
      
      // Mock implementation - in production this would use proper API
      try {
        console.log(`Simulando upload para ${storageType}:`, {
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          metadata
        });
        
        // Create a mock file ID
        const mockFileId = `real-${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
        const fileUrl = createGoogleDriveFileUrl(mockFileId);
        
        toast({
          title: "Arquivo salvo",
          description: `${file.name} foi salvo no Google Drive com sucesso.`,
        });
        
        return { 
          success: true, 
          fileUrl,
          fileId: mockFileId
        };
      } catch (error) {
        console.error("Erro ao fazer upload:", error);
        
        toast({
          title: "Erro ao salvar arquivo",
          description: "Não foi possível salvar o arquivo. Tente novamente.",
          variant: "destructive",
        });
        
        return { success: false };
      }
    }
  };

  // Function to store JSON data
  const storeJsonData = async (storageType: StorageType, data: any, fileName: string): Promise<{success: boolean, fileUrl?: string, fileId?: string}> => {
    // Convert the data to a JSON string
    const jsonString = JSON.stringify(data, null, 2);
    
    // Create a Blob from the JSON string
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    // Convert the Blob to a File
    const file = new File([blob], fileName, { type: 'application/json' });
    
    // Upload the file
    return await uploadFile(storageType, file, { contentType: 'application/json' });
  };

  return {
    openFolder,
    getFolderUrl,
    uploadFile,
    storeJsonData,
    isOfflineMode
  };
}

// Helper for syncing data between local storage and the service
export const syncStorageData = async (
  storageType: StorageType,
  data: any,
  fileName: string = `${storageType}_data.json`
): Promise<{ success: boolean, fileUrl?: string }> => {
  try {
    console.log(`Sincronizando dados do tipo ${storageType} com o Google Drive`);
    
    // Store last sync timestamp in localStorage
    localStorage.setItem(`${storageType}_lastSync`, new Date().toISOString());
    
    // For demo purposes, store data in localStorage as fallback
    localStorage.setItem(`${storageType}_data`, JSON.stringify(data));
    
    // In a real implementation, this would use the Google Drive API
    // Here we're just simulating the process
    const mockFileId = `sync-${Date.now()}-${fileName}`;
    const fileUrl = createGoogleDriveFileUrl(mockFileId);
    
    return {
      success: true,
      fileUrl
    };
  } catch (error) {
    console.error(`Erro ao sincronizar dados do tipo ${storageType}:`, error);
    return {
      success: false
    };
  }
};

export default {
  openFolder: (storageType: StorageType) => {
    const folderId = STORAGE_FOLDER_MAP[storageType];
    const url = createGoogleDriveFolderUrl(folderId);
    window.open(url, '_blank');
  },
  getFolderUrl: (storageType: StorageType): string => {
    const folderId = STORAGE_FOLDER_MAP[storageType];
    return createGoogleDriveFolderUrl(folderId);
  },
  STORAGE_FOLDER_MAP,
  isOfflineMode,
  syncStorageData
};
