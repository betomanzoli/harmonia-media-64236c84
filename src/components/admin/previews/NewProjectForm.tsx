
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { usePreviewProjects } from '@/hooks/admin/usePreviewProjects';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash, CalendarDays, Upload } from 'lucide-react';
import ProjectVersionItem from '@/components/admin/previews/ProjectVersionItem';
import { notificationService } from '@/services/notificationService';

interface FormValues {
  clientName: string;
  clientEmail: string;
  packageType: string;
  expirationDays: string;
  notifyClient: boolean;
}

interface NewProjectFormProps {
  onAddProject?: (project: Omit<any, "id">) => string;
}

const NewProjectForm: React.FC<NewProjectFormProps> = ({ onAddProject }) => {
  const { addProject } = usePreviewProjects();
  const { toast } = useToast();
  const [versions, setVersions] = useState<{title: string; description: string; audioUrl: string}[]>([
    { title: '', description: '', audioUrl: '' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    defaultValues: {
      clientName: '',
      clientEmail: '',
      packageType: 'profissional',
      expirationDays: '7',
      notifyClient: true
    }
  });

  const onSubmit = async (data: FormValues) => {
    // Verificar se todas as versões têm título e descrição
    const invalidVersion = versions.find(v => !v.title || !v.description || !v.audioUrl);
    if (invalidVersion) {
      toast({
        title: "Informações incompletas",
        description: "Todas as versões precisam ter título, descrição e link do Google Drive.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Calcular data de expiração
    const today = new Date();
    const expirationDate = new Date();
    expirationDate.setDate(today.getDate() + parseInt(data.expirationDays));
    
    const formattedCreationDate = today.toLocaleDateString('pt-BR');
    const formattedExpirationDate = expirationDate.toLocaleDateString('pt-BR');
    
    // Criar projeto
    try {
      // Use the onAddProject prop if provided, otherwise use the hook's addProject function
      const projectId = onAddProject 
        ? onAddProject({
            clientName: data.clientName,
            clientEmail: data.clientEmail,
            packageType: data.packageType,
            createdAt: formattedCreationDate,
            status: 'waiting',
            versions: versions.length,
            previewUrl: '',
            expirationDate: formattedExpirationDate,
            lastActivityDate: formattedCreationDate
          })
        : addProject({
            clientName: data.clientName,
            clientEmail: data.clientEmail,
            packageType: data.packageType,
            createdAt: formattedCreationDate,
            status: 'waiting',
            versions: versions.length,
            previewUrl: '',
            expirationDate: formattedExpirationDate,
            lastActivityDate: formattedCreationDate
          });
      
      // Notificar sobre novo projeto
      if (data.notifyClient) {
        notificationService.notify('new_preview', {
          projectId,
          clientName: data.clientName,
          clientEmail: data.clientEmail,
          expirationDate: formattedExpirationDate
        });
      }
      
      toast({
        title: "Projeto criado com sucesso",
        description: `Projeto ${projectId} criado e ${versions.length} versões adicionadas.`,
      });
      
      // Limpar formulário
      form.reset();
      setVersions([{ title: '', description: '', audioUrl: '' }]);
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      toast({
        title: "Erro ao criar projeto",
        description: "Ocorreu um erro ao criar o projeto. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addVersion = () => {
    setVersions([...versions, { title: '', description: '', audioUrl: '' }]);
  };

  const removeVersion = (index: number) => {
    if (versions.length === 1) {
      toast({
        title: "Ação não permitida",
        description: "O projeto precisa ter pelo menos uma versão.",
        variant: "destructive"
      });
      return;
    }
    
    const newVersions = [...versions];
    newVersions.splice(index, 1);
    setVersions(newVersions);
  };

  const handleTitleChange = (index: number, value: string) => {
    const newVersions = [...versions];
    newVersions[index].title = value;
    setVersions(newVersions);
  };

  const handleDescriptionChange = (index: number, value: string) => {
    const newVersions = [...versions];
    newVersions[index].description = value;
    setVersions(newVersions);
  };

  const handleAudioUrlChange = (index: number, value: string) => {
    const newVersions = [...versions];
    newVersions[index].audioUrl = value;
    setVersions(newVersions);
  };

  return (
    <Card id="new-project-form" className="mb-20">
      <CardHeader>
        <CardTitle className="text-harmonia-green">Criar novo projeto de prévia</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="clientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do cliente</FormLabel>
                      <FormControl>
                        <Input {...field} required />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="clientEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email do cliente</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} required />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="packageType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pacote contratado</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um pacote" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="essencial">Essencial</SelectItem>
                          <SelectItem value="profissional">Profissional</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="expirationDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prazo para avaliação</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o prazo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="3">3 dias</SelectItem>
                          <SelectItem value="7">7 dias</SelectItem>
                          <SelectItem value="10">10 dias</SelectItem>
                          <SelectItem value="15">15 dias</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription className="flex items-center">
                        <CalendarDays className="h-3 w-3 mr-1" />
                        O cliente terá esse prazo para avaliar as versões
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Versões musicais</h3>
              
              <div className="space-y-4">
                {versions.map((version, index) => (
                  <ProjectVersionItem
                    key={index}
                    version={version}
                    index={index}
                    onRemove={removeVersion}
                    onTitleChange={handleTitleChange}
                    onDescriptionChange={handleDescriptionChange}
                    onAudioUrlChange={handleAudioUrlChange}
                  />
                ))}
              </div>
              
              <Button
                type="button"
                variant="outline"
                className="mt-4"
                onClick={addVersion}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar outra versão
              </Button>
            </div>
            
            <div className="border-t pt-6">
              <Button 
                type="submit" 
                className="w-full sm:w-auto bg-harmonia-green hover:bg-harmonia-green/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">
                      <svg className="h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    </span>
                    Criando projeto...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Criar projeto e notificar cliente
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default NewProjectForm;
