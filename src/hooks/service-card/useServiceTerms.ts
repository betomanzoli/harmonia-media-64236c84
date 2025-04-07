
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useServiceTerms = (title: string) => {
  const [isTermsDialogOpen, setIsTermsDialogOpen] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { toast } = useToast();
  
  const handleChoosePackage = useCallback(() => {
    // Open terms dialog first
    setIsTermsDialogOpen(true);
  }, []);
  
  const handleProceedToBriefing = useCallback(() => {
    setIsTermsDialogOpen(false);
    
    // Scroll to the briefing form
    const briefingSection = document.getElementById('briefing');
    if (briefingSection) {
      briefingSection.scrollIntoView({ behavior: 'smooth' });
      
      toast({
        title: `Pacote ${title} selecionado!`,
        description: "Preencha o formulário de briefing para continuar.",
      });
    }
  }, [title, toast]);
  
  return {
    isTermsDialogOpen,
    setIsTermsDialogOpen,
    acceptedTerms,
    setAcceptedTerms,
    handleChoosePackage,
    handleProceedToBriefing
  };
};
