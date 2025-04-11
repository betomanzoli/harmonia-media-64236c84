
import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { 
  briefingFormSchema, 
  BriefingFormValues,
  essentialPackageSchema,
  professionalPackageSchema,
  premiumPackageSchema 
} from './formSchema';
import { useLocation, useNavigate } from 'react-router-dom';

export const useBriefingForm = (initialPackage?: 'essencial' | 'profissional' | 'premium') => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceFiles, setReferenceFiles] = useState<File[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState<'essencial' | 'profissional' | 'premium'>(
    initialPackage || 'essencial'
  );

  useEffect(() => {
    if (initialPackage) {
      setSelectedPackage(initialPackage);
    }
  }, [initialPackage]);

  const getSchemaResolver = () => {
    switch (selectedPackage) {
      case 'essencial':
        return zodResolver(essentialPackageSchema);
      case 'profissional':
        return zodResolver(professionalPackageSchema);
      case 'premium':
        return zodResolver(premiumPackageSchema);
      default:
        return zodResolver(essentialPackageSchema);
    }
  };

  const form = useForm<BriefingFormValues>({
    resolver: getSchemaResolver(),
    defaultValues: {
      selectedPackage,
      name: "",
      email: "",
      phone: "",
      contactPreference: "whatsapp",
      referenceDescription: "",
    },
  });

  useEffect(() => {
    form.setValue('selectedPackage', selectedPackage);
  }, [selectedPackage, form]);

  useEffect(() => {
    const userData = localStorage.getItem('qualificationData');
    if (userData) {
      try {
        const data = JSON.parse(userData);
        if (data.name) form.setValue('name', data.name);
        if (data.email) form.setValue('email', data.email);
        if (data.phone) form.setValue('phone', data.phone);
      } catch (e) {
        console.error('Error parsing user data from localStorage:', e);
      }
    }

    // Verificar se o pagamento foi realizado
    const paymentData = localStorage.getItem('paymentData');
    if (!paymentData) {
      toast({
        title: "Pagamento não detectado",
        description: "Por favor, realize o pagamento antes de preencher o briefing.",
        variant: "destructive"
      });
    }
  }, [form, toast]);

  const onSubmit = async (data: BriefingFormValues) => {
    // Verificar se o pagamento foi realizado
    const paymentData = localStorage.getItem('paymentData');
    if (!paymentData) {
      toast({
        title: "Pagamento não detectado",
        description: "Por favor, realize o pagamento antes de preencher o briefing.",
        variant: "destructive"
      });
      navigate('/services');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formDataToSend = {
        ...data,
        referenceFilesCount: referenceFiles.length,
      };
      
      console.log("Form data to be sent:", formDataToSend);
      console.log("Reference files:", referenceFiles);
      
      setTimeout(() => {
        toast({
          title: "Formulário enviado com sucesso!",
          description: "Entraremos em contato em breve para discutir seu projeto musical.",
        });
        
        // Criar um ID de pedido fictício para simulação
        const orderId = `HAR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        
        // Armazenar dados do pedido para rastreamento
        localStorage.setItem('orderData', JSON.stringify({
          orderId,
          clientName: data.name,
          packageType: selectedPackage === 'essencial' ? 'Essencial' : 
                       selectedPackage === 'profissional' ? 'Profissional' : 'Premium',
          status: 'Em Análise',
          dateSubmitted: new Date().toISOString(),
          contactPreference: data.contactPreference
        }));
        
        form.reset();
        setReferenceFiles([]);
        setIsSubmitting(false);
        
        console.log("Zapier automation: Creating Trello card for new project");
        console.log("Zapier automation: Initiating Suno AI music generation task");
        console.log("Zapier automation: Scheduling Moises mastering task");
        
        // Redirecionar para a página de agradecimento
        navigate('/agradecimento');
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
    selectedPackage,
    setSelectedPackage
  };
};
