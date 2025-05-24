
import { useState } from 'react';

export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const uploadFile = async (file: File): Promise<string> => {
    setIsUploading(true);
    setProgress(0);
    setError(null);
    
    // Mock file upload with progress
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 10;
          if (newProgress >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            resolve(`https://example.com/uploads/${file.name}`);
          }
          return newProgress;
        });
      }, 500);
    });
  };
  
  return {
    uploadFile,
    isUploading,
    progress,
    error
  };
}
