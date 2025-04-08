
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import contractAcceptanceLogger from '@/services/contractAcceptanceLogger';
import { PackageId } from '@/lib/payment/packageData';
import { useToast } from '@/hooks/use-toast';

export function useServiceTerms(title: string) {
  const [isTermsDialogOpen, setIsTermsDialogOpen] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Determine o ID do pacote com base no título
  const getPackageId = (): PackageId => {
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
  const handleProceedToBriefing = async () => {
    // Obter o ID do pacote a partir do título
    const packageId = getPackageId();
    
    // Get user data from localStorage if available
    const qualificationData = localStorage.getItem('qualificationData');
    const userData = qualificationData ? JSON.parse(qualificationData) : null;
    
    // Log contract acceptance
    try {
      await contractAcceptanceLogger.logAcceptance({
        packageId,
        customerName: userData?.name || 'Cliente Anônimo',
        customerEmail: userData?.email || 'email@não-fornecido.com',
        acceptanceDate: new Date().toISOString(),
        ipAddress: 'client-side',
        userAgent: navigator.userAgent,
        contractVersion: '1.0',
        source: 'service-card-selection'
      });
      
      toast({
        title: "Contrato aceito",
        description: "Os termos de serviço foram aceitos e registrados."
      });
    } catch (error) {
      console.error('Error logging contract acceptance:', error);
    }
    
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
