
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowRight, ArrowLeft, Send } from 'lucide-react';
import { useConversationalBriefing } from '@/hooks/useConversationalBriefing';
import PackageSelection from './PackageSelection';

interface Message {
  role: 'system' | 'user';
  content: string;
  isTyping?: boolean;
}

interface ConversationalBriefingProps {
  onComplete: (briefingId: string, packageType: 'essencial' | 'profissional' | 'premium') => void;
}

const ConversationalBriefing: React.FC<ConversationalBriefingProps> = ({ onComplete }) => {
  const {
    currentStep,
    responses,
    isLoading,
    questions,
    handleResponse,
    nextStep,
    previousStep,
    submitBriefing,
    isLastQuestion,
    isFirstQuestion
  } = useConversationalBriefing();

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content: 'Olá! Sou o assistente de composição da harmonIA. Para criar sua música personalizada, preciso conhecer um pouco sobre o que você imagina.'
    }
  ]);
  const [currentResponse, setCurrentResponse] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isInitialBriefingComplete, setIsInitialBriefingComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Simulate assistant typing
  const simulateTyping = (message: string, delay = 30) => {
    return new Promise<void>((resolve) => {
      setIsTyping(true);
      
      // Add a temporary typing message
      setMessages(prev => [...prev, {
        role: 'system',
        content: '',
        isTyping: true
      }]);
      
      // Delay before showing the message
      setTimeout(() => {
        setMessages(prev => [
          ...prev.filter(m => !m.isTyping),
          {
            role: 'system',
            content: message
          }
        ]);
        setIsTyping(false);
        resolve();
      }, delay * message.length); // Simulates typing speed
    });
  };

  // Handle user response submission
  const handleSubmit = async () => {
    if (!currentResponse.trim()) return;
    
    // Add user message to chat
    setMessages(prev => [...prev, {
      role: 'user',
      content: currentResponse
    }]);
    
    // Save the response
    handleResponse(questions[currentStep]?.id || `step_${currentStep}`, currentResponse);
    setCurrentResponse('');
    
    // Move to next step after a brief delay
    setTimeout(async () => {
      // If we have more questions, show the next one
      if (!isLastQuestion) {
        nextStep();
        await simulateTyping(questions[currentStep + 1]?.question || 'Próxima pergunta...');
      } 
      // If we've completed all questions
      else {
        setIsInitialBriefingComplete(true);
        await simulateTyping("Para continuar criando sua música personalizada, precisamos de mais detalhes específicos que são desbloqueados após a contratação de um dos pacotes abaixo. Escolha o que melhor atende às suas necessidades:");
      }
    }, 500);
  };

  // Handle package selection
  const handlePackageSelect = async (packageType: 'essencial' | 'profissional' | 'premium') => {
    const mockInitialData = {
      name: 'Cliente Conversacional',
      email: 'cliente@exemplo.com',
      projectType: 'Composição Musical',
      budget: 'Médio',
      timeline: 'Flexível',
      description: 'Projeto criado via conversação'
    };

    try {
      const briefingData = await submitBriefing(mockInitialData, packageType);
      if (briefingData?.id) {
        onComplete(briefingData.id, packageType);
      }
    } catch (error) {
      console.error('Error selecting package:', error);
    }
  };

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Show first question on initial render
  useEffect(() => {
    if (messages.length === 1 && questions.length > 0) {
      setTimeout(async () => {
        await simulateTyping(questions[0].question);
      }, 1000);
    }
  }, [questions]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Briefing Musical</h3>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          {!isInitialBriefingComplete && (
            <>
              <span>Etapa {currentStep + 1} de {questions.length}</span>
              <div className="w-32 h-2 bg-gray-200 rounded-full ml-2">
                <div 
                  className="h-2 bg-harmonia-green rounded-full" 
                  style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-card rounded-lg p-4 mb-4 border border-border">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.role === 'system' ? 'justify-start' : 'justify-end'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'system' 
                    ? 'bg-muted text-foreground' 
                    : 'bg-harmonia-green/20 text-foreground'
                }`}
              >
                {message.isTyping ? (
                  <div className="flex space-x-1 items-center h-6">
                    <div className="w-2 h-2 rounded-full bg-foreground/70 animate-bounce" 
                      style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-foreground/70 animate-bounce" 
                      style={{ animationDelay: '300ms' }} />
                    <div className="w-2 h-2 rounded-full bg-foreground/70 animate-bounce" 
                      style={{ animationDelay: '600ms' }} />
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {isInitialBriefingComplete ? (
        <PackageSelection 
          onSelectPackage={handlePackageSelect}
          isSubmitting={isLoading}
        />
      ) : (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            disabled={isFirstQuestion || isTyping}
            onClick={previousStep}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex-1 flex gap-2">
            <Textarea
              value={currentResponse}
              onChange={(e) => setCurrentResponse(e.target.value)}
              placeholder="Digite sua resposta aqui..."
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              disabled={isTyping}
            />
            <Button
              disabled={!currentResponse.trim() || isTyping}
              onClick={handleSubmit}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationalBriefing;
