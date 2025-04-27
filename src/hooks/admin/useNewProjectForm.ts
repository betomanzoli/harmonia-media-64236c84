
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export interface Version {
  title: string;
  description: string;
  audioUrl: string;
  recommended: boolean;
}

export const useNewProjectForm = () => {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [packageType, setPackageType] = useState('');
  const [versions, setVersions] = useState<Version[]>([
    { title: '', description: '', audioUrl: '', recommended: true }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const addVersion = () => {
    setVersions([...versions, { title: '', description: '', audioUrl: '', recommended: false }]);
  };

  const removeVersion = (index: number) => {
    if (versions.length > 1) {
      setVersions(versions.filter((_, i) => i !== index));
    } else {
      toast({
        title: "Não é possível remover",
        description: "O projeto precisa ter pelo menos uma versão.",
        variant: "destructive"
      });
    }
  };

  const updateVersion = (index: number, field: keyof Version, value: string | boolean) => {
    const updatedVersions = [...versions];
    updatedVersions[index] = { ...updatedVersions[index], [field]: value };
    
    if (field === 'recommended' && value === true) {
      updatedVersions.forEach((v, i) => {
        if (i !== index) v.recommended = false;
      });
    }
    
    setVersions(updatedVersions);
  };

  const resetForm = () => {
    setClientName('');
    setClientEmail('');
    setPackageType('');
    setVersions([{ title: '', description: '', audioUrl: '', recommended: true }]);
  };

  return {
    formState: {
      clientName,
      clientEmail,
      packageType,
      versions,
      isSubmitting
    },
    setters: {
      setClientName,
      setClientEmail,
      setPackageType,
      setIsSubmitting
    },
    actions: {
      addVersion,
      removeVersion,
      updateVersion,
      resetForm
    }
  };
};
