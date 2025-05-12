
import { useState } from 'react';
import { toast } from "@/hooks/use-toast";

export interface ProjectVersion {
  title: string;
  description: string;
  audioFile: File | null;
}

interface NewProject {
  clientName: string;
  clientEmail: string;
  packageType: string;
  expirationDays: string;
  versions: ProjectVersion[];
  setClientName: (name: string) => void;
  setClientEmail: (email: string) => void;
  setPackageType: (type: string) => void;
  setExpirationDays: (days: string) => void;
}

export const useNewProjectForm = () => {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [packageType, setPackageType] = useState('Essencial');
  const [expirationDays, setExpirationDays] = useState('7');
  const [versions, setVersions] = useState<ProjectVersion[]>([
    { title: '', description: '', audioFile: null }
  ]);
  
  const [isCreating, setIsCreating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const newProject: NewProject = {
    clientName,
    clientEmail,
    packageType,
    expirationDays,
    versions,
    setClientName,
    setClientEmail,
    setPackageType,
    setExpirationDays
  };
  
  const handleAddVersion = () => {
    setVersions(prev => [
      ...prev,
      { title: '', description: '', audioFile: null }
    ]);
  };
  
  const handleRemoveVersion = (indexToRemove: number) => {
    if (versions.length <= 1) {
      toast({
        title: "Operação não permitida",
        description: "É necessário pelo menos uma versão musical.",
        variant: "destructive"
      });
      return;
    }
    
    setVersions(prev => prev.filter((_, index) => index !== indexToRemove));
  };
  
  const handleVersionChange = (index: number, field: 'title' | 'description', value: string) => {
    const updatedVersions = [...versions];
    updatedVersions[index] = {
      ...updatedVersions[index],
      [field]: value
    };
    
    setVersions(updatedVersions);
  };
  
  const handleFileChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    const updatedVersions = [...versions];
    updatedVersions[index] = {
      ...updatedVersions[index],
      audioFile: file
    };
    
    setVersions(updatedVersions);
  };
  
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    
    // Validação básica
    const hasEmptyFields = versions.some(v => !v.title || !v.description || !v.audioFile);
    
    if (hasEmptyFields) {
      toast({
        title: "Campos incompletos",
        description: "Preencha todos os campos e anexe arquivos de áudio para todas as versões.",
        variant: "destructive"
      });
      setIsCreating(false);
      return;
    }
    
    // Simular upload de arquivos
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      
      // Reset the form
      setClientName('');
      setClientEmail('');
      setPackageType('Essencial');
      setExpirationDays('7');
      setVersions([{ title: '', description: '', audioFile: null }]);
      
      toast({
        title: "Projeto criado com sucesso!",
        description: `O projeto foi criado e o cliente será notificado.`,
      });
      
      setIsCreating(false);
    }, 2000);
  };
  
  return {
    newProject,
    handleCreateProject,
    handleAddVersion,
    handleRemoveVersion,
    handleVersionChange,
    handleFileChange,
    isCreating,
    isUploading,
  };
};
