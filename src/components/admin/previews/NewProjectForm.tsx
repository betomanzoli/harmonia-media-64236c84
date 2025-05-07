
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNewProjectForm, PACKAGE_OPTIONS } from '@/hooks/useNewProjectForm';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const NewProjectForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { formState, setters, actions } = useNewProjectForm();

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
          phone: formState.clientPhone
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
      
      // Then create the project
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .insert({
          client_id: clientData.id,
          client_name: formState.clientName,
          title: `Música Personalizada - ${formState.clientName}`,
          package_id: null,  // You might want to look up the package ID based on packageType
          status: 'draft',
          preview_code: previewCode,
          tags: JSON.stringify(['new', formState.packageType]),
          description: `Projeto de música personalizada para ${formState.clientName} - Pacote ${formState.packageType}`
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
          event_type: 'creation',
          description: 'Projeto criado',
          new_value: JSON.stringify({
            client_name: formState.clientName,
            package_type: formState.packageType
          })
        });
      
      if (historyError) {
        console.error('Error creating project history:', historyError);
        // Non-critical, continue
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
      <div className="h-[85vh] overflow-y-auto pb-16">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
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
              
              <div>
                <Label htmlFor="clientPhone">Telefone</Label>
                <Input
                  id="clientPhone"
                  placeholder="(00) 00000-0000"
                  value={formState.clientPhone}
                  onChange={e => setters.setClientPhone(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
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
            </div>
          </div>
        </form>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t">
        <div className="max-w-7xl mx-auto px-4">
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={formState.isSubmitting}
          >
            {formState.isSubmitting ? 'Criando...' : 'Criar Projeto'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewProjectForm;
