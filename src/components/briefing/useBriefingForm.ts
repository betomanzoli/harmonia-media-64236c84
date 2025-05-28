
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres"
  }),
  email: z.string().email({
    message: "Email inválido"
  }),
  phone: z.string().min(5, {
    message: "Telefone é obrigatório"
  }),
  story: z.string().optional(),
  emotionsToTransmit: z.array(z.string()).optional(),
  musicReferences: z.array(z.string()).optional(),
  musicalStyle: z.string().optional(),
  specificInstruments: z.string().optional(),
  additionalComments: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const useBriefingForm = (initialPackage: 'essencial' | 'profissional' | 'premium' = 'essencial', initialData?: any) => {
  const [selectedPackage, setSelectedPackage] = useState<'essencial' | 'profissional' | 'premium'>(initialPackage);
  const [referenceFiles, setReferenceFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const defaultValues = {
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    story: initialData?.inspiration || '',
    emotionsToTransmit: initialData?.emotion ? [initialData.emotion] : [],
    specificInstruments: '',
    additionalComments: initialData?.specialConnection || '',
    musicalStyle: '',
  };
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });
  
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Create or get client
      const { data: clientsData, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('email', data.email)
        .limit(1);
      
      let clientId = null;
      
      if (clientError) {
        throw clientError;
      }
      
      if (clientsData && clientsData.length > 0) {
        clientId = clientsData[0].id;
        
        // Update client info if changed
        await supabase
          .from('clients')
          .update({
            name: data.name,
            phone: data.phone
          })
          .eq('id', clientId);
      } else {
        // Create a new client
        const { data: newClient, error: newClientError } = await supabase
          .from('clients')
          .insert([{
            name: data.name,
            email: data.email,
            phone: data.phone
          }])
          .select()
          .single();
        
        if (newClientError) {
          throw newClientError;
        }
        
        clientId = newClient.id;
      }
      
      // Create a project instead of briefing (since briefings table doesn't exist)
      const { error: projectError } = await supabase
        .from('projects')
        .insert([{
          title: `Projeto ${selectedPackage} - ${data.name}`,
          client_id: clientId,
          client_name: data.name,
          client_email: data.email,
          client_phone: data.phone,
          package_type: selectedPackage,
          status: 'waiting',
          description: data.story || 'Briefing enviado pelo formulário'
        }]);
      
      if (projectError) {
        throw projectError;
      }
      
      toast({
        title: "Sucesso!",
        description: "Seu briefing foi enviado com sucesso. Entraremos em contato em breve.",
      });
      
      form.reset();
    } catch (error: any) {
      console.error('Error submitting form:', error);
      
      toast({
        variant: "destructive",
        title: "Erro ao enviar formulário",
        description: error.message || "Não foi possível enviar o formulário. Tente novamente mais tarde.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    selectedPackage,
    setSelectedPackage,
    referenceFiles,
    setReferenceFiles,
    isSubmitting,
    onSubmit
  };
};
