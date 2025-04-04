
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { briefingFormSchema, BriefingFormValues } from './formSchema';

export const useBriefingForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceFiles, setReferenceFiles] = useState<File[]>([]);

  const form = useForm<BriefingFormValues>({
    resolver: zodResolver(briefingFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      contactPreference: "whatsapp",
      occasion: "",
      style: "",
      story: "",
      selectedPackage: "",
      referenceDescription: "",
    },
  });

  const onSubmit = async (data: BriefingFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Prepare form data to include files
      const formDataToSend = {
        ...data,
        referenceFilesCount: referenceFiles.length,
      };
      
      console.log("Form data to be sent:", formDataToSend);
      console.log("Reference files:", referenceFiles);
      
      // Simulate successful submission
      setTimeout(() => {
        toast({
          title: "Formulário enviado com sucesso!",
          description: "Entraremos em contato em breve para discutir seu projeto musical.",
        });
        
        form.reset();
        setReferenceFiles([]);
        setIsSubmitting(false);
        
        // Simulate Zapier/Make.com automation flow
        console.log("Zapier automation: Creating Trello card for new project");
        console.log("Zapier automation: Initiating Suno AI music generation task");
        console.log("Zapier automation: Scheduling Moises mastering task");
        
        // If contactPreference is whatsapp, open WhatsApp
        if (data.contactPreference === "whatsapp" && data.phone) {
          const phoneNumber = data.phone.replace(/\D/g, '');
          const message = `Olá! Acabo de enviar um briefing para a harmonIA. Meu nome é ${data.name} e gostaria de criar uma música para ${data.occasion}. Aguardo contato!`;
          window.open(`https://wa.me/5511999999999?text=${encodeURIComponent(message)}`, '_blank');
        }
      }, 1500);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Erro ao enviar formulário",
        description: "Ocorreu um erro ao enviar seu briefing. Por favor, tente novamente.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    referenceFiles,
    setReferenceFiles,
    onSubmit,
  };
};
