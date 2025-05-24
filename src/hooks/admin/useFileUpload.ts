
import { useState } from 'react';
import { uploadFile, deleteFile } from '@/services/storageService';

interface UploadOptions {
  path?: string;
  acceptedTypes?: string[];
  maxSizeMB?: number;
}

export function useFileUpload(options: UploadOptions = {}) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const defaultOptions = {
    path: 'uploads',
    acceptedTypes: ['image/*', 'audio/*', 'video/*', 'application/pdf'],
    maxSizeMB: 10
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  const upload = async (file: File) => {
    // Validate file
    if (!validateFile(file, mergedOptions)) {
      return { success: false, error: error };
    }
    
    try {
      setIsUploading(true);
      setProgress(0);
      setError(null);
      
      const result = await uploadFile(file, mergedOptions.path!, (progress) => {
        setProgress(progress);
      });
      
      setProgress(100);
      setIsUploading(false);
      
      return result;
    } catch (err: any) {
      setError(err.message || 'Error uploading file');
      setIsUploading(false);
      return { success: false, error: err };
    }
  };
  
  const remove = async (key: string) => {
    try {
      setError(null);
      return await deleteFile(key);
    } catch (err: any) {
      setError(err.message || 'Error deleting file');
      return { success: false, error: err };
    }
  };
  
  const validateFile = (file: File, options: Required<UploadOptions>): boolean => {
    // Check file type
    const fileType = file.type;
    const isTypeAllowed = options.acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        // Check media type (e.g., image/*)
        const mediaType = type.split('/')[0];
        return fileType.startsWith(`${mediaType}/`);
      }
      return type === fileType;
    });
    
    if (!isTypeAllowed) {
      setError(`File type not allowed. Accepted types: ${options.acceptedTypes.join(', ')}`);
      return false;
    }
    
    // Check file size
    const maxSizeBytes = options.maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`File size exceeds the maximum allowed (${options.maxSizeMB}MB)`);
      return false;
    }
    
    return true;
  };
  
  return {
    upload,
    remove,
    isUploading,
    progress,
    error
  };
}
