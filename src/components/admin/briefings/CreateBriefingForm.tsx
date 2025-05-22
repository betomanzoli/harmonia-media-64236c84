
import React from 'react';
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useCreateBriefingForm, BriefingFormValues } from '@/hooks/useCreateBriefingForm';
import ClientInfoSection from './FormSections/ClientInfoSection';
import PackageInfoSection from './FormSections/PackageInfoSection';
import FormFooter from './FormSections/FormFooter';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { usePreviewProjects } from '@/hooks/admin/usePreviewProjects';
import { useCustomers } from '@/hooks/admin/useCustomers';
import webhookService from '@/services/webhookService';

interface CreateBriefingFormProps {
  onClose: () => void;
  onSubmit: (data: BriefingFormValues) => void;
  initialData?: any;
}

const CreateBriefingForm: React.FC<CreateBriefingFormProps> = ({ onClose, onSubmit, initialData }) => {
  const { form, isSubmitting, handleSubmit } = useCreateBriefingForm({ 
    onSubmit,
    initialData
  });
  const { toast } = useToast();
  const { addProject } = usePreviewProjects();
  const { addCustomer, getCustomerByEmail } = useCustomers();

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
        
        // Enviar notificação de novo cliente
        await webhookService.sendItemNotification('new_customer', {
          name: data.name,
          email: data.email,
          phone: data.phone.fullNumber,
          createdAt: new Date().toISOString()
        });
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
      
      // Also add or update customer in the local storage system
      let existingCustomer = getCustomerByEmail(data.email);
      if (!existingCustomer) {
        addCustomer({
          name: data.name,
          email: data.email,
          phone: data.phone.fullNumber,
          status: 'active',
          projects: 1,
          createdAt: new Date().toISOString()
        });
      }
      
      // Generate a consistent project ID based on the briefing ID
      // Use the Supabase briefing ID directly to ensure consistency
      const projectId = newBriefing.id;
      
      // Create a preview project automatically linked to this briefing
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30); // 30-day expiration
      
      const previewProject = {
        id: projectId, // Use the same ID as the briefing
        clientName: data.name,
        clientEmail: data.email,
        clientPhone: data.phone.fullNumber,
        packageType: data.packageType,
        createdAt: new Date().toLocaleDateString('pt-BR'),
        status: 'waiting' as const,
        versions: 0,
        previewUrl: `/preview/${projectId}`,
        expirationDate: expirationDate.toLocaleDateString('pt-BR'),
        lastActivityDate: new Date().toLocaleDateString('pt-BR'),
        briefingId: newBriefing.id,
        versionsList: []
      };
      
      // Add the project with a specific ID instead of generating a new one
      addProject(previewProject);
      console.log(`Created project ${projectId} for briefing ${newBriefing.id}`);
      
      // Call the passed onSubmit to update the UI
      onSubmit(data);
      
      toast({
        title: "Briefing criado",
        description: `O briefing foi criado com sucesso e o projeto de prévia foi iniciado automaticamente.`
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
