
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export interface Version {
  title: string;
  description: string;
  audioUrl: string;
}

// Package options constant
export const PACKAGE_OPTIONS = [
  { value: 'essential', label: 'Essencial' },
  { value: 'professional', label: 'Profissional' },
  { value: 'premium', label: 'Premium' },
  { value: 'custom', label: 'Personalizado' }
];

export const useNewProjectForm = () => {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [packageType, setPackageType] = useState('');
  const [versions, setVersions] = useState<Version[]>([
    { title: '', description: '', audioUrl: '' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Format phone number as user types
  const formatPhoneNumber = (phone: string): string => {
    // Remove non-numeric characters
    const numericValue = phone.replace(/\D/g, '');
    
    if (numericValue.length <= 2) {
      return numericValue;
    } 
    
    if (numericValue.length <= 7) {
      return `(${numericValue.slice(0, 2)}) ${numericValue.slice(2)}`;
    }
    
    if (numericValue.length <= 11) {
      return `(${numericValue.slice(0, 2)}) ${numericValue.slice(2, 7)}-${numericValue.slice(7)}`;
    }
    
    // Limit to standard Brazilian phone number format
    return `(${numericValue.slice(0, 2)}) ${numericValue.slice(2, 7)}-${numericValue.slice(7, 11)}`;
  };

  // Handler for phone number changes with formatting
  const handlePhoneChange = (value: string) => {
    setClientPhone(formatPhoneNumber(value));
  };

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
      setClientPhone: handlePhoneChange,
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
