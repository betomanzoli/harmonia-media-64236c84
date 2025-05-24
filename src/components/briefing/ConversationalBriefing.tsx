
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useConversationalBriefing } from '@/hooks/useConversationalBriefing';
import { Music, Send, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ConversationalBriefingProps {
  onComplete: (briefingId: string, packageType: 'essencial' | 'profissional' | 'premium') => void;
}

const ConversationalBriefing: React.FC<ConversationalBriefingProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const {
    briefingId,
    currentStep,
    initialQuestions,
    initialResponses,
    isSubmitting,
    isInitialBriefingComplete,
    updateResponse,
    nextStep,
    prevStep,
    saveInitialBriefing,
  } = useConversationalBriefing();

  const [currentResponse, setCurrentResponse] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<'essencial' | 'profissional' | 'premium' | null>(null);
  const [showPackages, setShowPackages] = useState(false);

  useEffect(() => {
    if (isInitialBriefingComplete) {
      setShowPackages(true);
    }
  }, [isInitialBriefingComplete]);

  const handleNextQuestion = () => {
    if (!currentResponse.trim()) {
      toast({
        title: "Resposta necessária",
        description: "Por favor, responda à pergunta antes de continuar.",
        variant: "destructive"
      });
      return;
    }

    updateResponse(currentStep, currentResponse);
    setCurrentResponse('');
    nextStep();
  };

  const handlePrevQuestion = () => {
    const responses = Object.values(initialResponses);
    if (currentStep > 0 && responses[currentStep - 1]) {
      setCurrentResponse(responses[currentStep - 1]);
    }
    prevStep();
  };

  const handlePackageSelection = async (packageType: 'essencial' | 'profissional' | 'premium') => {
    setSelectedPackage(packageType);
    
    try {
      const savedBriefingId = await saveInitialBriefing(packageType);
      
      if (savedBriefingId) {
        toast({
          title: "Briefing salvo com sucesso!",
          description: "Redirecionando para o contrato...",
        });
        
        onComplete(savedBriefingId, packageType);
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível salvar o briefing. Tente novamente.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro ao salvar briefing:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const packages = [
    {
      id: 'essencial' as const,
      name: 'Essencial',
      price: 'R$ 297',
      description: 'Música personalizada com produção básica',
      features: ['1 música personalizada', 'Produção básica', 'Entrega em 7 dias', 'Formato MP3']
    },
    {
      id: 'profissional' as const,
      name: 'Profissional',
      price: 'R$ 597',
      description: 'Música personalizada com produção premium',
      features: ['1 música personalizada', 'Produção premium', 'Entrega em 5 dias', 'Múltiplos formatos', '2 revisões']
    },
    {
      id: 'premium' as const,
      name: 'Premium',
      price: 'R$ 997',
      description: 'Música personalizada com produção completa',
      features: ['1 música personalizada', 'Produção completa', 'Entrega em 3 dias', 'Todos os formatos', 'Revisões ilimitadas', 'Videoclipe lyric']
    }
  ];

  if (showPackages) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Music className="h-8 w-8 text-harmonia-green mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">Escolha seu Pacote</h1>
          </div>
          <p className="text-gray-600">
            Baseado nas suas respostas, escolha o pacote que melhor atende às suas necessidades.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {packages.map((pkg) => (
            <Card 
              key={pkg.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedPackage === pkg.id ? 'ring-2 ring-harmonia-green border-harmonia-green' : ''
              }`}
              onClick={() => setSelectedPackage(pkg.id)}
            >
              <CardHeader>
                <CardTitle className="text-xl text-center">{pkg.name}</CardTitle>
                <div className="text-center">
                  <span className="text-3xl font-bold text-harmonia-green">{pkg.price}</span>
                </div>
                <p className="text-center text-gray-600">{pkg.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Sparkles className="h-4 w-4 text-harmonia-green mr-2" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            onClick={() => selectedPackage && handlePackageSelection(selectedPackage)}
            disabled={!selectedPackage || isSubmitting}
            className="bg-harmonia-green hover:bg-harmonia-green/90 px-8 py-3"
          >
            {isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Processando...
              </>
            ) : (
              'Continuar com o Pacote Selecionado'
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Music className="h-8 w-8 text-harmonia-green mr-2" />
          <h1 className="text-3xl font-bold text-gray-900">harmonIA</h1>
        </div>
        <p className="text-gray-600">
          Assistente especializada em música personalizada
        </p>
        <div className="mt-4">
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className="bg-harmonia-green h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / initialQuestions.length) * 100}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Pergunta {currentStep + 1} de {initialQuestions.length}
          </p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-harmonia-green rounded-full flex items-center justify-center">
              <Music className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">harmonIA</h3>
              <p className="text-gray-600 mt-2">{initialQuestions[currentStep]}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            value={currentResponse}
            onChange={(e) => setCurrentResponse(e.target.value)}
            placeholder="Digite sua resposta aqui..."
            className="min-h-[120px] resize-none"
            disabled={isSubmitting}
          />
          
          <div className="flex justify-between mt-4">
            <Button
              variant="outline"
              onClick={handlePrevQuestion}
              disabled={currentStep === 0 || isSubmitting}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>
            
            <Button
              onClick={handleNextQuestion}
              disabled={!currentResponse.trim() || isSubmitting}
              className="bg-harmonia-green hover:bg-harmonia-green/90"
            >
              {currentStep === initialQuestions.length - 1 ? 'Finalizar' : 'Próxima'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mostrar respostas anteriores */}
      {currentStep > 0 && (
        <div className="space-y-4">
          {Array.from({ length: currentStep }, (_, index) => {
            const responses = Object.values(initialResponses);
            return (
              <Card key={index} className="bg-gray-50">
                <CardContent className="pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    {initialQuestions[index]}
                  </p>
                  <p className="text-gray-600">{responses[index]}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ConversationalBriefing;
