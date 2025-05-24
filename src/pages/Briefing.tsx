
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import ConversationalBriefing from '@/components/briefing/ConversationalBriefing';
import { supabase } from '@/lib/supabase';

const handlePackageSelect = async (packageType: 'essencial' | 'profissional' | 'premium') => {
  try {
    // ✅ SALVAR PACOTE NO BRIEFING
    const { data, error } = await supabase
      .from('briefings')
      .update({ 
        selected_package: packageType,
        status: 'awaiting_contract'
      })
      .eq('id', briefingId)
      .select()
      .single();

    if (error) throw error;

    // ✅ REDIRECIONAR PARA CONTRATO
    navigate(`/contract/${packageType}?briefing=${data.id}`);
    
  } catch (error) {
    console.error('[ERROR] Falha ao selecionar pacote:', error);
    toast({ title: 'Erro', description: 'Não foi possível processar sua seleção' });
  }
};

const Briefing: React.FC = () => {
  const navigate = useNavigate();
  const [hasPurchased, setHasPurchased] = useState(false);
  const [purchaseData, setPurchaseData] = useState<any>(null);

  useEffect(() => {
    // Check if user has purchased a package
    const paymentData = localStorage.getItem('paymentData');
    if (paymentData) {
      try {
        const data = JSON.parse(paymentData);
        setHasPurchased(true);
        setPurchaseData(data);
      } catch (e) {
        console.error('Error parsing payment data:', e);
      }
    }
  }, []);

  // Handle completion of initial briefing and selection of package
  const handleBriefingComplete = async (briefingId: string, packageType: 'essencial' | 'profissional' | 'premium') => {
    console.log('Briefing complete with ID:', briefingId);
    console.log('Selected package:', packageType);
    
    // Save briefingId to localStorage for later use
    localStorage.setItem('currentBriefingId', briefingId);
    
    // Redirect to payment page with briefingId parameter
    navigate(`/pagamento/${packageType}?briefingId=${briefingId}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-24 pb-20 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              className="flex items-center gap-1 text-gray-400 hover:text-white"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para a página inicial
            </Button>
          </div>
          
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Transforme sua história em música</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Conte-nos um pouco sobre a sua visão musical e criaremos uma composição personalizada especialmente para você.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-8">
            <ConversationalBriefing onComplete={handleBriefingComplete} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Briefing;
