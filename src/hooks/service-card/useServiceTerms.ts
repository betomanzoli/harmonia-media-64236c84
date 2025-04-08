
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function useServiceTerms(title: string) {
  const [isTermsDialogOpen, setIsTermsDialogOpen] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const navigate = useNavigate();

  // Determine o ID do pacote com base no título
  const getPackageId = () => {
    if (title.includes('Essencial')) return 'essencial';
    if (title.includes('Profissional')) return 'profissional';
    if (title.includes('Premium')) return 'premium';
    return 'essencial';
  };

  // Abrir o diálogo de termos
  const handleChoosePackage = () => {
    setIsTermsDialogOpen(true);
  };

  // Proceder para o briefing após aceitar os termos
  const handleProceedToBriefing = () => {
    // Obter o ID do pacote a partir do título
    const packageId = getPackageId();
    
    // Armazenar o pacote selecionado no localStorage
    localStorage.setItem('selectedPackage', packageId);
    
    // Redirecionar para a página de pagamento
    navigate(`/pagamento/${packageId}`);
  };

  return {
    isTermsDialogOpen,
    setIsTermsDialogOpen,
    acceptedTerms,
    setAcceptedTerms,
    handleChoosePackage,
    handleProceedToBriefing
  };
}
