
import { useToast } from '@/hooks/use-toast';
import { STORAGE_FOLDERS, googleDriveService } from '@/services/googleDriveService';

// Define storage types with associated folder IDs
export type StorageType = 'briefings' | 'audio' | 'portfolio' | 'orders' | 
  'customers' | 'previews' | 'integrations' | 'invoices' | 'final_versions';

// Map storage types to folder IDs
export const STORAGE_FOLDER_MAP: Record<StorageType, string> = {
  briefings: STORAGE_FOLDERS.PROJECTS_BASE,
  audio: STORAGE_FOLDERS.PROJECTS_BASE,
  portfolio: STORAGE_FOLDERS.MARKETING_ASSETS,
  orders: STORAGE_FOLDERS.PROJECTS_BASE,
  customers: STORAGE_FOLDERS.PROJECTS_BASE,
  previews: STORAGE_FOLDERS.PREVIEWS_BASE,
  integrations: STORAGE_FOLDERS.PROJECTS_BASE,
  invoices: STORAGE_FOLDERS.INVOICES,
  final_versions: STORAGE_FOLDERS.DOWNLOADS_BASE
};

export class AdminStorageService {
  // Get folder URL for a specific storage type
  getFolderUrl(storageType: StorageType): string {
    const folderId = STORAGE_FOLDER_MAP[storageType];
    return googleDriveService.getFolderUrl(folderId);
  }
  
  // Open folder in new window
  openFolder(storageType: StorageType): void {
    const url = this.getFolderUrl(storageType);
    window.open(url, '_blank');
  }
  
  // Upload file to specific folder
  async uploadFile(
    storageType: StorageType, 
    file: File, 
    metadata?: Record<string, any>
  ): Promise<{ success: boolean, fileUrl?: string, fileId?: string }> {
    try {
      const folderId = STORAGE_FOLDER_MAP[storageType];
      const fileId = await googleDriveService.uploadFile(folderId, file);
      const fileUrl = googleDriveService.getFileViewUrl(fileId);
      
      console.log(`File uploaded to ${storageType} storage: ${fileUrl}`);
      
      return {
        success: true,
        fileUrl,
        fileId
      };
    } catch (error) {
      console.error(`Error uploading file to ${storageType} storage:`, error);
      return {
        success: false
      };
    }
  }
  
  // Create project folder in Google Drive
  async createProjectFolder(projectId: string, clientName: string): Promise<string> {
    try {
      return await googleDriveService.createProjectFolder(projectId, clientName);
    } catch (error) {
      console.error('Error creating project folder:', error);
      throw error;
    }
  }
  
  // Associate uploaded file with project in database
  async associateFileWithProject(
    projectId: string, 
    fileId: string, 
    fileType: 'preview' | 'final' | 'invoice' | 'portfolio',
    title: string
  ): Promise<boolean> {
    // In real implementation, this would save to database
    console.log(`Associating ${fileType} file ${fileId} with project ${projectId}`);
    console.log(`File title: ${title}`);
    
    // Simulate database operation
    return true;
  }
}

// Export a singleton instance
export const useAdminStorage = () => new AdminStorageService();
