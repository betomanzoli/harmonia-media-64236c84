
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCustomers } from '@/hooks/admin/useCustomers';
import { useProjects } from '@/hooks/admin/useProjects';
import { Loader2, Plus, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NewProjectFormData {
  title: string;
  description: string;
  clientId: string;
  packageType: string;
  deadline: string;
}

interface NewClientData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
}

interface NewProjectFormProps {
  onSuccess?: () => void;
}

const NewProjectForm: React.FC<NewProjectFormProps> = ({ onSuccess }) => {
  const { customers, isLoading: loadingCustomers, createCustomer } = useCustomers();
  const { createProject } = useProjects();
  const { toast } = useToast();
  const [showNewClientForm, setShowNewClientForm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
    watch
  } = useForm<NewProjectFormData>();

  const {
    register: registerClient,
    handleSubmit: handleSubmitClient,
    formState: { errors: clientErrors, isSubmitting: isSubmittingClient },
    reset: resetClient
  } = useForm<NewClientData>();

  const selectedClientId = watch('clientId');

  const onSubmit = async (data: NewProjectFormData) => {
    if (!data.clientId) {
      toast({
        title: "Erro",
        description: "Selecione um cliente para o projeto.",
        variant: "destructive"
      });
      return;
    }

    const projectData = {
      title: data.title,
      description: data.description,
      clientId: data.clientId,
      packageType: data.packageType,
      deadline: data.deadline ? new Date(data.deadline).toISOString() : undefined,
      status: 'waiting' as const
    };

    const result = await createProject(projectData);
    
    if (result) {
      reset();
      onSuccess?.();
    }
  };

  const onSubmitNewClient = async (clientData: NewClientData) => {
    const result = await createCustomer(clientData);
    
    if (result) {
      setValue('clientId', result.id);
      setShowNewClientForm(false);
      resetClient();
      toast({
        title: "Sucesso",
        description: "Cliente criado e selecionado para o projeto.",
      });
    }
  };

  if (loadingCustomers) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-harmonia-green" />
          <span className="ml-2">Carregando clientes...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Criar Novo Projeto</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="title">Título do Projeto *</Label>
              <Input
                id="title"
                {...register('title', { required: 'Título é obrigatório' })}
                placeholder="Nome do projeto"
              />
              {errors.title && (
                <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Descrição detalhada do projeto..."
                rows={3}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="clientId">Cliente *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewClientForm(!showNewClientForm)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Cliente
                </Button>
              </div>
              
              <Select onValueChange={(value) => setValue('clientId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-gray-500">{customer.email}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {!selectedClientId && (
                <p className="text-sm text-red-600 mt-1">Cliente é obrigatório</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="packageType">Tipo de Pacote</Label>
                <Select onValueChange={(value) => setValue('packageType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o pacote" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="essencial">Essencial</SelectItem>
                    <SelectItem value="profissional">Profissional</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="deadline">Prazo de Entrega</Label>
                <Input
                  id="deadline"
                  type="date"
                  {...register('deadline')}
                />
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting || !selectedClientId} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando Projeto...
                </>
              ) : (
                'Criar Projeto'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {showNewClientForm && (
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Novo Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitClient(onSubmitNewClient)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientName">Nome *</Label>
                  <Input
                    id="clientName"
                    {...registerClient('name', { required: 'Nome é obrigatório' })}
                    placeholder="Nome completo"
                  />
                  {clientErrors.name && (
                    <p className="text-sm text-red-600 mt-1">{clientErrors.name.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="clientEmail">Email *</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    {...registerClient('email', { 
                      required: 'Email é obrigatório',
                      pattern: {
                        value: /^\S+@\S+$/,
                        message: 'Email inválido'
                      }
                    })}
                    placeholder="email@exemplo.com"
                  />
                  {clientErrors.email && (
                    <p className="text-sm text-red-600 mt-1">{clientErrors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientPhone">Telefone</Label>
                  <Input
                    id="clientPhone"
                    {...registerClient('phone')}
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div>
                  <Label htmlFor="clientCompany">Empresa</Label>
                  <Input
                    id="clientCompany"
                    {...registerClient('company')}
                    placeholder="Nome da empresa"
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button type="submit" disabled={isSubmittingClient}>
                  {isSubmittingClient ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    'Criar Cliente'
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setShowNewClientForm(false);
                    resetClient();
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NewProjectForm;
