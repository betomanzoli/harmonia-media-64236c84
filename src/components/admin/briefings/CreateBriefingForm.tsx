
import React from 'react';
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useCreateBriefingForm, BriefingFormValues } from '@/hooks/useCreateBriefingForm';
import ClientInfoSection from './FormSections/ClientInfoSection';
import PackageInfoSection from './FormSections/PackageInfoSection';
import FormFooter from './FormSections/FormFooter';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface CreateBriefingFormProps {
  onClose: () => void;
  onSubmit: (data: BriefingFormValues) => void;
}

const CreateBriefingForm: React.FC<CreateBriefingFormProps> = ({ onClose, onSubmit }) => {
  const { form, isSubmitting, handleSubmit } = useCreateBriefingForm({ onSubmit });
  const { toast } = useToast();

  const processFormSubmit = async (data: BriefingFormValues) => {
    try {
      // First, check if client exists or create a new one
      let clientId: string | null = null;
      
      const { data: existingClients, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('email', data.email)
        .limit(1);
      
      if (clientError) {
        throw clientError;
      }
      
      if (existingClients && existingClients.length > 0) {
        clientId = existingClients[0].id;
        
        // Atualizar informações do cliente caso tenha mudado
        await supabase
          .from('clients')
          .update({
            name: data.name,
            phone: data.phone.fullNumber // Armazenar no formato internacional
          })
          .eq('id', clientId);
      } else {
        // Create a new client
        const { data: newClient, error: newClientError } = await supabase
          .from('clients')
          .insert([
            {
              name: data.name,
              email: data.email,
              phone: data.phone.fullNumber // Armazenar no formato internacional
            }
          ])
          .select()
          .single();
        
        if (newClientError) {
          throw newClientError;
        }
        
        clientId = newClient.id;
      }
      
      // Create the briefing
      const { data: newBriefing, error: briefingError } = await supabase
        .from('briefings')
        .insert([
          {
            client_id: clientId,
            package_type: data.packageType as 'essencial' | 'profissional' | 'premium' | 'qualification',
            status: 'pending',
            data: {
              description: data.description || 'Novo briefing',
              name: data.name,
              email: data.email,
              phone: data.phone.fullNumber,
              // Incluir todos os campos importantes para garantir consistência
              packageType: data.packageType,
              createdAt: new Date().toISOString(),
            }
          }
        ])
        .select()
        .single();
      
      if (briefingError) {
        throw briefingError;
      }
      
      // Call the passed onSubmit to update the UI
      onSubmit(data);
      
      toast({
        title: "Briefing criado",
        description: `O briefing foi criado com sucesso.`
      });
      
    } catch (error: any) {
      console.error('Error creating briefing:', error);
      toast({
        title: "Erro ao criar briefing",
        description: error.message || "Não foi possível criar o briefing",
        variant: "destructive"
      });
      
      // Re-throw so the form stays in error state
      throw error;
    }
  };

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle>Criar Novo Briefing</DialogTitle>
        <DialogDescription>
          Preencha os detalhes abaixo para adicionar um novo briefing.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(data => handleSubmit(data, processFormSubmit))} className="space-y-4">
          <ClientInfoSection form={form} />
          <PackageInfoSection form={form} />
          <FormFooter isSubmitting={isSubmitting} onClose={onClose} />
        </form>
      </Form>
    </div>
  );
};

export default CreateBriefingForm;
