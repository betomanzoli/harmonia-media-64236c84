
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBriefings } from '@/hooks/admin/useBriefings';
import { Loader2 } from 'lucide-react';

interface CreateBriefingFormData {
  clientName: string;
  email: string;
  phone?: string;
  company?: string;
  projectDescription: string;
  packageType: 'essencial' | 'profissional' | 'premium';
  budget?: string;
  timeline?: string;
}

interface CreateBriefingFormProps {
  onSuccess?: () => void;
}

const CreateBriefingForm: React.FC<CreateBriefingFormProps> = ({ onSuccess }) => {
  const { createBriefing } = useBriefings();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset
  } = useForm<CreateBriefingFormData>();

  const onSubmit = async (data: CreateBriefingFormData) => {
    const result = await createBriefing(data);
    
    if (result) {
      reset();
      onSuccess?.();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar Novo Briefing</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clientName">Nome do Cliente *</Label>
              <Input
                id="clientName"
                {...register('clientName', { required: 'Nome é obrigatório' })}
                placeholder="Nome completo"
              />
              {errors.clientName && (
                <p className="text-sm text-red-600 mt-1">{errors.clientName.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register('email', { 
                  required: 'Email é obrigatório',
                  pattern: {
                    value: /^\S+@\S+$/,
                    message: 'Email inválido'
                  }
                })}
                placeholder="email@exemplo.com"
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                {...register('phone')}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div>
              <Label htmlFor="company">Empresa</Label>
              <Input
                id="company"
                {...register('company')}
                placeholder="Nome da empresa"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="projectDescription">Descrição do Projeto *</Label>
            <Textarea
              id="projectDescription"
              {...register('projectDescription', { required: 'Descrição é obrigatória' })}
              placeholder="Descreva o projeto musical..."
              rows={4}
            />
            {errors.projectDescription && (
              <p className="text-sm text-red-600 mt-1">{errors.projectDescription.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="packageType">Tipo de Pacote *</Label>
            <Select onValueChange={(value) => setValue('packageType', value as 'essencial' | 'profissional' | 'premium')}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o pacote" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="essencial">Essencial - R$ 297</SelectItem>
                <SelectItem value="profissional">Profissional - R$ 597</SelectItem>
                <SelectItem value="premium">Premium - R$ 997</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="budget">Orçamento</Label>
              <Input
                id="budget"
                {...register('budget')}
                placeholder="Ex: R$ 500"
              />
            </div>

            <div>
              <Label htmlFor="timeline">Prazo</Label>
              <Input
                id="timeline"
                {...register('timeline')}
                placeholder="Ex: 2 semanas"
              />
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando Briefing...
              </>
            ) : (
              'Criar Briefing'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateBriefingForm;
