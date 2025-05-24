import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle, User, Mail, Target, ArrowRight, CheckCircle } from 'lucide-react';

interface ChatMessage {
  type: 'bot' | 'user';
  content: string;
  options?: string[];
}

const Briefing: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      type: 'bot',
      content: 'Olá! 👋 Eu sou a assistente da harmonIA. Vou te ajudar a criar sua música personalizada em apenas 3 perguntas simples. Vamos começar?'
    }
  ]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentInput, setCurrentInput] = useState('');
  const [showPackages, setShowPackages] = useState(false);

  const questions = [
    {
      question: "Qual o seu nome completo?",
      field: 'clientName',
      placeholder: 'Digite seu nome completo...',
      icon: User
    },
    {
      question: "Qual o melhor email para contato?",
      field: 'clientEmail',
      placeholder: 'seuemail@exemplo.com',
      icon: Mail
    },
    {
      question: "Para que ocasião você quer criar esta música?",
      field: 'musicPurpose',
      placeholder: 'Ex: Aniversário de casamento, presente para alguém especial...',
      icon: Target,
      options: [
        'Presente para alguém especial',
        'Aniversário de casamento',
        'Música para minha marca/empresa',
        'Trilha para vídeo/conteúdo',
        'Apenas por diversão',
        'Outro motivo'
      ]
    }
  ];

  const packages = [
    {
      id: 'essencial',
      name: 'Essencial',
      price: 'R$ 219',
      description: 'Perfeito para presentes pessoais',
      features: [
        '1 música personalizada',
        '2 versões para escolha',
        'Certificado digital',
        'Entrega em 5 dias',
        'Uso pessoal'
      ],
      color: 'bg-green-500',
      popular: false
    },
    {
      id: 'profissional',
      name: 'Profissional',
      price: 'R$ 479',
      description: 'Para uso comercial e profissional',
      features: [
        '1 música personalizada',
        '5 versões para escolha',
        'Uso comercial liberado',
        'Consulta de 15 minutos',
        'Entrega em 7 dias',
        'Formatos MP3 + WAV'
      ],
      color: 'bg-blue-500',
      popular: true
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 'R$ 969',
      description: 'Registro legal + propriedade total',
      features: [
        '1 música personalizada',
        '8 versões + 3 extras',
        'Registro na Biblioteca Nacional',
        'Propriedade 100% sua',
        'Consulta de 30 minutos',
        'Entrega em 10 dias',
        'Todos os formatos'
      ],
      color: 'bg-purple-500',
      popular: false
    }
  ];

  const handleSendMessage = () => {
    if (!currentInput.trim()) return;

    // Adicionar resposta do usuário
    const newMessages = [...messages, {
      type: 'user' as const,
      content: currentInput
    }];

    // Salvar resposta
    const currentQuestion = questions[currentStep];
    const newAnswers = {
      ...answers,
      [currentQuestion.field]: currentInput
    };
    setAnswers(newAnswers);

    // Próxima pergunta ou finalizar
    if (currentStep < questions.length - 1) {
      const nextStep = currentStep + 1;
      const nextQuestion = questions[nextStep];
      
      newMessages.push({
        type: 'bot',
        content: `Obrigada, ${newAnswers.clientName?.split(' ')[0] || 'cliente'}! 😊\n\n${nextQuestion.question}`,
        options: nextQuestion.options
      });
      
      setCurrentStep(nextStep);
    } else {
      // Finalizar perguntas e mostrar pacotes
      newMessages.push({
        type: 'bot',
        content: `Perfeito, ${newAnswers.clientName?.split(' ')[0]}! ✨\n\nAgora que conheço sua história, vou te apresentar nossos pacotes. Escolha o que melhor se encaixa no seu projeto:`
      });
      setShowPackages(true);
    }

    setMessages(newMessages);
    setCurrentInput('');
  };

  const handleOptionSelect = (option: string) => {
    setCurrentInput(option);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handlePackageSelect = async (packageType: 'essencial' | 'profissional' | 'premium') => {
    try {
      console.log('[DEBUG] Selecionando pacote:', packageType, 'com dados:', answers);
      
      // Criar briefing no Supabase
      const briefingData = {
        client_name: answers.clientName || '',
        client_email: answers.clientEmail || '',
        client_phone: '',
        music_purpose: answers.musicPurpose || '',
        project_description: `Briefing inicial: ${answers.musicPurpose}`,
        selected_package: packageType,
        briefing_type: 'chatbot_simple',
        status: 'package_selected',
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('briefings')
        .insert(briefingData)
        .select()
        .single();

      if (error) {
        console.error('[ERROR] Erro ao salvar briefing:', error);
        throw error;
      }

      console.log('[SUCCESS] Briefing salvo com ID:', data.id);

      toast({
        title: 'Pacote selecionado!',
        description: 'Redirecionando para aceite do contrato...'
      });

      // ✅ REDIRECIONAR PARA CONTRATO ESPECÍFICO
      navigate(`/contract/${packageType}?briefing=${data.id}`);
      
    } catch (error) {
      console.error('[ERROR] Falha ao processar pacote:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível processar sua seleção. Tente novamente.',
        variant: 'destructive'
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <Card className="h-[600px] flex flex-col">
          <CardHeader className="text-center border-b">
            <CardTitle className="flex items-center justify-center gap-2">
              <MessageCircle className="h-6 w-6 text-green-600" />
              Briefing harmonIA - Assistente Musical
            </CardTitle>
            <p className="text-gray-600">Vamos criar sua música em 3 passos simples</p>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Área de Mensagens */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-green-600 text-white'
                        : 'bg-white border border-gray-200'
                    }`}
                  >
                    <p className="whitespace-pre-line">{message.content}</p>
                    
                    {/* Opções de resposta rápida */}
                    {message.options && (
                      <div className="mt-3 space-y-2">
                        {message.options.map((option, optIndex) => (
                          <Button
                            key={optIndex}
                            variant="outline"
                            size="sm"
                            onClick={() => handleOptionSelect(option)}
                            className="w-full text-left justify-start"
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Seleção de Pacotes */}
              {showPackages && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {packages.map((pkg) => (
                      <Card 
                        key={pkg.id} 
                        className={`relative cursor-pointer transition-all duration-200 hover:shadow-lg ${
                          pkg.popular ? 'ring-2 ring-blue-500 transform scale-105' : ''
                        }`}
                        onClick={() => handlePackageSelect(pkg.id as any)}
                      >
                        {pkg.popular && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <Badge className="bg-blue-500 text-white">
                              Mais Popular
                            </Badge>
                          </div>
                        )}
                        
                        <CardContent className="p-4 text-center">
                          <div className={`w-12 h-12 ${pkg.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                            <CheckCircle className="h-6 w-6 text-white" />
                          </div>
                          
                          <h3 className="font-bold text-lg mb-1">{pkg.name}</h3>
                          <div className="text-2xl font-bold text-green-600 mb-2">
                            {pkg.price}
                          </div>
                          <p className="text-sm text-gray-600 mb-4">{pkg.description}</p>
                          
                          <ul className="text-xs space-y-1 mb-4">
                            {pkg.features.map((feature, index) => (
                              <li key={index} className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                          
                          <Button 
                            className={`w-full ${pkg.color} hover:opacity-90 text-white`}
                          >
                            Escolher {pkg.name}
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Área de Input */}
            {!showPackages && (
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={questions[currentStep]?.placeholder || 'Digite sua resposta...'}
                    className="flex-1"
                    autoFocus
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!currentInput.trim()}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex justify-center mt-2">
                  <div className="flex space-x-1">
                    {questions.map((_, index) => (
                      <div
                        key={index}
                        className={`h-2 w-8 rounded-full ${
                          index <= currentStep ? 'bg-green-600' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Briefing;
