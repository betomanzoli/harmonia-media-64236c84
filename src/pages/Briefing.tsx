
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ConversationalBriefing from '@/components/briefing/ConversationalBriefing';
import { briefingStorage, BriefingData } from '@/utils/briefingStorage';
import { useToast } from '@/hooks/use-toast';

const Briefing: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [currentBriefingId, setCurrentBriefingId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Verificar se há um briefing ID existente ou criar novo
    const existingId = searchParams.get('id') || briefingStorage.generateBriefingId();
    setCurrentBriefingId(existingId);
    
    // Atualizar URL se necessário
    if (!searchParams.get('id')) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('id', existingId);
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, [searchParams]);

  const handleBriefingComplete = async (formData: any, selectedPackage: string) => {
    if (!currentBriefingId) return;
    
    setIsLoading(true);
    
    try {
      // Preparar dados do briefing
      const briefingData: Partial<BriefingData> = {
        id: currentBriefingId,
        packageType: selectedPackage as 'essencial' | 'profissional' | 'premium',
        clientName: formData.name || '',
        email: formData.email || '',
        phone: formData.phone || '',
        company: formData.company || '',
        projectDescription: formData.projectDescription || '',
        budget: formData.budget || '',
        timeline: formData.timeline || '',
        musicStyle: formData.musicStyle || '',
        emotionalTone: formData.emotionalTone || '',
        references: formData.references || [],
        additionalInfo: formData.additionalInfo || '',
        createdAt: new Date().toISOString(),
        contractAccepted: false,
        paymentStatus: 'pending'
      };

      // Salvar dados localmente
      briefingStorage.saveBriefingData(currentBriefingId, briefingData);

      toast({
        title: "Briefing salvo",
        description: "Suas informações foram salvas. Redirecionando para o contrato...",
      });

      // Redirecionar para página de contrato específica
      navigate(`/contract/${selectedPackage}?briefing=${currentBriefingId}`);
      
    } catch (error) {
      console.error('Erro ao salvar briefing:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar briefing. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20">
        <ConversationalBriefing 
          onComplete={handleBriefingComplete}
          briefingId={currentBriefingId}
        />
      </main>
      <Footer />
    </div>
  );
};

export default Briefing;
