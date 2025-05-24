import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

const BriefingChatbot: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const navigate = useNavigate();

  const steps = [
    {
      question: "Qual seu nome completo?",
      field: 'fullName',
      type: 'text'
    },
    {
      question: "Qual o melhor e-mail para contato?",
      field: 'email',
      type: 'email'
    },
    {
      question: "Qual a finalidade principal da música?",
      field: 'purpose',
      type: 'select',
      options: ['Presente pessoal', 'Uso profissional', 'Uso corporativo', 'Outro']
    }
  ];

  const handleSubmit = async (packageType: string) => {
    try {
      const { data, error } = await supabase
        .from('briefings')
        .insert({
          ...answers,
          status: 'pending',
          package_type: packageType
        })
        .select()
        .single();

      if (error) throw error;

      navigate(`/payment?briefing=${data.id}&package=${packageType}`);
    } catch (error) {
      console.error('Erro ao salvar briefing:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {steps.map((step, index) => (
            currentStep > index && (
              <div key={step.field} className="mb-6">
                <p className="font-semibold mb-2">{step.question}</p>
                <p className="text-gray-600">{answers[step.field] || '-'}</p>
              </div>
            )
          ))}

          {currentStep <= steps.length ? (
            <div className="space-y-4">
              <p className="text-xl font-semibold">
                {steps[currentStep - 1].question}
              </p>
              
              {steps[currentStep - 1].type === 'text' && (
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  onChange={(e) => setAnswers(prev => ({
                    ...prev,
                    [steps[currentStep - 1].field]: e.target.value
                  }))}
                />
              )}

              {steps[currentStep - 1].type === 'select' && (
                <select
                  className="w-full p-2 border rounded"
                  onChange={(e) => setAnswers(prev => ({
                    ...prev,
                    [steps[currentStep - 1].field]: e.target.value
                  }))}
                >
                  {steps[currentStep - 1].options?.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              )}

              <Button 
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="w-full"
              >
                Próxima Pergunta
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Escolha seu Pacote</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button onClick={() => handleSubmit('essencial')}>
                  Pacote Essencial - R$197
                </Button>
                <Button onClick={() => handleSubmit('profissional')}>
                  Pacote Profissional - R$397
                </Button>
                <Button onClick={() => handleSubmit('premium')}>
                  Pacote Premium - R$797
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BriefingChatbot;
