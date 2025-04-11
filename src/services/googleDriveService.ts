
// Constants for storage folder structure
export const STORAGE_FOLDERS = {
  PREVIEWS_BASE: "1lLw3oBgNhlpUiYbo3wevgUvjA0RTV7tN", // ID da pasta principal de prévias
};

// Webhook URL management
export const manageWebhookUrls = {
  getAll: (): Record<string, string> => {
    const webhookUrls: Record<string, string> = {};
    
    // Retrieve all webhook URLs from localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.endsWith('_webhookUrl')) {
        webhookUrls[key.replace('_webhookUrl', '')] = localStorage.getItem(key) || '';
      }
    }
    
    return webhookUrls;
  },
  
  get: (serviceType: string): string => {
    return localStorage.getItem(`${serviceType}_webhookUrl`) || '';
  },
  
  set: (serviceType: string, url: string): void => {
    localStorage.setItem(`${serviceType}_webhookUrl`, url);
    
    // Trigger storage event for other components to update
    window.dispatchEvent(new StorageEvent('storage', {
      key: `${serviceType}_webhookUrl`,
      newValue: url
    }));
  }
};

// Function to get Google Drive folder URL for a specific project
export const getProjectFolderUrl = (projectId: string): string => {
  // In a real implementation, this would map to actual subfolders
  // For now, we'll return the base folder URL
  return `https://drive.google.com/drive/folders/${STORAGE_FOLDERS.PREVIEWS_BASE}`;
};

// Function to get file list from Google Drive
export const getFilesFromDrive = async (projectId: string) => {
  // In a real implementation, this would make API calls to Google Drive
  // For mockup purposes, we'll return sample data
  return [
    {
      id: "sample1",
      name: "Prévia Acústica",
      mimeType: "audio/mp3",
      thumbnail: "",
      previewUrl: "https://drive.google.com/uc?export=download&id=sample1",
    },
    {
      id: "sample2",
      name: "Versão Orquestrada",
      mimeType: "audio/mp3",
      thumbnail: "",
      previewUrl: "https://drive.google.com/uc?export=download&id=sample2",
    }
  ];
};

// Process audio file to create 30-second preview
export const createAudioPreview = async (fileId: string) => {
  // In a real implementation, this would process the audio file to create a 30-second preview
  // For mockup purposes, we'll just return the same file ID with a "_preview" suffix
  return `${fileId}_preview`;
};

export default {
  STORAGE_FOLDERS,
  manageWebhookUrls,
  getProjectFolderUrl,
  getFilesFromDrive,
  createAudioPreview
};
