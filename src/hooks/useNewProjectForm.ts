
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { PhoneWithCountryCode, ExtraService } from '@/types/project.types';

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

// Default extra services
export const DEFAULT_EXTRA_SERVICES: ExtraService[] = [
  { 
    id: 'stems', 
    name: 'Stems (Separação de Instrumentos)', 
    description: 'Receba os instrumentos separados da sua música',
    price: 150,
    selected: false
  },
  { 
    id: 'rush', 
    name: 'Entrega Prioritária', 
    description: 'Receba seu projeto com prioridade máxima',
    price: 200,
    selected: false
  },
  { 
    id: 'commercial', 
    name: 'Licença Comercial', 
    description: 'Permissão para uso comercial da música',
    price: 300,
    selected: false
  }
];

export const useNewProjectForm = () => {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState<PhoneWithCountryCode>({
    code: '+55',
    number: '',
    fullNumber: '+55 ',
    countryCode: '+55',
    nationalNumber: ''
  });
  const [packageType, setPackageType] = useState('');
  const [versions, setVersions] = useState<Version[]>([
    { title: '', description: '', audioUrl: '' }
  ]);
  const [extras, setExtras] = useState<ExtraService[]>(DEFAULT_EXTRA_SERVICES);
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
    setClientPhone({
      code: '+55',
      number: '',
      fullNumber: '+55 ',
      countryCode: '+55',
      nationalNumber: ''
    });
    setPackageType('');
    setVersions([{ title: '', description: '', audioUrl: '' }]);
    setExtras(DEFAULT_EXTRA_SERVICES); // Reset extras to defaults
  };

  return {
    formState: {
      clientName,
      clientEmail,
      clientPhone,
      packageType,
      versions,
      extras,
      isSubmitting
    },
    setters: {
      setClientName,
      setClientEmail,
      setClientPhone,
      setPackageType,
      setExtras,
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
