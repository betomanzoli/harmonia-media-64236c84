
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Music, MessageCircle, ArrowRight, CheckCircle } from 'lucide-react';
import { briefingStorage, BriefingData } from '@/utils/briefingStorage';

interface ConversationalBriefingProps {
  onComplete: (briefingId: string, packageType: 'essencial' | 'profissional' | 'premium') => void;
}

interface ChatMessage {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
}

const ConversationalBriefing: React.FC<ConversationalBriefingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [briefingData, setBriefingData] = useState<Partial<BriefingData>>({});
  const [selectedPackage, setSelectedPackage] = useState<'essencial' | 'profissional' | 'premium' | null>(null);
  const [briefingId] = useState(() => briefingStorage.generateBriefingId());

  const steps = [
    {
      question: "Olá! Sou o assistente da Harmonia Music. Qual é o seu nome?",
      field: 'clientName',
      type: 'text'
    },
    {
      question: "Ótimo! Qual é o seu melhor e-mail para contato?",
      field: 'email',
      type: 'email'
    },
    {
      question: "Perfeito! Agora me conte: que tipo de música você precisa? Descreva o projeto.",
      field: 'projectDescription',
      type: 'textarea'
    },
    {
      question: "Interessante! Qual o seu orçamento estimado para este projeto?",
      field: 'budget',
      type: 'text'
    },
    {
      question: "E qual o prazo que você tem em mente para a entrega?",
      field: 'timeline',
      type: 'text'
    },
    {
      question: "Excelente! Agora vou apresentar nossos pacotes. Qual melhor se adequa ao seu projeto?",
      field: 'packageType',
      type: 'package-selection'
    }
  ];

  useEffect(() => {
    // Iniciar conversa
    addBotMessage(steps[0].question);
  }, []);

  useEffect(() => {
    // Salvar dados automaticamente
    if (Object.keys(briefingData).length > 0) {
      briefingStorage.saveBriefingData(briefingId, {
        ...briefingData,
        id: briefingId,
        createdAt: new Date().toISOString()
      });
    }
  }, [briefingData, briefingId]);

  const addBotMessage = (content: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'bot',
      content,
      timestamp: new Date()
    }]);
  };

  const addUserMessage = (content: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    }]);
  };

  const handleUserResponse = () => {
    if (!userInput.trim()) return;

    const currentStepData = steps[currentStep];
    addUserMessage(userInput);

    // Salvar resposta
    setBriefingData(prev => ({
      ...prev,
      [currentStepData.field]: userInput
    }));

    setUserInput('');

    // Próximo passo
    setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
        addBotMessage(steps[currentStep + 1].question);
      }
    }, 1000);
  };

  const handlePackageSelection = (packageType: 'essencial' | 'profissional' | 'premium') => {
    setSelectedPackage(packageType);
    addUserMessage(`Escolhi o pacote ${packageType}`);
    
    setBriefingData(prev => ({
      ...prev,
      packageType
    }));

    setTimeout(() => {
      addBotMessage("Perfeito! Vou salvar suas informações e te redirecionar para finalizar o processo.");
      
      setTimeout(() => {
        onComplete(briefingId, packageType);
      }, 2000);
    }, 1000);
  };

  const getCurrentStepType = () => {
    if (currentStep >= steps.length) return 'completed';
    return steps[currentStep].type;
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="text-center mb-8">
        <Music className="h-12 w-12 text-harmonia-green mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Vamos criar sua música personalizada
        </h1>
        <p className="text-gray-600">
          Responda algumas perguntas para começarmos
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Briefing Conversacional
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-harmonia-green text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>

          {getCurrentStepType() === 'package-selection' && (
            <div className="space-y-4">
              <div className="grid gap-4">
                <Button
                  onClick={() => handlePackageSelection('essencial')}
                  className="h-auto p-6 bg-blue-500 hover:bg-blue-600 text-left"
                >
                  <div>
                    <h3 className="font-bold text-lg mb-2">Pacote Essencial - R$ 297</h3>
                    <p className="text-sm opacity-90">Música instrumental personalizada, ideal para conteúdo digital</p>
                  </div>
                </Button>
                
                <Button
                  onClick={() => handlePackageSelection('profissional')}
                  className="h-auto p-6 bg-harmonia-green hover:bg-harmonia-green/90 text-left"
                >
                  <div>
                    <h3 className="font-bold text-lg mb-2">Pacote Profissional - R$ 597</h3>
                    <p className="text-sm opacity-90">Música completa com arranjos profissionais e mixagem</p>
                  </div>
                </Button>
                
                <Button
                  onClick={() => handlePackageSelection('premium')}
                  className="h-auto p-6 bg-purple-600 hover:bg-purple-700 text-left"
                >
                  <div>
                    <h3 className="font-bold text-lg mb-2">Pacote Premium - R$ 997</h3>
                    <p className="text-sm opacity-90">Produção completa com consultoria e versões ilimitadas</p>
                  </div>
                </Button>
              </div>
            </div>
          )}

          {getCurrentStepType() === 'textarea' && (
            <div className="space-y-4">
              <Textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Digite sua resposta aqui..."
                className="min-h-[100px]"
              />
              <Button onClick={handleUserResponse} className="w-full">
                <ArrowRight className="h-4 w-4 mr-2" />
                Enviar
              </Button>
            </div>
          )}

          {getCurrentStepType() === 'text' || getCurrentStepType() === 'email' && (
            <div className="space-y-4">
              <Input
                type={getCurrentStepType() === 'email' ? 'email' : 'text'}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Digite sua resposta..."
                onKeyPress={(e) => e.key === 'Enter' && handleUserResponse()}
              />
              <Button onClick={handleUserResponse} className="w-full">
                <ArrowRight className="h-4 w-4 mr-2" />
                Continuar
              </Button>
            </div>
          )}

          {getCurrentStepType() === 'completed' && (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Briefing Concluído!
              </h3>
              <p className="text-gray-600">
                Redirecionando para finalizar seu pedido...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConversationalBriefing;
