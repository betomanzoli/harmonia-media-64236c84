
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

  const handleBriefingComplete = async (briefingId: string, packageType: 'essencial' | 'profissional' | 'premium') => {
    if (!briefingId) return;
    
    setIsLoading(true);
    
    try {
      toast({
        title: "Briefing salvo",
        description: "Suas informações foram salvas. Redirecionando para o contrato...",
      });

      // Redirecionar para página de contrato específica
      navigate(`/contract/${packageType}?briefing=${briefingId}`);
      
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
        />
      </main>
      <Footer />
    </div>
  );
};

export default Briefing;
