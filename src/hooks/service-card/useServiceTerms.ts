
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

// Stub para contractAcceptanceLogger removido
const logTermsAcceptance = (data: any) => {
  console.log('Terms acceptance logged:', data);
};

export const useServiceTerms = () => {
  const { toast } = useToast();
  const [termsAccepted, setTermsAccepted] = useState(false);

  const acceptTerms = (serviceData: any) => {
    try {
      logTermsAcceptance(serviceData);
      setTermsAccepted(true);
      
      toast({
        title: "Termos aceitos",
        description: "Termos de serviço aceitos com sucesso!"
      });
      
      return true;
    } catch (error) {
      console.error('Terms acceptance error:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao aceitar os termos.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    acceptTerms,
    termsAccepted
  };
};
