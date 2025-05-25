
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import contractAcceptanceLogger from '@/services/contractAcceptanceLogger';

export const useServiceTerms = () => {
  const [acceptedTerms, setAcceptedTerms] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  const acceptTerms = async (packageType: string, clientData?: any) => {
    try {
      if (clientData) {
        await contractAcceptanceLogger.logAcceptance({
          client_name: clientData.name || 'Unknown',
          client_email: clientData.email || 'unknown@email.com',
          package_type: packageType,
          accepted_at: new Date().toISOString(),
          ip_address: 'unknown',
          user_agent: navigator.userAgent,
          terms_version: '1.0'
        });
      }

      setAcceptedTerms(prev => ({
        ...prev,
        [packageType]: true
      }));

      toast({
        title: "Termos aceitos",
        description: "Você aceitou os termos e condições do serviço."
      });

      return true;
    } catch (error) {
      console.error('Error accepting terms:', error);
      toast({
        title: "Erro",
        description: "Não foi possível registrar a aceitação dos termos.",
        variant: "destructive"
      });
      return false;
    }
  };

  const isTermsAccepted = (packageType: string): boolean => {
    return acceptedTerms[packageType] || false;
  };

  return {
    acceptTerms,
    isTermsAccepted,
    acceptedTerms
  };
};
