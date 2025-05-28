
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

// Stub para contractAcceptanceLogger removido
const logTermsAcceptance = (data: any) => {
  console.log('Terms acceptance logged:', data);
};

export const useServiceTerms = (title?: string) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isTermsDialogOpen, setIsTermsDialogOpen] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

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

  const handleChoosePackage = () => {
    setIsTermsDialogOpen(true);
  };

  const handleProceedToBriefing = () => {
    if (acceptedTerms) {
      setIsTermsDialogOpen(false);
      navigate('/briefing');
    }
  };

  return {
    acceptTerms,
    termsAccepted,
    isTermsDialogOpen,
    setIsTermsDialogOpen,
    acceptedTerms,
    setAcceptedTerms,
    handleChoosePackage,
    handleProceedToBriefing
  };
};
