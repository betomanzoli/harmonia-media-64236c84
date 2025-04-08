import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast";

// Define storage folder structure by service
export const STORAGE_FOLDERS = {
  audio: "https://drive.google.com/drive/folders/1zOKfHNA7rAihCmEVKZtL191k8XgUsXMg",
  portfolio: "https://drive.google.com/drive/folders/1MJk2diD6Bmb9Q6lNVDPnLePAznerOU29",
  orders: "https://drive.google.com/drive/folders/1brm0ombzUSBzGOdPuj4e0phlU9nKbvbs",
  customers: "https://drive.google.com/drive/folders/1fQWdtNPx7pHvMwJfhamtdHBJsdpLkIZZ",
  previews: "https://drive.google.com/drive/folders/1lLw3oBgNhlpUiYbo3wevgUvjA0RTV7tN",
  integrations: "https://drive.google.com/drive/folders/1uuhCHv0c5eePU9_m-0BdYiuo0-3vUwVJ",
  invoices: "https://drive.google.com/drive/folders/1uuhCHv0c5eePU9_m-0BdYiuo0-3vUwVJ",
};

// Function to generate Google Drive file view URL from file ID
export const getGoogleDriveViewUrl = (fileId: string) => {
  return `https://drive.google.com/file/d/${fileId}/view`;
};

// Function to open the Google Drive folder in a new tab
export const openStorageFolder = (serviceType: keyof typeof STORAGE_FOLDERS) => {
  const folderUrl = STORAGE_FOLDERS[serviceType];
  window.open(folderUrl, '_blank');
};

// Function to create a simple JSON representation of data for storing in Drive
export const createJsonBlob = (data: any) => {
  const jsonString = JSON.stringify(data, null, 2);
  return new Blob([jsonString], { type: 'application/json' });
};

// Synchronize data between local storage and Google Drive
export const syncDataWithDrive = async (
  serviceType: keyof typeof STORAGE_FOLDERS,
  localData: any[],
  fileName: string = `${serviceType}_data.json`
) => {
  try {
    // This would typically use the Google Drive API to upload the file
    // For our mock implementation, we'll just log and store locally
    console.log(`Synchronizing ${serviceType} data with Google Drive folder:`, STORAGE_FOLDERS[serviceType]);
    console.log(`Data to synchronize:`, localData);
    
    // Store a timestamp in local storage to track last sync
    localStorage.setItem(`${serviceType}_lastSync`, new Date().toISOString());
    
    // For demo purposes, store the data in localStorage as a backup
    localStorage.setItem(`${serviceType}_data`, JSON.stringify(localData));
    
    return {
      success: true,
      message: `${serviceType} data synchronized successfully`,
      timestamp: new Date().toISOString(),
      fileUrl: `${STORAGE_FOLDERS[serviceType]}/${fileName}`
    };
  } catch (error) {
    console.error(`Error synchronizing ${serviceType} data:`, error);
    return {
      success: false,
      message: `Failed to synchronize ${serviceType} data`,
      error
    };
  }
};

// Helper for keeping track of webhook URLs across different services
export const manageWebhookUrls = {
  save: (serviceType: string, url: string) => {
    localStorage.setItem(`${serviceType}_webhookUrl`, url);
    return true;
  },
  get: (serviceType: string) => {
    return localStorage.getItem(`${serviceType}_webhookUrl`) || '';
  },
  getAll: () => {
    const webhooks: Record<string, string> = {};
    Object.keys(STORAGE_FOLDERS).forEach(key => {
      const url = localStorage.getItem(`${key}_webhookUrl`) || '';
      if (url) {
        webhooks[key] = url;
      }
    });
    return webhooks;
  }
};

// Export a custom hook for working with Google Drive storage
export function useGoogleDriveStorage(serviceType: keyof typeof STORAGE_FOLDERS) {
  const { toast } = useToast();

  const saveData = async (data: any) => {
    const result = await syncDataWithDrive(serviceType, data);
    if (result.success) {
      toast({
        title: "Dados sincronizados",
        description: `Os dados foram salvos com sucesso no Google Drive.`,
      });
    } else {
      toast({
        title: "Erro na sincronização",
        description: "Não foi possível salvar os dados no Google Drive.",
        variant: "destructive",
      });
    }
    return result;
  };
  
  return {
    folderUrl: STORAGE_FOLDERS[serviceType],
    openFolder: () => openStorageFolder(serviceType),
    saveData,
    getWebhookUrl: () => manageWebhookUrls.get(serviceType),
    saveWebhookUrl: (url: string) => manageWebhookUrls.save(serviceType, url),
    getAllWebhookUrls: manageWebhookUrls.getAll
  };
}
