
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  QualificationFormData, 
  qualificationFormSchema 
} from './qualificationFormSchema';
import BasicInfoSection from './BasicInfoSection';
import PurposeSection from './PurposeSection';
import ProjectDescriptionSection from './ProjectDescriptionSection';
import TimelineSection from './TimelineSection';
import BudgetSection from './BudgetSection';
import FeaturesSection from './FeaturesSection';
import ContractAcceptance from './ContractAcceptance';
import QualificationFormHeader from './QualificationFormHeader';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const QualificationForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<QualificationFormData>({
    resolver: zodResolver(qualificationFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: { fullNumber: '', countryCode: '55', nationalNumber: '' },
      referralSource: '',
      purpose: '',
      purposeOther: '',
      projectDescription: '',
      timeline: '',
      budget: '',
      features: [],
      contractAccepted: false,
    }
  });

  const onSubmit = async (data: QualificationFormData) => {
    setIsSubmitting(true);
    
    try {
      // Format data for storage
      const formattedData = {
        ...data,
        phone: data.phone.fullNumber,
        features: data.features?.join(',')
      };

      // Create or get client
      let clientId = null;
      const { data: existingClient } = await supabase
        .from('clients')
        .select('id')
        .eq('email', data.email)
        .maybeSingle();

      if (existingClient) {
        clientId = existingClient.id;
      } else {
        const { data: newClient, error: clientError } = await supabase
          .from('clients')
          .insert([{
            name: data.name,
            email: data.email,
            phone: data.phone.fullNumber // Store full international format phone
          }])
          .select('id')
          .single();

        if (clientError) throw clientError;
        clientId = newClient.id;
      }

      // Create briefing
      const { error: briefingError } = await supabase
        .from('briefings')
        .insert([{
          client_id: clientId,
          package_type: 'qualification',
          data: formattedData
        }]);

      if (briefingError) throw briefingError;

      toast({
        title: "Formulário enviado com sucesso!",
        description: "Entraremos em contato em breve.",
      });

      form.reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Erro ao enviar formulário",
        description: "Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <QualificationFormHeader />
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
        <BasicInfoSection form={form} />
        <PurposeSection form={form} />
        <ProjectDescriptionSection form={form} />
        <TimelineSection form={form} />
        <BudgetSection form={form} />
        <FeaturesSection form={form} />
        <ContractAcceptance form={form} />
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="px-8 py-2"
          >
            {isSubmitting ? "Enviando..." : "Enviar"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default QualificationForm;
