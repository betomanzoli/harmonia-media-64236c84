import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Minimize2, MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

type Message = {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  quickReplies?: string[];
};

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          text: 'Olá! Sou a harmonIA, como posso te ajudar hoje?',
          isBot: true,
          timestamp: new Date(),
          quickReplies: ['Como funciona o processo?', 'Quais pacotes vocês oferecem?', 'Quanto tempo demora para produzir uma música?']
        }
      ]);
    }
  }, [messages.length]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Focus input when chat opens
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Register the chatbot API in the window object
  useEffect(() => {
    if (!window.harmonIAChatbot) {
      window.harmonIAChatbot = {
        init: (config: any) => {
          console.log('Chatbot initialized with config:', config);
        },
        toggleChat: () => {
          setIsOpen(prev => !prev);
        },
        addBotMessage: (text: string, quickReplies?: string[]) => {
          addMessage(text, true, quickReplies);
        },
        addUserMessage: (text: string) => {
          addMessage(text, false);
        }
      };
    }

    return () => {
      // Keep the global object but update methods to no-ops if component unmounts
      if (window.harmonIAChatbot) {
        window.harmonIAChatbot.toggleChat = () => console.log('Chatbot unavailable');
        window.harmonIAChatbot.addBotMessage = () => console.log('Chatbot unavailable');
        window.harmonIAChatbot.addUserMessage = () => console.log('Chatbot unavailable');
      }
    };
  }, []);

  const addMessage = (text: string, isBot: boolean, quickReplies?: string[]) => {
    if (!text.trim()) return;

    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        text: text.trim(),
        isBot,
        timestamp: new Date(),
        quickReplies
      }
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    addMessage(input, false);
    
    // Clear input
    setInput('');
    
    // Simulate bot thinking
    setIsLoading(true);
    
    try {
      // In a real implementation, this would be an API call
      setTimeout(() => {
        // Simulate response based on user input
        const lowercaseInput = input.toLowerCase();
        
        if (lowercaseInput.includes('pacote') || lowercaseInput.includes('preço') || lowercaseInput.includes('valor')) {
          addMessage('Oferecemos pacotes Essencial, Profissional e Premium. Cada um tem características diferentes e preços a partir de R$1.500. Você pode ver todos os detalhes na nossa página de pacotes.', true, ['Ver pacotes', 'Mais informações', 'Falar com atendente']);
        } else if (lowercaseInput.includes('prazo') || lowercaseInput.includes('tempo') || lowercaseInput.includes('demora')) {
          addMessage('O prazo de produção de uma música personalizada varia de acordo com o pacote escolhido. Em média, levamos de 7 a 21 dias para entregar uma música completa após a aprovação do briefing.', true);
        } else if (lowercaseInput.includes('processo') || lowercaseInput.includes('como funciona')) {
          addMessage('Nosso processo criativo tem 4 etapas: 1) Briefing detalhado para entender suas necessidades, 2) Composição e produção da sua música, 3) Compartilhamento de prévias para feedback, 4) Finalização e entrega. Podemos te guiar em cada etapa!', true, ['Iniciar briefing', 'Ver exemplos']);
        } else {
          addMessage('Obrigado pelo contato! Para melhor atendimento, gostaria de saber mais sobre o que você precisa. Está procurando uma música para algum projeto específico?', true, ['Sim, música personalizada', 'Quero conhecer os pacotes', 'Tenho outras dúvidas']);
        }
        
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error processing message:', error);
      toast({
        title: "Erro no processamento",
        description: "Não foi possível processar sua mensagem. Tente novamente.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const handleQuickReply = (reply: string) => {
    // Add the quick reply as a user message
    addMessage(reply, false);
    
    // Process the quick reply
    setIsLoading(true);
    
    setTimeout(() => {
      if (reply === 'Ver pacotes' || reply === 'Quero conhecer os pacotes') {
        addMessage('Você pode conhecer nossos pacotes em detalhes em nossa página de Pacotes. Quer que eu te redirecione para lá?', true, ['Sim, ver pacotes', 'Não, continuar aqui']);
      } else if (reply === 'Iniciar briefing') {
        addMessage('Ótimo! Para começar o briefing, você pode acessar nossa página de briefing, onde coletamos todas as informações necessárias para criar sua música personalizada.', true, ['Ir para o briefing', 'Tenho dúvidas antes']);
      } else if (reply === 'Ver exemplos') {
        addMessage('Temos diversos exemplos de músicas que já produzimos em nosso portfólio. Você pode ouvi-las para ter uma ideia do nosso trabalho.', true, ['Ver portfólio', 'Tenho outra dúvida']);
      } else if (reply === 'Sim, ver pacotes') {
        // In a real implementation, we would navigate to the packages page
        addMessage('Redirecionando para a página de pacotes...', true);
        setTimeout(() => {
          window.location.href = '/pacotes';
        }, 1000);
      } else if (reply === 'Ir para o briefing') {
        addMessage('Redirecionando para o formulário de briefing...', true);
        setTimeout(() => {
          window.location.href = '/briefing';
        }, 1000);
      } else if (reply === 'Ver portfólio') {
        addMessage('Redirecionando para nosso portfólio...', true);
        setTimeout(() => {
          window.location.href = '/portfolio';
        }, 1000);
      } else {
        addMessage('Como posso te ajudar com mais informações? Você está interessado em músicas personalizadas para alguma ocasião específica?', true, ['Casamento', 'Aniversário', 'Publicidade', 'Outro']);
      }
      setIsLoading(false);
    }, 1000);
  };

  const toggleChat = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen ? (
        <Card className="w-80 md:w-96 h-[500px] flex flex-col shadow-xl animate-in slide-in-from-bottom-10 duration-300 mb-3">
          <div className="p-3 border-b bg-harmonia-green/10 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-harmonia-green" />
              <h3 className="font-medium">Assistente harmonIA</h3>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-7 w-7">
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-7 w-7">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'} mb-2`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.isBot
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-harmonia-green text-white'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  {msg.quickReplies && msg.isBot && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {msg.quickReplies.map((reply, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickReply(reply)}
                          className="text-xs py-1 px-2 bg-white text-harmonia-green rounded-full border border-harmonia-green/30 hover:bg-harmonia-green/10 transition-colors mt-1"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-2">
                <div className="bg-gray-100 rounded-lg p-3 flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-harmonia-green" />
                  <p className="text-sm text-gray-500">Digitando...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSubmit} className="p-3 border-t flex space-x-2">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Digite sua mensagem..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              size="icon"
              disabled={isLoading || !input.trim()}
              className="bg-harmonia-green hover:bg-harmonia-green/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </Card>
      ) : null}

      <Button
        onClick={toggleChat}
        className="w-12 h-12 rounded-full bg-harmonia-green hover:bg-harmonia-green/80 shadow-lg flex items-center justify-center"
      >
        <MessageSquare className="h-5 w-5 text-white" />
      </Button>
    </div>
  );
};

export default Chatbot;
