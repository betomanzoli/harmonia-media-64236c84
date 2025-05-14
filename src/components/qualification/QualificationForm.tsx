
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { formSchema } from "./qualificationFormSchema";
import QualificationFormHeader from "./QualificationFormHeader";
import BasicInfoSection from "./BasicInfoSection";
import PurposeSection from "./PurposeSection";
import TimelineSection from "./TimelineSection";
import ProjectDescriptionSection from "./ProjectDescriptionSection";
import BudgetSection from "./BudgetSection";
import FeaturesSection from "./FeaturesSection";
import ContractAcceptance from "./ContractAcceptance";
import * as z from "zod";
import { getRecommendedPackage } from "@/utils/packageRecommendation";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { useBriefingData } from "@/hooks/useBriefingData";
import DynamicFormSection from "./DynamicFormSection";

// Extend the form schema to include terms acceptance
const extendedFormSchema = formSchema.extend({
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "Você precisa aceitar os termos para continuar",
  })
});

type ExtendedFormValues = z.infer<typeof extendedFormSchema>;

export function QualificationForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { sections, fields, isLoading, saveBriefingData } = useBriefingData('qualification');
  
  const form = useForm<ExtendedFormValues>({
    resolver: zodResolver(extendedFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      referralSource: "",
      purpose: [],
      otherPurpose: "",
      timeline: "",
      description: "",
      budget: "",
      features: [],
      termsAccepted: false,
    },
  });

  async function onSubmit(data: ExtendedFormValues) {
    console.log("Form data:", data);
    setIsSubmitting(true);
    
    // Remove the termsAccepted field before storing the qualification data
    const { termsAccepted, ...qualificationData } = data;
    
    try {
      // Save to Supabase
      const result = await saveBriefingData(qualificationData);
      
      if (!result.success) {
        throw new Error(result.error || "Falha ao salvar dados");
      }
      
      // Store form data in localStorage to use it on the payment page
      localStorage.setItem("qualificationData", JSON.stringify({
        ...qualificationData,
        termsAccepted: true // Include termsAccepted to match QualificationData type
      }));
      
      // Show success toast
      toast({
        title: "Formulário enviado com sucesso!",
        description: "Você será redirecionado para a página de pagamento.",
      });
      
      // Determinar pacote recomendado
      const recommendedPackage = getRecommendedPackage({
        ...qualificationData,
        termsAccepted: true // Include termsAccepted to match QualificationData type
      });
      
      // Redirect to payment page with recommended package
      setTimeout(() => {
        navigate(`/pagamento/${recommendedPackage}`);
      }, 1500);
    } catch (err: any) {
      console.error("Erro na submissão:", err);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto bg-card border border-border rounded-lg p-6 shadow-lg flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-harmonia-green" />
        <span className="ml-2">Carregando formulário...</span>
      </div>
    );
  }

  // Use the dynamic form if we have sections from Supabase
  if (sections.length > 0 && Object.keys(fields).length > 0) {
    return (
      <div className="w-full max-w-3xl mx-auto bg-card border border-border rounded-lg p-6 shadow-lg">
        <QualificationFormHeader />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {sections.map((section) => (
              <DynamicFormSection
                key={section.id}
                section={section}
                fields={fields[section.id] || []}
                form={form}
              />
            ))}
            
            <ContractAcceptance form={form} />

            <Button 
              type="submit" 
              className="w-full bg-harmonia-green hover:bg-harmonia-green/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar e Prosseguir para Pagamento"
              )}
            </Button>
          </form>
        </Form>
      </div>
    );
  }

  // Fallback to the static form if we don't have sections from Supabase
  return (
    <div className="w-full max-w-3xl mx-auto bg-card border border-border rounded-lg p-6 shadow-lg">
      <QualificationFormHeader />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <BasicInfoSection form={form} />
          <PurposeSection form={form} />
          <TimelineSection form={form} />
          <ProjectDescriptionSection form={form} />
          <BudgetSection form={form} />
          <FeaturesSection form={form} />
          <ContractAcceptance form={form} />

          <Button 
            type="submit" 
            className="w-full bg-harmonia-green hover:bg-harmonia-green/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar e Prosseguir para Pagamento"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};
