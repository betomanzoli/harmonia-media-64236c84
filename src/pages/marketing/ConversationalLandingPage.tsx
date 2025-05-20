
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

type QuestionStep = {
  question: string;
  options: { id: string; text: string; value: string }[];
  nextStep: string;
};

type FormStep = {
  title: string;
  subtitle: string;
  fields: { name: string; label: string; type: 'text' | 'email' }[];
  submitText: string;
};

const ConversationalLandingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<string>('q1');
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<Record<string, string>>({ name: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [utmParams, setUtmParams] = useState<Record<string, string>>({});
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Extract UTM parameters
    const params: Record<string, string> = {};
    ['source', 'medium', 'campaign', 'content', 'term'].forEach(param => {
      const value = searchParams.get(`utm_${param}`);
      if (value) params[`utm_${param}`] = value;
    });
    setUtmParams(params);
  }, [searchParams]);

  // Define the conversational flow
  const questions: Record<string, QuestionStep> = {
    q1: {
      question: "Que tipo de projeto musical você está considerando?",
      options: [
        { id: "q1-1", text: "Evento pessoal", value: "personal_event" },
        { id: "q1-2", text: "Negócio/Marca", value: "business" },
        { id: "q1-3", text: "Presente especial", value: "gift" }
      ],
      nextStep: "q2"
    },
    q2: {
      question: "Qual estilo musical mais combina com sua personalidade?",
      options: [
        { id: "q2-1", text: "Pop", value: "pop" },
        { id: "q2-2", text: "Clássico", value: "classical" },
        { id: "q2-3", text: "Eletrônico", value: "electronic" },
        { id: "q2-4", text: "Acústico", value: "acoustic" },
        { id: "q2-5", text: "Outro", value: "other" }
      ],
      nextStep: "q3"
    },
    q3: {
      question: "O que você valoriza mais em uma música personalizada?",
      options: [
        { id: "q3-1", text: "Letra marcante", value: "lyrics" },
        { id: "q3-2", text: "Melodia única", value: "melody" },
        { id: "q3-3", text: "Arranjo sofisticado", value: "arrangement" },
        { id: "q3-4", text: "Qualidade de produção", value: "production" }
      ],
      nextStep: "form"
    }
  };

  // Form step
  const formStep: FormStep = {
    title: "Vamos encontrar o pacote perfeito para você!",
    subtitle: "Preencha para receber uma análise personalizada",
    fields: [
      { name: "name", label: "Seu nome", type: "text" },
      { name: "email", label: "Seu e-mail", type: "email" }
    ],
    submitText: "Encontrar meu pacote ideal"
  };

  const handleQuestionResponse = (value: string) => {
    setResponses({
      ...responses,
      [currentStep]: value
    });

    const nextStep = questions[currentStep]?.nextStep;
    if (nextStep) {
      setCurrentStep(nextStep);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const determineRedirect = (): string => {
    // Logic to determine the best page to redirect based on responses
    const projectType = responses.q1;
    const musicStyle = responses.q2;
    
    if (projectType === 'business') {
      return '/servicos?segmento=empresarial';
    } else if (musicStyle === 'classical') {
      return '/servicos?estilo=classico';
    } else {
      return '/pacotes';
    }
  };

  const sendToN8n = async (data: any) => {
    try {
      // Get webhook URL from settings
      const { data: settingsData } = await supabase
        .from('system_settings')
        .select('value')
        .eq('key', 'marketing_webhook_url')
        .single();
        
      const webhookUrl = settingsData?.value?.url;
      
      if (!webhookUrl) {
        console.error('Marketing webhook URL not configured');
        return;
      }
      
      // Send data to n8n webhook
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        mode: 'no-cors'
      });
      
      console.log('Data sent to n8n webhook');
    } catch (error) {
      console.error('Error sending data to n8n:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha seu nome e e-mail para continuar.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data
      const leadData = {
        name: formData.name,
        email: formData.email,
        responses: {
          ...responses,
          project_type: responses.q1 ? questions.q1.options.find(o => o.value === responses.q1)?.text : null,
          music_style: responses.q2 ? questions.q2.options.find(o => o.value === responses.q2)?.text : null,
          value_preference: responses.q3 ? questions.q3.options.find(o => o.value === responses.q3)?.text : null
        },
        lead_source: utmParams.utm_source || 'direct',
        lead_medium: utmParams.utm_medium || null,
        lead_campaign: utmParams.utm_campaign || null,
        lead_content: utmParams.utm_content || null,
        lead_term: utmParams.utm_term || null,
        created_at: new Date().toISOString()
      };

      // Save to Supabase
      const { error } = await supabase
        .from('marketing_leads')
        .insert([leadData]);

      if (error) throw error;

      // Send to n8n webhook
      await sendToN8n(leadData);

      // Set cookie for tracking
      document.cookie = `harmonia_lead=${formData.email}; path=/; max-age=${60*60*24*30}; SameSite=Lax`;

      toast({
        title: "Informações recebidas!",
        description: "Estamos te redirecionando para a solução ideal...",
      });

      // Redirect after a short delay
      setTimeout(() => {
        navigate(determineRedirect());
      }, 1500);

    } catch (error) {
      console.error('Error submitting lead:', error);
      toast({
        title: "Erro ao enviar informações",
        description: "Por favor, tente novamente em alguns instantes.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCurrentStep = () => {
    if (currentStep === "form") {
      return (
        <div className="space-y-6 max-w-md mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-bold">{formStep.title}</h2>
            <p className="text-gray-600 mt-2">{formStep.subtitle}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {formStep.fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>{field.label}</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  value={formData[field.name]}
                  onChange={handleFormChange}
                  required
                />
              </div>
            ))}
            
            <Button 
              type="submit" 
              className="w-full bg-harmonia-green hover:bg-harmonia-green/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processando..." : formStep.submitText}
            </Button>
          </form>
        </div>
      );
    }

    const currentQuestion = questions[currentStep];
    if (!currentQuestion) return null;

    return (
      <div className="space-y-6 max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-center">{currentQuestion.question}</h2>
        
        <RadioGroup 
          value={responses[currentStep] || ""} 
          onValueChange={handleQuestionResponse}
          className="space-y-3"
        >
          {currentQuestion.options.map((option) => (
            <div key={option.id} className="flex items-center space-x-2 border p-4 rounded-md hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value={option.value} id={option.id} />
              <Label htmlFor={option.id} className="cursor-pointer w-full">{option.text}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <header className="py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-harmonia-green text-center">harmonIA</h1>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg bg-white text-gray-900 rounded-lg shadow-xl p-8">
          <div className="mb-8">
            <div className="flex justify-center mb-4">
              {['q1', 'q2', 'q3', 'form'].map((step, index) => (
                <div 
                  key={step} 
                  className={`w-3 h-3 rounded-full mx-1 ${
                    step === currentStep ? 'bg-harmonia-green' : 
                    Object.keys(responses).includes(step) || (step === 'form' && Object.keys(responses).length === 3) ? 
                    'bg-harmonia-green/50' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          
          {renderCurrentStep()}
        </div>
      </main>
      
      <footer className="py-6 px-4 text-center text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} harmonIA. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default ConversationalLandingPage;
