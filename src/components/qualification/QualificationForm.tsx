
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { formSchema, FormValues } from "./qualificationFormSchema";
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
import emailService from "@/services/emailService";
import { Loader2 } from "lucide-react";

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
      let saveSuccess = true;
      
      try {
        // 1. Salvar os dados na tabela do Supabase
        const { error } = await supabase
          .from('qualification_submissions')
          .insert([
            { 
              ...qualificationData,
              status: 'pending', 
              created_at: new Date().toISOString()
            }
          ]);

        if (error) {
          console.error("Erro ao salvar qualificação:", error);
          saveSuccess = false;
        }
      } catch (err) {
        console.error("Erro na conexão com o Supabase:", err);
        saveSuccess = false;
      }

      // 2. Enviar email de confirmação para o cliente (assíncrono)
      if (data.email) {
        try {
          emailService.sendBriefingConfirmation(data.email, data.name || "Cliente")
            .then(result => {
              if (!result.success) {
                console.warn("Falha ao enviar email de confirmação:", result.error);
              }
            });
        } catch (err) {
          console.warn("Erro ao tentar enviar email:", err);
        }
      }
      
      // Store form data in localStorage to use it on the thank you page
      localStorage.setItem("qualificationData", JSON.stringify({
        ...qualificationData,
        termsAccepted // Include termsAccepted to match QualificationData type
      }));
      
      // Show success toast
      toast({
        title: "Formulário enviado com sucesso!",
        description: saveSuccess 
          ? "Você será redirecionado para a página de pagamento."
          : "Dados salvos localmente. Redirecionando para pagamento.",
      });
      
      // Determinar pacote recomendado
      const recommendedPackage = getRecommendedPackage({
        ...qualificationData,
        termsAccepted // Include termsAccepted to match QualificationData type
      });
      
      // Redirect to payment page with recommended package
      setTimeout(() => {
        navigate(`/pagamento/${recommendedPackage}`);
      }, 1500);
    } catch (err) {
      console.error("Erro na submissão:", err);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  }

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
              "Enviar"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
