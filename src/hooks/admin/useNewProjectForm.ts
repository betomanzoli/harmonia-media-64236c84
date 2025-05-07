
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export interface Version {
  title: string;
  description: string;
  audioUrl: string;
}

export const useNewProjectForm = () => {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState(''); // Add phone state
  const [packageType, setPackageType] = useState('');
  const [versions, setVersions] = useState<Version[]>([
    { title: '', description: '', audioUrl: '' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const addVersion = () => {
    setVersions([...versions, { title: '', description: '', audioUrl: '' }]);
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

  const updateVersion = (index: number, field: keyof Version, value: string) => {
    const updatedVersions = [...versions];
    updatedVersions[index] = { ...updatedVersions[index], [field]: value };
    setVersions(updatedVersions);
  };

  const resetForm = () => {
    setClientName('');
    setClientEmail('');
    setClientPhone('');
    setPackageType('');
    setVersions([{ title: '', description: '', audioUrl: '' }]);
  };

  return {
    formState: {
      clientName,
      clientEmail,
      clientPhone,
      packageType,
      versions,
      isSubmitting
    },
    setters: {
      setClientName,
      setClientEmail,
      setClientPhone,
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
