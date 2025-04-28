
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import PreviewVersionInput from './PreviewVersionInput';
import ClientInfoForm from './ClientInfoForm';
import { useToast } from "@/hooks/use-toast";
import { useNewProjectForm } from '@/hooks/admin/useNewProjectForm';

interface NewProjectFormProps {
  onAddProject: (project: any) => string | null;
}

const NewProjectForm: React.FC<NewProjectFormProps> = ({ onAddProject }) => {
  const { formState, setters, actions } = useNewProjectForm();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formState.clientName.trim() || !formState.clientEmail.trim() || !formState.packageType) {
      toast({
        title: "Informações incompletas",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const hasEmptyVersions = formState.versions.some(v => 
      !v.title.trim() || !v.description.trim() || !v.audioUrl.trim()
    );
    
    if (hasEmptyVersions) {
      toast({
        title: "Versões incompletas",
        description: "Por favor, preencha todas as informações das versões.",
        variant: "destructive"
      });
      return;
    }
    
    setters.setIsSubmitting(true);
    
    try {
      const project = {
        clientName: formState.clientName.trim(),
        clientEmail: formState.clientEmail.trim(),
        packageType: formState.packageType,
        createdAt: new Date().toLocaleDateString('pt-BR'),
        status: 'waiting' as const,
        versions: formState.versions.length,
        previewUrl: '',
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
        lastActivityDate: new Date().toLocaleDateString('pt-BR'),
        versionsList: formState.versions.map((v, index) => ({
          id: `v${index + 1}`,
          name: v.title,
          description: v.description,
          audioUrl: v.audioUrl,
          dateAdded: new Date().toLocaleDateString('pt-BR'),
          // Extract fileId from Google Drive URL
          fileId: v.audioUrl.match(/[-\w]{25,}/) ? v.audioUrl.match(/[-\w]{25,}/)![0] : ''
        }))
      };
      
      const newProjectId = onAddProject(project);
      
      if (newProjectId) {
        actions.resetForm();
        toast({
          title: "Projeto criado com sucesso",
          description: `O projeto ${newProjectId} foi criado com ${formState.versions.length} versão(ões).`,
        });
      }
    } catch (error) {
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
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
      <ClientInfoForm 
        clientName={formState.clientName}
        clientEmail={formState.clientEmail}
        packageType={formState.packageType}
        onClientNameChange={setters.setClientName}
        onClientEmailChange={setters.setClientEmail}
        onPackageTypeChange={setters.setPackageType}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Versões Musicais</h3>
          <Button type="button" onClick={actions.addVersion} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Versão
          </Button>
        </div>

        <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 pb-4">
          {formState.versions.map((version, index) => (
            <div key={index} className="version-container">
              <PreviewVersionInput
                index={index}
                title={version.title}
                description={version.description}
                audioUrl={version.audioUrl}
                recommended={false}
                onTitleChange={(i, value) => actions.updateVersion(i, 'title', value)}
                onDescriptionChange={(i, value) => actions.updateVersion(i, 'description', value)}
                onAudioUrlChange={(i, value) => actions.updateVersion(i, 'audioUrl', value)}
                onRecommendedChange={() => {}}
                onRemove={actions.removeVersion}
                canRemove={formState.versions.length > 1}
                hideRecommended={true}
              />
              {index < formState.versions.length - 1 && (
                <div className="mt-2 mb-4 flex justify-end">
                  <Button 
                    type="button" 
                    onClick={actions.addVersion} 
                    variant="outline"
                    size="sm"
                    className="text-sm"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Adicionar outra versão
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end sticky bottom-0 pt-4 bg-white">
        <Button type="submit" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? 'Criando...' : 'Criar Projeto'}
        </Button>
      </div>
    </form>
  );
};

export default NewProjectForm;
