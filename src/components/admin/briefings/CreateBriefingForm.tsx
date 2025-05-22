
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from '@/lib/supabase';

interface CreateBriefingFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: {
    name?: string;
    email?: string;
    phone?: string;
    id?: string;
  };
}

const CreateBriefingForm: React.FC<CreateBriefingFormProps> = ({ 
  onClose, 
  onSubmit,
  initialData 
}) => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      packageType: '',
      description: ''
    }
  });

  // Set initial values if provided
  React.useEffect(() => {
    if (initialData) {
      setValue('name', initialData.name || '');
      setValue('email', initialData.email || '');
      setValue('phone', initialData.phone || '');
    }
  }, [initialData, setValue]);

  const handleFormSubmit = async (data: any) => {
    try {
      console.log("Form data to submit:", data);
      
      // Check if this is an existing client or a new one
      let clientId = initialData?.id;
      
      if (!clientId) {
        // Create a new client record
        const { data: newClient, error: clientError } = await supabase
          .from('clients')
          .insert({
            name: data.name,
            email: data.email,
            phone: data.phone || null
          })
          .select('id')
          .single();
        
        if (clientError) {
          throw clientError;
        }
        
        clientId = newClient.id;
        console.log("Created new client with ID:", clientId);
      }
      
      // Create the briefing record
      const { data: newBriefing, error: briefingError } = await supabase
        .from('briefings')
        .insert({
          client_id: clientId,
          package_type: data.packageType,
          status: 'pending',
          data: {
            description: data.description,
            clientName: data.name,
            clientEmail: data.email,
            packageType: data.packageType
          }
        })
        .select('id')
        .single();
      
      if (briefingError) {
        throw briefingError;
      }
      
      console.log("Created new briefing with ID:", newBriefing.id);
      
      // Pass the data to the parent component
      onSubmit({
        id: newBriefing.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        packageType: data.packageType,
        description: data.description,
        clientId: clientId
      });
    } catch (error) {
      console.error("Error creating briefing:", error);
      throw error;
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Criar Novo Briefing</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Cliente</Label>
            <Input
              id="name"
              placeholder="Nome completo"
              {...register("name", { required: "Nome é obrigatório" })}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message as string}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="cliente@exemplo.com"
              {...register("email", { required: "Email é obrigatório" })}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message as string}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              placeholder="(00) 00000-0000"
              {...register("phone")}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="packageType">Pacote</Label>
            <Select onValueChange={(value) => setValue("packageType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um pacote" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="essencial">Essencial</SelectItem>
                <SelectItem value="personalizado">Personalizado</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="arquivo">Arquivo</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
            {errors.packageType && (
              <p className="text-sm text-red-500">{errors.packageType.message as string}</p>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Descrição do Projeto</Label>
          <Textarea
            id="description"
            placeholder="Detalhes sobre o projeto..."
            className="min-h-[100px]"
            {...register("description", { required: "Descrição é obrigatória" })}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message as string}</p>
          )}
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">Criar Briefing</Button>
        </DialogFooter>
      </form>
    </>
  );
};

export default CreateBriefingForm;
