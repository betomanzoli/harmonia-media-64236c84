
// Storage folders no Google Drive
export const STORAGE_FOLDERS = {
  PROJECTS_BASE: '1D3_GsH5dC8W7mnPDEiep',
  PREVIEWS_BASE: '1H62ylCwQYJ23BLpygtvN',
  DOWNLOADS_BASE: '11c6JahRd5Lx0iKCL_gH',
  MARKETING_ASSETS: '1fCsWubN8pXwM-mRlDtn',
};

class GoogleDriveService {
  getFileViewUrl(fileId: string): string {
    return `https://drive.google.com/file/d/${fileId}/view`;
  }
  
  getFileDownloadUrl(fileId: string): string {
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }
  
  getFileStreamUrl(fileId: string): string {
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }
  
  getFolderUrl(folderId: string): string {
    return `https://drive.google.com/drive/folders/${folderId}`;
  }
  
  createProjectFolder(projectId: string, clientName: string): Promise<string> {
    // Em uma implementação real, isso criaria uma pasta no Google Drive
    // Simulação para demo
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockFolderId = `folder_${projectId}_${Date.now()}`;
        console.log(`[GoogleDrive] Pasta criada para ${projectId} - ${clientName}: ${mockFolderId}`);
        resolve(mockFolderId);
      }, 1000);
    });
  }
  
  uploadFile(folderId: string, file: File): Promise<string> {
    // Em uma implementação real, isso faria upload do arquivo
    // Simulação para demo
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockFileId = `file_${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
        console.log(`[GoogleDrive] Arquivo ${file.name} enviado para pasta ${folderId}: ${mockFileId}`);
        resolve(mockFileId);
      }, 2000);
    });
  }
}

export const googleDriveService = new GoogleDriveService();
