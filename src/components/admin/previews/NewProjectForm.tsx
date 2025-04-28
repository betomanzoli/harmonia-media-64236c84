
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import PreviewVersionInput from './PreviewVersionInput';
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface NewProjectFormProps {
  onAddProject: (project: any) => string | null;
}

const NewProjectForm: React.FC<NewProjectFormProps> = ({ onAddProject }) => {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [packageType, setPackageType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [versions, setVersions] = useState([
    { title: 'Versão 1', description: 'Primeira opção musical', audioUrl: '' }
  ]);
  const { toast } = useToast();

  const addVersion = () => {
    setVersions([
      ...versions,
      { title: `Versão ${versions.length + 1}`, description: `Opção musical ${versions.length + 1}`, audioUrl: '' }
    ]);
  };

  const updateVersion = (index: number, field: string, value: string) => {
    const updatedVersions = [...versions];
    updatedVersions[index] = { ...updatedVersions[index], [field]: value };
    setVersions(updatedVersions);
  };

  const removeVersion = (index: number) => {
    if (versions.length > 1) {
      const updatedVersions = [...versions];
      updatedVersions.splice(index, 1);
      setVersions(updatedVersions);
    }
  };

  const resetForm = () => {
    setClientName('');
    setClientEmail('');
    setPackageType('');
    setVersions([{ title: 'Versão 1', description: 'Primeira opção musical', audioUrl: '' }]);
  };

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="clientName" className="block text-sm font-medium">Nome do Cliente</label>
            <Input
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Ex: João Silva"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="clientEmail" className="block text-sm font-medium">Email do Cliente</label>
            <Input
              id="clientEmail"
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="Ex: joao@exemplo.com"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="packageType" className="block text-sm font-medium">Tipo de Pacote</label>
          <Select value={packageType} onValueChange={setPackageType}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um pacote" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Essencial">Essencial</SelectItem>
              <SelectItem value="Premium">Premium</SelectItem>
              <SelectItem value="Personalizado">Personalizado</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
