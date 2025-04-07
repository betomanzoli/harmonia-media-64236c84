
import React from "react";
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

  function onSubmit(data: ExtendedFormValues) {
    console.log("Form data:", data);
    
    // Remove the termsAccepted field before storing the qualification data
    const { termsAccepted, ...qualificationData } = data;
    
    // Store form data in localStorage to use it on the thank you page
    localStorage.setItem("qualificationData", JSON.stringify(qualificationData));
    
    // Show success toast
    toast({
      title: "Formulário enviado com sucesso!",
      description: "Obrigado pelo seu interesse. Estamos redirecionando você para a página de recomendações.",
    });
    
    // Redirect to thank you page
    setTimeout(() => {
      navigate("/agradecimento");
    }, 1500);
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
          >
            Enviar
          </Button>
        </form>
      </Form>
    </div>
  );
}
