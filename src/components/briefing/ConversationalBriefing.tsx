
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { useConversationalBriefing } from '@/hooks/useConversationalBriefing';
import PackageSelection from './PackageSelection';

interface ConversationalBriefingProps {
  onComplete?: (briefingId: string) => void;
}

const ConversationalBriefing: React.FC<ConversationalBriefingProps> = ({ onComplete }) => {
  const {
    currentStep,
    initialQuestions,
    initialResponses,
    isSubmitting,
    isInitialBriefingComplete,
    updateResponse,
    nextStep,
    prevStep,
    saveInitialBriefing
  } = useConversationalBriefing();

  const getCurrentResponse = () => {
    if (currentStep === 0) return initialResponses.inspiration;
    if (currentStep === 1) return initialResponses.specialConnection;
    if (currentStep === 2) return initialResponses.emotion;
    return '';
  };

  const handleResponseChange = (value: string) => {
    updateResponse(currentStep, value);
  };

  const handleNext = () => {
    const currentResponse = getCurrentResponse();
    if (currentResponse.trim()) {
      nextStep();
    }
  };

  const handlePackageSelect = async (packageType: 'essencial' | 'profissional' | 'premium') => {
    const briefingId = await saveInitialBriefing(packageType);
    if (briefingId && onComplete) {
      onComplete(briefingId);
    }
  };

  // Show package selection when initial briefing is complete
  if (isInitialBriefingComplete) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="border-harmonia-green/20">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-harmonia-green/10 p-3 rounded-full">
                <Sparkles className="h-8 w-8 text-harmonia-green" />
              </div>
            </div>
            <CardTitle className="text-2xl text-harmonia-green">
              Perfeito! Agora escolha seu pacote
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Com base nas suas respostas, escolha o pacote que melhor atende às suas necessidades
            </p>
          </CardHeader>
          <CardContent>
            <PackageSelection 
              onPackageSelect={handlePackageSelect}
              isSubmitting={isSubmitting}
            />
            <div className="mt-6 text-center">
              <Button 
                variant="outline" 
                onClick={prevStep}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentResponse = getCurrentResponse();
  const canProceed = currentResponse.trim().length > 0;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="border-harmonia-green/20">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div className="bg-harmonia-green/10 px-3 py-1 rounded-full">
              <span className="text-sm font-medium text-harmonia-green">
                Pergunta {currentStep + 1} de {initialQuestions.length}
              </span>
            </div>
            <div className="flex space-x-1">
              {initialQuestions.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index <= currentStep ? 'bg-harmonia-green' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          <CardTitle className="text-xl text-harmonia-green">
            {initialQuestions[currentStep]}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Textarea
              placeholder="Compartilhe seus pensamentos aqui..."
              value={currentResponse}
              onChange={(e) => handleResponseChange(e.target.value)}
              className="min-h-[120px] border-harmonia-green/20 focus:border-harmonia-green"
            />
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={prevStep} 
                disabled={currentStep === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>
              
              <Button 
                onClick={handleNext}
                disabled={!canProceed}
                className="bg-harmonia-green hover:bg-harmonia-green/90"
              >
                {currentStep === initialQuestions.length - 1 ? 'Finalizar' : 'Próxima'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConversationalBriefing;
