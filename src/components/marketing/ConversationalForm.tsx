
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { extractUtmParams } from '@/utils/utmUtils';
import { LeadData } from './MarketingLandingPage';
import { FadeTransition } from './FadeTransition';

interface ConversationalFormProps {
  onSubmit: (data: LeadData) => void;
  isSubmitting: boolean;
}

type Question = {
  id: string;
  text: string;
  type: 'multiple_choice' | 'text' | 'email' | 'name';
  options?: { value: string; label: string }[];
  placeholder?: string;
};

const questions: Question[] = [
  {
    id: 'projectType',
    text: 'Que tipo de projeto musical você está considerando?',
    type: 'multiple_choice',
    options: [
      { value: 'evento_pessoal', label: 'Evento pessoal (casamento, aniversário)' },
      { value: 'negocio', label: 'Para meu negócio ou marca' },
      { value: 'presente', label: 'Um presente especial para alguém' }
    ]
  },
  {
    id: 'musicStyle',
    text: 'Qual estilo musical mais combina com sua personalidade?',
    type: 'multiple_choice',
    options: [
      { value: 'pop', label: 'Pop' },
      { value: 'classico', label: 'Clássico' },
      { value: 'eletronico', label: 'Eletrônico' },
      { value: 'rock', label: 'Rock' },
      { value: 'mpb', label: 'MPB' },
      { value: 'outro', label: 'Outro estilo' }
    ]
  },
  {
    id: 'musicValue',
    text: 'O que você valoriza mais em uma música personalizada?',
    type: 'multiple_choice',
    options: [
      { value: 'letra', label: 'Uma letra marcante e significativa' },
      { value: 'melodia', label: 'Uma melodia única e cativante' },
      { value: 'producao', label: 'Produção de alta qualidade' },
      { value: 'originalidade', label: 'Originalidade e criatividade' }
    ]
  },
  {
    id: 'name',
    text: 'Vamos encontrar o pacote perfeito para você! Qual é o seu nome?',
    type: 'name',
    placeholder: 'Seu nome'
  },
  {
    id: 'email',
    text: 'Por último, qual é o seu email para enviarmos a análise personalizada?',
    type: 'email',
    placeholder: 'seu@email.com'
  }
];

const ConversationalForm: React.FC<ConversationalFormProps> = ({ onSubmit, isSubmitting }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isAnimating, setIsAnimating] = useState(false);
  const location = useLocation();
  
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  
  const handleNextQuestion = (value: string) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setResponses({ ...responses, [currentQuestion.id]: value });
    
    setTimeout(() => {
      setCurrentQuestionIndex(prev => prev + 1);
      setIsAnimating(false);
    }, 300);
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0 && !isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev - 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResponses({ ...responses, [currentQuestion.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Extract UTM parameters
    const utmParams = extractUtmParams(location.search);
    
    // Create data object
    const data: LeadData = {
      name: responses.name || '',
      email: responses.email || '',
      responses,
      leadSource: utmParams.source,
      leadMedium: utmParams.medium,
      leadCampaign: utmParams.campaign,
      leadContent: utmParams.content,
      leadTerm: utmParams.term,
    };
    
    onSubmit(data);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-md mx-auto"
    >
      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-800 rounded-full mb-8">
        <div 
          className="h-2 bg-blue-600 rounded-full transition-all duration-300 ease-in-out" 
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Question card */}
      <Card className="p-6 bg-[#1D1D1D] border-gray-800 shadow-xl">
        <FadeTransition key={currentQuestionIndex}>
          <form onSubmit={e => e.preventDefault()} className="space-y-6">
            <h2 className="text-2xl font-semibold text-white mb-4">
              {currentQuestion.text}
            </h2>
            
            {currentQuestion.type === 'multiple_choice' && (
              <div className="grid gap-3">
                {currentQuestion.options?.map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    variant="outline"
                    className="justify-start text-left h-auto py-3 px-4 hover:bg-blue-900/20 hover:border-blue-500 transition-all"
                    onClick={() => handleNextQuestion(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            )}
            
            {(currentQuestion.type === 'text' || 
              currentQuestion.type === 'name' || 
              currentQuestion.type === 'email') && (
              <div className="space-y-4">
                <Input
                  id={currentQuestion.id}
                  type={currentQuestion.type === 'email' ? 'email' : 'text'}
                  placeholder={currentQuestion.placeholder}
                  value={responses[currentQuestion.id] || ''}
                  onChange={handleInputChange}
                  className="bg-[#2D2D2D] border-gray-700 text-white"
                  required
                />
                
                <div className="flex justify-between pt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handlePrevQuestion}
                    disabled={currentQuestionIndex === 0}
                  >
                    Voltar
                  </Button>
                  
                  <Button 
                    type="button"
                    onClick={() => {
                      if (currentQuestionIndex === questions.length - 1) {
                        handleSubmit(new Event('submit') as any);
                      } else {
                        handleNextQuestion(responses[currentQuestion.id] || '');
                      }
                    }}
                    disabled={!responses[currentQuestion.id] || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando
                      </>
                    ) : currentQuestionIndex === questions.length - 1 ? (
                      'Concluir'
                    ) : (
                      'Próximo'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </FadeTransition>
      </Card>
    </motion.div>
  );
};

export default ConversationalForm;
