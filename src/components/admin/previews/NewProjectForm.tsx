
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePreviewProjects } from '@/hooks/admin/usePreviewProjects';
import { useToast } from '@/hooks/use-toast';

interface NewProjectFormProps {
  onAddProject: (projectData: any) => void;
}

const NewProjectForm: React.FC<NewProjectFormProps> = ({ onAddProject }) => {
  const { addProject } = usePreviewProjects();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      clientName: '',
      clientEmail: '',
      packageType: 'essencial',
      description: ''
    }
  });
  
  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Calculate expiration date (30 days from now)
      const expDate = new Date();
      expDate.setDate(expDate.getDate() + 30);
      const expirationDate = expDate.toLocaleDateString('pt-BR');
      
      // Create project object
      const projectData = {
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        packageType: data.packageType,
        createdAt: new Date().toLocaleDateString('pt-BR'),
        status: 'waiting',
        versions: 0,
        previewUrl: '',
        expirationDate: expirationDate,
        lastActivityDate: new Date().toLocaleDateString('pt-BR'),
        description: data.description
      };
      
      // Add project and get ID
      const projectId = addProject(projectData);
      
      // Notify parent component
      onAddProject({
        ...projectData,
        id: projectId
      });
      
      // Show success message
      toast({
        title: "Projeto criado",
        description: `Projeto para ${data.clientName} criado com sucesso!`
      });
      
      // Reset form
      reset();
    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        title: "Erro",
        description: "Houve um erro ao criar o projeto. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-1">
            Nome do Cliente
          </label>
          <Input 
            id="clientName"
            placeholder="Nome do cliente"
            {...register('clientName', { required: "Nome do cliente é obrigatório" })}
            className={errors.clientName ? "border-red-500" : ""}
          />
          {errors.clientName && (
            <p className="text-red-500 text-xs mt-1">{errors.clientName.message?.toString()}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700 mb-1">
            Email do Cliente
          </label>
          <Input 
            id="clientEmail"
            type="email"
            placeholder="email@exemplo.com"
            {...register('clientEmail', { 
              required: "Email do cliente é obrigatório",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Email inválido"
              }
            })}
            className={errors.clientEmail ? "border-red-500" : ""}
          />
          {errors.clientEmail && (
            <p className="text-red-500 text-xs mt-1">{errors.clientEmail.message?.toString()}</p>
          )}
        </div>
      </div>
      
      <div>
        <label htmlFor="packageType" className="block text-sm font-medium text-gray-700 mb-1">
          Tipo de Pacote
        </label>
        <select
          id="packageType"
          {...register('packageType')}
          className="w-full p-2 border rounded-md"
        >
          <option value="essencial">Essencial</option>
          <option value="profissional">Profissional</option>
          <option value="premium">Premium</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Descrição do Projeto
        </label>
        <Textarea 
          id="description"
          placeholder="Detalhes adicionais sobre o projeto..."
          {...register('description')}
          className="h-24"
        />
      </div>
      
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-harmonia-green hover:bg-harmonia-green/90"
        >
          {isSubmitting ? "Criando..." : "Criar Projeto"}
        </Button>
      </div>
    </form>
  );
};

export default NewProjectForm;
