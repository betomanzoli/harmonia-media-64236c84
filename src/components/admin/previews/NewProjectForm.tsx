
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNewProjectForm, PACKAGE_OPTIONS, DEFAULT_EXTRA_SERVICES } from '@/hooks/useNewProjectForm';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import PhoneInput from '@/components/PhoneInput';
import ExtraServices from '@/components/admin/extras/ExtraServices';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const NewProjectForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { formState, setters, actions } = useNewProjectForm();
  const [activeTab, setActiveTab] = useState('client-info');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setters.setIsSubmitting(true);
    
    try {
      // First create the client
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .upsert({
          name: formState.clientName,
          email: formState.clientEmail,
          phone: formState.clientPhone.fullNumber
        }, {
          onConflict: 'email'  // If the email already exists, update the existing client
        })
        .select()
        .single();
      
      if (clientError) {
        console.error('Error creating client:', clientError);
        throw clientError;
      }
      
      // Generate a unique preview code
      const previewCode = `P${Math.floor(1000 + Math.random() * 9000)}`;
      
      // Get selected extra services
      const selectedExtras = formState.extras
        .filter(extra => extra.selected)
        .map(extra => ({ id: extra.id, name: extra.name, price: extra.price }));
      
      // Then create the project
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .insert({
          client_id: clientData.id,
          title: `Música Personalizada - ${formState.clientName}`,
          status: 'draft',
          preview_code: previewCode,
          description: `Projeto de música personalizada para ${formState.clientName} - Pacote ${formState.packageType}${selectedExtras.length > 0 ? ' com extras' : ''}`,
          // Store extra services in description JSON
          extras: JSON.stringify(selectedExtras)
        })
        .select()
        .single();
      
      if (projectError) {
        console.error('Error creating project:', projectError);
        throw projectError;
      }
      
      // Create history entry for project creation
      const { error: historyError } = await supabase
        .from('project_history')
        .insert({
          project_id: projectData.id,
          action: 'creation',
          description: 'Projeto criado',
          details: JSON.stringify({
            client_name: formState.clientName,
            package_type: formState.packageType,
            extras: selectedExtras
          })
        });
      
      if (historyError) {
        console.error('Error creating project history:', historyError);
        // Non-critical, continue
      }
      
      // Add versions if provided
      if (formState.versions.length > 0 && formState.versions[0].title) {
        const versionPromises = formState.versions.map(version => {
          return supabase
            .from('project_files')
            .insert({
              project_id: projectData.id,
              title: version.title,
              file_type: 'audio',
              drive_url: version.audioUrl
            });
        });
        
        await Promise.all(versionPromises).catch(error => {
          console.error('Error adding versions:', error);
          // Non-critical, continue
        });
      }
      
      toast({
        title: "Projeto criado com sucesso",
        description: `O projeto para ${formState.clientName} foi criado.`
      });
      
      // Redirect to project details page
      navigate(`/admin-j28s7d1k/previews/${projectData.id}`);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Erro ao criar projeto",
        description: "Ocorreu um erro ao criar o projeto. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setters.setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="client-info">Dados do Cliente</TabsTrigger>
          <TabsTrigger value="project-details">Detalhes do Projeto</TabsTrigger>
          <TabsTrigger value="extras">Serviços Extras</TabsTrigger>
        </TabsList>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <TabsContent value="client-info" className="space-y-4">
            <h2 className="text-lg font-semibold">Dados do Cliente</h2>
            
            <div className="grid gap-4">
              <div>
                <Label htmlFor="clientName">Nome do Cliente</Label>
                <Input
                  id="clientName"
                  placeholder="Nome completo do cliente"
                  value={formState.clientName}
                  onChange={e => setters.setClientName(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="clientEmail">Email</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  placeholder="email@exemplo.com"
                  value={formState.clientEmail}
                  onChange={e => setters.setClientEmail(e.target.value)}
                  required
                />
              </div>
              
              <PhoneInput
                label="Telefone"
                value={formState.clientPhone.fullNumber}
                onChange={phone => setters.setClientPhone(phone)}
              />
              
              <div className="flex justify-end mt-4">
                <Button 
                  type="button" 
                  onClick={() => setActiveTab('project-details')}
                >
                  Próximo
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="project-details" className="space-y-4">
            <h2 className="text-lg font-semibold">Detalhes do Projeto</h2>
            
            <div>
              <Label htmlFor="packageType">Tipo de Pacote</Label>
              <Select 
                value={formState.packageType} 
                onValueChange={setters.setPackageType}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o tipo de pacote" />
                </SelectTrigger>
                <SelectContent>
                  {PACKAGE_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Versões</h2>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={actions.addVersion}
                >
                  <Plus className="h-4 w-4 mr-1" /> Adicionar Versão
                </Button>
              </div>
              
              {formState.versions.map((version, index) => (
                <div key={index} className="space-y-3 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Versão {index + 1}</h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => actions.removeVersion(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                  
                  <div>
                    <Label htmlFor={`version-${index}-title`}>Título</Label>
                    <Input
                      id={`version-${index}-title`}
                      placeholder="Título da versão"
                      value={version.title}
                      onChange={e => actions.updateVersion(index, 'title', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`version-${index}-description`}>Descrição</Label>
                    <Textarea
                      id={`version-${index}-description`}
                      placeholder="Descrição da versão"
                      value={version.description}
                      onChange={e => actions.updateVersion(index, 'description', e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`version-${index}-audio`}>URL do Áudio</Label>
                    <Input
                      id={`version-${index}-audio`}
                      placeholder="https://drive.google.com/file/d/..."
                      value={version.audioUrl}
                      onChange={e => actions.updateVersion(index, 'audioUrl', e.target.value)}
                    />
                  </div>
                </div>
              ))}
              
              <div className="flex justify-between mt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setActiveTab('client-info')}
                >
                  Voltar
                </Button>
                <Button 
                  type="button" 
                  onClick={() => setActiveTab('extras')}
                >
                  Próximo
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="extras" className="space-y-4">
            <ExtraServices 
              services={formState.extras} 
              onServicesChange={setters.setExtras}
              editable={true}
            />
            
            <div className="flex justify-between mt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setActiveTab('project-details')}
              >
                Voltar
              </Button>
              <Button 
                type="submit"
                disabled={formState.isSubmitting}
              >
                {formState.isSubmitting ? 'Criando...' : 'Criar Projeto'}
              </Button>
            </div>
          </TabsContent>
        </form>
      </Tabs>
    </div>
  );
};

export default NewProjectForm;
