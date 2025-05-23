import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Music, Heart, Clock, Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ConversationalBriefingProps {
  onComplete: (briefingId: string, packageType: 'essencial' | 'profissional' | 'premium') => void;
}

// ✅ CONFIGURAÇÃO DOS PACOTES COM VALORES CORRETOS
const PACKAGES_CONFIG = {
  essencial: {
    name: 'Essencial',
    price: 219,
    originalPrice: 219,
    badge: 'Ideal para presentear',
    features: [
      '1 composição musical completa',
      '1 revisão incluída',
      'Arquivo digital alta qualidade',
      'Entrega em 72h úteis',
      'Certificado digital de autoria'
    ],
    icon: Heart
  },
  profissional: {
    name: 'Profissional',
    price: 479,
    originalPrice: 479,
    badge: 'Mais Popular',
    features: [
      '3 propostas em estilos diferentes',
      '2 revisões incluídas',
      'Masterização básica',
      'Stems separados básicos',
      'Entrega em 5 dias úteis',
      'Uso comercial limitado'
    ],
    icon: Music
  },
  premium: {
    name: 'Premium',
    price: 969,
    originalPrice: 969,
    badge: 'Direitos completos',
    features: [
      '5 propostas de conceito/estilo',
      '3 revisões completas',
      'Registro na Biblioteca Nacional',
      'Masterização profissional',
      'Stems completos separados',
      'Entrega em 7 dias úteis',
      'Direitos autorais transferidos'
    ],
    icon: Star
  }
};

const ConversationalBriefing: React.FC<ConversationalBriefingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [briefingData, setBriefingData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    musicPurpose: '',
    projectDescription: '',
    deadline: '',
    style: '',
    mood: '',
    inspiration: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [briefingId, setBriefingId] = useState<string | null>(null);

  // Perguntas do chatbot
  const chatSteps = [
    {
      id: 'welcome',
      question: 'Olá! Vou te ajudar a criar sua música personalizada. Qual é o seu nome?',
      type: 'text',
      field: 'clientName',
      placeholder: 'Digite seu nome completo'
    },
    {
      id: 'email',
      question: 'Perfeito! Agora preciso do seu email para enviarmos sua música pronta:',
      type: 'email',
      field: 'clientEmail',
      placeholder: 'seu@email.com'
    },
    {
      id: 'phone',
      question: 'E seu WhatsApp para caso precisemos entrar em contato?',
      type: 'tel',
      field: 'clientPhone',
      placeholder: '(11) 99999-9999'
    },
    {
      id: 'purpose',
      question: 'Legal! Para que você quer essa música?',
      type: 'select',
      field: 'musicPurpose',
      options: [
        { value: 'presente', label: 'Presente pessoal (aniversário, casamento, etc.)' },
        { value: 'profissional', label: 'Uso profissional (podcast, canal, marca pessoal)' },
        { value: 'corporativo', label: 'Uso corporativo (evento, marca, produto)' },
        { value: 'outro', label: 'Outro motivo' }
      ]
    },
    {
      id: 'description',
      question: 'Agora me conte: qual história ou sentimento você gostaria de transformar em música?',
      type: 'textarea',
      field: 'projectDescription',
      placeholder: 'Descreva sua ideia... Ex: Uma música romântica para minha esposa, falando sobre nossos 10 anos juntos...'
    },
    {
      id: 'deadline',
      question: 'Quando você precisa da música pronta?',
      type: 'select',
      field: 'deadline',
      options: [
        { value: 'urgente', label: 'Urgente (até 72h)' },
        { value: 'padrao', label: 'Padrão (3-7 dias)' },
        { value: 'flexivel', label: 'Flexível (mais de 7 dias)' }
      ]
    },
    {
      id: 'style',
      question: 'Que estilo musical você tem em mente?',
      type: 'select',
      field: 'style',
      options: [
        { value: 'mpb', label: 'MPB/Bossa Nova' },
        { value: 'pop', label: 'Pop' },
        { value: 'rock', label: 'Rock' },
        { value: 'acoustico', label: 'Acústico' },
        { value: 'eletronica', label: 'Eletrônica' },
        { value: 'sem_preferencia', label: 'Não tenho preferência' }
      ]
    }
  ];

  const currentStepData = chatSteps[currentStep];

  // Salvar briefing inicial no Supabase
  const saveBriefingToDatabase = async () => {
    try {
      const { data, error } = await supabase
        .from('briefings')
        .insert({
          client_name: briefingData.clientName,
          client_email: briefingData.clientEmail,
          client_phone: briefingData.clientPhone,
          music_purpose: briefingData.musicPurpose,
          project_description: briefingData.projectDescription,
          deadline: briefingData.deadline,
          style: briefingData.style,
          chatbot_data: briefingData,
          briefing_type: 'simple',
          payment_status: 'pending',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      setBriefingId(data.id);
      console.log('✅ Briefing salvo no Supabase:', data);
      return data.id;
    } catch (error) {
      console.error('❌ Erro ao salvar briefing:', error);
      throw error;
    }
  };

  // Avançar para próximo passo
  const handleNext = async () => {
    if (currentStep < chatSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Última pergunta - salvar no banco e mostrar pacotes
      setIsSubmitting(true);
      try {
        const savedBriefingId = await saveBriefingToDatabase();
        setBriefingId(savedBriefingId);
        setCurrentStep(chatSteps.length); // Ir para seleção de pacotes
      } catch (error) {
        alert('Erro ao salvar suas informações. Tente novamente.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Voltar passo anterior
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Atualizar dados do briefing
  const updateBriefingData = (field: string, value: string) => {
    setBriefingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Verificar se pode avançar
  const canProceed = () => {
    const currentField = currentStepData?.field;
    return currentField ? briefingData[currentField as keyof typeof briefingData]?.trim() : false;
  };

  // Selecionar pacote
  const handlePackageSelect = (packageType: 'essencial' | 'profissional' | 'premium') => {
    if (briefingId) {
      onComplete(briefingId, packageType);
    }
  };

  // Renderizar seleção de pacotes
  if (currentStep >= chatSteps.length) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">
            Perfeito, {briefingData.clientName}! 🎵
          </h2>
          <p className="text-gray-600">
            Agora escolha o pacote ideal para sua música personalizada:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(PACKAGES_CONFIG).map(([key, pkg]) => {
            const IconComponent = pkg.icon;
            const isPopular = key === 'profissional';

            return (
              <Card 
                key={key} 
                className={`relative transition-all hover:scale-105 ${
                  isPopular ? 'border-2 border-harmonia-green shadow-lg' : ''
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-harmonia-green text-white px-4 py-1">
                      {pkg.badge}
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-2 p-3 bg-gray-100 rounded-full w-fit">
                    <IconComponent className="w-6 h-6 text-harmonia-green" />
                  </div>
                  <CardTitle className="text-xl">{pkg.name}</CardTitle>
                  <div className="text-3xl font-bold text-harmonia-green">
                    R$ {pkg.price}
                  </div>
                  <Badge variant="outline" className="mx-auto w-fit">
                    {pkg.badge}
                  </Badge>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <span className="text-green-500 mr-2 mt-0.5">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    onClick={() => handlePackageSelect(key as 'essencial' | 'profissional' | 'premium')}
                    className={`w-full ${
                      isPopular 
                        ? 'bg-harmonia-green hover:bg-harmonia-green/90' 
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                  >
                    Escolher {pkg.name}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-6">
          <Button 
            variant="outline" 
            onClick={handleBack}
            className="mr-4"
          >
            ← Voltar e Editar Respostas
          </Button>
        </div>
      </div>
    );
  }

  // Renderizar pergunta atual
  return (
    <div className="space-y-6">
      {/* Progresso */}
      <div className="flex items-center space-x-2 mb-6">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-harmonia-green h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep + 1) / chatSteps.length) * 100}%` }}
          />
        </div>
        <span className="text-sm text-gray-600">
          {currentStep + 1} de {chatSteps.length}
        </span>
      </div>

      {/* Pergunta */}
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 p-3 bg-harmonia-green rounded-full">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <div className="bg-gray-100 rounded-lg p-4 mb-4">
            <p className="text-lg">{currentStepData.question}</p>
          </div>
        </div>
      </div>

      {/* Resposta */}
      <div className="ml-16">
        {currentStepData.type === 'text' || currentStepData.type === 'email' || currentStepData.type === 'tel' ? (
          <Input
            type={currentStepData.type}
            placeholder={currentStepData.placeholder}
            value={briefingData[currentStepData.field as keyof typeof briefingData]}
            onChange={(e) => updateBriefingData(currentStepData.field, e.target.value)}
            className="mb-4"
          />
        ) : currentStepData.type === 'textarea' ? (
          <Textarea
            placeholder={currentStepData.placeholder}
            value={briefingData[currentStepData.field as keyof typeof briefingData]}
            onChange={(e) => updateBriefingData(currentStepData.field, e.target.value)}
            className="mb-4 min-h-[100px]"
          />
        ) : currentStepData.type === 'select' ? (
          <Select onValueChange={(value) => updateBriefingData(currentStepData.field, value)}>
            <SelectTrigger className="mb-4">
              <SelectValue placeholder="Selecione uma opção..." />
            </SelectTrigger>
            <SelectContent>
              {currentStepData.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}

        {/* Botões */}
        <div className="flex space-x-4">
          {currentStep > 0 && (
            <Button variant="outline" onClick={handleBack}>
              ← Voltar
            </Button>
          )}
          <Button 
            onClick={handleNext}
            disabled={!canProceed() || isSubmitting}
            className="bg-harmonia-green hover:bg-harmonia-green/90"
          >
            {isSubmitting ? 'Salvando...' : 
             currentStep === chatSteps.length - 1 ? 'Ver Pacotes →' : 'Continuar →'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConversationalBriefing;
