
import React from 'react';
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useBriefingForm } from './briefing/useBriefingForm';
import PersonalInfoSection from './briefing/PersonalInfoSection';
import ProjectInfoSection from './briefing/ProjectInfoSection';
import ReferencesSection from './briefing/ReferencesSection';

const BriefingForm: React.FC = () => {
  const { 
    form, 
    isSubmitting, 
    referenceFiles, 
    setReferenceFiles, 
    onSubmit 
  } = useBriefingForm();

  return (
    <div className="bg-card border border-border rounded-lg p-8">
      <h3 className="text-xl font-semibold mb-6">Formulário de Briefing</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Dados pessoais */}
          <PersonalInfoSection />
          
          {/* Informações do projeto */}
          <ProjectInfoSection />
          
          {/* Referências */}
          <ReferencesSection 
            referenceFiles={referenceFiles} 
            setReferenceFiles={setReferenceFiles} 
          />
          
          <Button 
            type="submit" 
            className="w-full bg-harmonia-green hover:bg-harmonia-green/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "Enviar Briefing"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default BriefingForm;
