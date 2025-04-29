
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import PreviewVersionInput from './PreviewVersionInput';
import { useToast } from "@/hooks/use-toast";
import { useNewProjectForm } from '@/hooks/admin/useNewProjectForm';
import ClientInfoForm from './ClientInfoForm';

interface NewProjectFormProps {
  onAddProject: (project: any) => string | null;
}

const NewProjectForm: React.FC<NewProjectFormProps> = ({ onAddProject }) => {
  const { 
    formState: { clientName, clientEmail, packageType, versions, isSubmitting },
    setters: { setClientName, setClientEmail, setPackageType, setIsSubmitting },
    actions: { addVersion, removeVersion, updateVersion, resetForm }
  } = useNewProjectForm();
  
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientName.trim() || !clientEmail.trim() || !packageType) {
      toast({
        title: "Informações incompletas",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const hasEmptyVersions = versions.some(v => 
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
    
    setIsSubmitting(true);
    
    try {
      const project = {
        clientName: clientName.trim(),
        clientEmail: clientEmail.trim(),
        packageType: packageType,
        createdAt: new Date().toLocaleDateString('pt-BR'),
        status: 'waiting' as const,
        versions: versions.length,
        previewUrl: '',
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
        lastActivityDate: new Date().toLocaleDateString('pt-BR'),
        versionsList: versions.map((v, index) => ({
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
        resetForm();
        toast({
          title: "Projeto criado com sucesso",
          description: `O projeto ${newProjectId} foi criado com ${versions.length} versão(ões).`,
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao criar projeto",
        description: "Ocorreu um erro ao criar o projeto. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Informações do Cliente</h3>
        
        <ClientInfoForm 
          clientName={clientName}
          clientEmail={clientEmail}
          packageType={packageType}
          onClientNameChange={setClientName}
          onClientEmailChange={setClientEmail}
          onPackageTypeChange={setPackageType}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Versões Musicais</h3>
          <Button type="button" onClick={addVersion} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Versão
          </Button>
        </div>

        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 pb-4">
          {versions.map((version, index) => (
            <div key={index} className="version-container">
              <PreviewVersionInput
                index={index}
                title={version.title}
                description={version.description}
                audioUrl={version.audioUrl}
                recommended={false}
                onTitleChange={(i, value) => updateVersion(i, 'title', value)}
                onDescriptionChange={(i, value) => updateVersion(i, 'description', value)}
                onAudioUrlChange={(i, value) => updateVersion(i, 'audioUrl', value)}
                onRecommendedChange={(i, value) => {}}
                onRemove={removeVersion}
                canRemove={versions.length > 1}
              />
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end sticky bottom-0 pt-4 bg-white">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Criando...' : 'Criar Projeto'}
        </Button>
      </div>
    </form>
  );
};

export default NewProjectForm;
