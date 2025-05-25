
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import BriefingForm from '@/components/BriefingForm';

const BriefingComplete: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const briefingId = searchParams.get('id');
  
  const [isLoading, setIsLoading] = useState(true);
  const [briefingData, setBriefingData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [packageType, setPackageType] = useState<'essencial' | 'profissional' | 'premium'>('essencial');

  useEffect(() => {
    const fetchBriefingData = async () => {
      if (!briefingId) {
        setError('ID do briefing não encontrado');
        setIsLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('briefings')
          .select('*')
          .eq('id', briefingId)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setBriefingData(data);
          setPackageType(data.package_type);
          
          // Check if payment is completed
          if (data.payment_status !== 'completed') {
            setError('Pagamento pendente. Conclua o pagamento para continuar.');
          }
        } else {
          setError('Briefing não encontrado');
        }
      } catch (err: any) {
        console.error('Error fetching briefing:', err);
        setError(err.message || 'Erro ao carregar briefing');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBriefingData();
  }, [briefingId]);

  // Handle saving the complete briefing
  const handleSaveBriefing = async (formData: any) => {
    try {
      // Combine initial responses with complete form data
      const fullResponses = {
        ...briefingData?.initial_responses,
        ...formData
      };
      
      // Update the briefing with complete data
      const { error } = await supabase
        .from('briefings')
        .update({
          full_responses: fullResponses,
          completion_status: 'completed',
          data: {
            ...briefingData?.data,
            ...formData,
            completedAt: new Date().toISOString()
          }
        })
        .eq('id', briefingId);
      
      if (error) throw error;
      
      // Navigate to thank you page or confirmation
      navigate('/briefing-success');
    } catch (err: any) {
      console.error('Error completing briefing:', err);
      setError(err.message || 'Erro ao salvar briefing completo');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="pt-32 pb-20 px-6 md:px-10 max-w-4xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-harmonia-green" />
            <span className="ml-3 text-xl">Carregando briefing...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-24 pb-20 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              className="flex items-center gap-1 text-gray-400 hover:text-white"
              onClick={() => navigate('/briefing')}
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para briefing
            </Button>
          </div>
          
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Complete seu Briefing Musical</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {error ? 'Ocorreu um erro ao carregar seu briefing.' : 'Agora vamos aprofundar no seu projeto musical. Complete as informações abaixo para prosseguirmos com a criação da sua música.'}
            </p>
          </div>

          {error ? (
            <Alert variant="destructive" className="mb-8">
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="mb-6">
                <Alert className="bg-card border border-harmonia-green/30">
                  <CheckCircle2 className="h-4 w-4 text-harmonia-green" />
                  <AlertTitle>Pagamento confirmado</AlertTitle>
                  <AlertDescription>
                    <p className="text-sm text-gray-400">
                      Você adquiriu o pacote {
                        packageType === 'essencial' ? 'Essencial' : 
                        packageType === 'profissional' ? 'Profissional' : 
                        'Premium'
                      }. Por favor, complete o briefing detalhado abaixo.
                    </p>
                  </AlertDescription>
                </Alert>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 space-y-6">
                  <Card className="p-6 border border-border">
                    <h3 className="font-semibold mb-2">
                      {packageType === 'essencial' && "Pacote Essencial"}
                      {packageType === 'profissional' && "Pacote Profissional"}
                      {packageType === 'premium' && "Pacote Premium"}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      {packageType === 'essencial' && "Ideal para presentes emocionais rápidos. Inclui uma composição única com direito a uma revisão."}
                      {packageType === 'profissional' && "Perfeito para criadores de conteúdo. Inclui três versões para escolha e até três revisões."}
                      {packageType === 'premium' && "Melhor opção para empresas. Inclui registro na Biblioteca Nacional e revisões ilimitadas."}
                    </p>
                    
                    {/* Show initial responses */}
                    <div className="border-t border-border pt-4 mt-4">
                      <h4 className="font-medium text-sm mb-2">Suas respostas iniciais:</h4>
                      <div className="space-y-2 text-sm">
                        {briefingData?.initial_responses && (
                          <>
                            <p><strong>Inspiração:</strong> {briefingData.initial_responses.inspiration}</p>
                            <p><strong>Conexão especial:</strong> {briefingData.initial_responses.specialConnection}</p>
                            <p><strong>Emoção principal:</strong> {briefingData.initial_responses.emotion}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>
                
                <div className="md:col-span-2">
                  <BriefingForm 
                    packageType={packageType}
                    initialData={briefingData?.initial_responses}
                    onSubmit={handleSaveBriefing}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BriefingComplete;
