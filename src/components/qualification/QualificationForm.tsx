import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import DynamicFormSection from './DynamicFormSection';
import QualificationResults from './QualificationResults';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  const [briefingData, setBriefingData] = useState<BriefingSection[]>([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadBriefingData();
  }, []);

  const loadBriefingData = async () => {
    setIsLoading(true);
    try {
      // Fetch briefing data from Supabase
      const { data, error } = await supabase
        .from('briefing_form')
        .select('*')
        .order('order');

      if (error) throw error;

      // Transform data to match the expected structure
      const formattedData = data.map(section => ({
        id: section.id,
        title: section.title,
        fields: section.fields
      }));

      setBriefingData(formattedData);
    } catch (error) {
      console.error('Error loading briefing data:', error);
      toast({
        title: "Erro ao carregar briefing",
        description: "Não foi possível carregar o formulário de briefing.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

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
    // Handle form submission logic here
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
