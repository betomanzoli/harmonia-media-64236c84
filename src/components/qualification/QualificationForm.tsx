
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import DynamicFormSection from './DynamicFormSection';
import QualificationResults from './QualificationResults';
import { useToast } from '@/hooks/use-toast';

interface BriefingField {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'radio';
  label: string;
  required?: boolean;
  options?: string[];
}

interface BriefingSection {
  id: string;
  title: string;
  fields: BriefingField[];
}

const QualificationForm: React.FC = () => {
  // Mock data since briefing_form table doesn't exist
  const mockBriefingData: BriefingSection[] = [
    {
      id: 'personal',
      title: 'Informações Pessoais',
      fields: [
        { id: 'name', type: 'text', label: 'Nome completo', required: true },
        { id: 'email', type: 'text', label: 'Email', required: true },
        { id: 'phone', type: 'text', label: 'Telefone', required: true }
      ]
    },
    {
      id: 'project',
      title: 'Sobre o Projeto',
      fields: [
        { id: 'purpose', type: 'textarea', label: 'Qual o propósito da música?', required: true },
        { id: 'style', type: 'select', label: 'Estilo musical preferido', options: ['Pop', 'Rock', 'Eletrônica', 'Clássica', 'Jazz'] },
        { id: 'deadline', type: 'text', label: 'Prazo desejado' }
      ]
    },
    {
      id: 'budget',
      title: 'Orçamento',
      fields: [
        { id: 'budget', type: 'select', label: 'Faixa de orçamento', options: ['Até R$ 500', 'R$ 500 - R$ 1000', 'R$ 1000 - R$ 2000', 'Acima de R$ 2000'] }
      ]
    }
  ];

  const [briefingData, setBriefingData] = useState<BriefingSection[]>(mockBriefingData);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleNextSection = () => {
    if (currentSectionIndex < briefingData.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handlePrevSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };

  const handleInputChange = (fieldId: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleSubmit = async () => {
    console.log('Form values:', formValues);
    toast({
      title: "Briefing enviado!",
      description: "Seu briefing foi enviado com sucesso.",
    });
  };

  const currentSection = briefingData[currentSectionIndex];
  const progress = ((currentSectionIndex + 1) / briefingData.length) * 100;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          Carregando formulário...
        </CardContent>
      </Card>
    );
  }

  if (isComplete) {
    return (
      <QualificationResults
        formValues={formValues}
        briefingData={briefingData}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{currentSection?.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={progress} className="mb-4" />
        
        {currentSection && (
          <DynamicFormSection
            section={currentSection}
            values={formValues}
            onChange={handleInputChange}
          />
        )}

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevSection}
            disabled={currentSectionIndex === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          <Button onClick={handleNextSection}>
            {currentSectionIndex === briefingData.length - 1 ? (
              <>
                Enviar Briefing
                <CheckCircle className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Próximo
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QualificationForm;
