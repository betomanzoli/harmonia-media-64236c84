
import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { File, X, Upload, Music, Image, FileVideo, FileText } from "lucide-react";

interface FileUploaderProps {
  referenceFiles: File[];
  setReferenceFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

const FileUploader: React.FC<FileUploaderProps> = ({ referenceFiles, setReferenceFiles }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setReferenceFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setReferenceFiles(prev => prev.filter((_, i) => i !== index));
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Get appropriate icon based on file type
  const getFileIcon = (file: File) => {
    const type = file.type.split('/')[0];
    
    switch (type) {
      case 'audio':
        return <Music className="w-4 h-4 mr-2 text-blue-400" />;
      case 'image':
        return <Image className="w-4 h-4 mr-2 text-green-400" />;
      case 'video':
        return <FileVideo className="w-4 h-4 mr-2 text-purple-400" />;
      case 'application':
        return <FileText className="w-4 h-4 mr-2 text-amber-400" />;
      default:
        return <File className="w-4 h-4 mr-2 text-gray-400" />;
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        className="hidden"
        accept="audio/*,image/*,video/*,application/pdf"
      />
      
      <Button 
        type="button" 
        variant="outline" 
        className="w-full"
        onClick={openFileDialog}
      >
        <Upload className="w-4 h-4 mr-2" /> 
        Anexar arquivos de referência
      </Button>
      
      <div className="text-xs text-gray-400 mt-2">
        Aceita imagens, áudios, vídeos e PDFs. (Tamanho máximo: 10MB por arquivo)
      </div>
      
      {referenceFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium">Arquivos anexados:</p>
          <ul className="space-y-2">
            {referenceFiles.map((file, index) => (
              <li key={index} className="flex items-center justify-between bg-secondary/50 p-2 rounded-md">
                <div className="flex items-center">
                  {getFileIcon(file)}
                  <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                </div>
                <Button 
                  type="button"
                  variant="ghost" 
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
