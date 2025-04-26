
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus } from 'lucide-react';
import PreviewVersionInput from './PreviewVersionInput';

interface Version {
  title: string;
  description: string;
  audioUrl: string;
  recommended: boolean;
}

interface NewProjectFormProps {
  onAddProject: (project: any) => string | null;
}

const NewProjectForm: React.FC<NewProjectFormProps> = ({ onAddProject }) => {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [packageType, setPackageType] = useState('');
  const [versions, setVersions] = useState<Version[]>([
    { title: '', description: '', audioUrl: '', recommended: false }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const addVersion = () => {
    setVersions([...versions, { title: '', description: '', audioUrl: '', recommended: false }]);
  };

  const removeVersion = (index: number) => {
    if (versions.length > 1) {
      setVersions(versions.filter((_, i) => i !== index));
    } else {
      toast({
        title: "Não é possível remover",
        description: "O projeto precisa ter pelo menos uma versão.",
        variant: "destructive"
      });
    }
  };

  const updateVersion = (index: number, field: keyof Version, value: string | boolean) => {
    const updatedVersions = [...versions];
    updatedVersions[index] = { ...updatedVersions[index], [field]: value };
    
    // If this version is being marked as recommended, unmark others
    if (field === 'recommended' && value === true) {
      updatedVersions.forEach((v, i) => {
        if (i !== index) v.recommended = false;
      });
    }
    
    setVersions(updatedVersions);
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

    // Validate versions
    const hasEmptyVersions = versions.some(v => !v.title.trim() || !v.description.trim() || !v.audioUrl.trim());
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
      // Create the project with versions
      const project = {
        clientName: clientName.trim(),
        clientEmail: clientEmail.trim(),
        packageType,
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
          recommended: v.recommended
        }))
      };
      
      const newProjectId = onAddProject(project);
      
      if (newProjectId) {
        // Reset form
        setClientName('');
        setClientEmail('');
        setPackageType('');
        setVersions([{ title: '', description: '', audioUrl: '', recommended: false }]);
        
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="client-name">Nome do Cliente *</Label>
          <Input
            id="client-name"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Nome completo do cliente"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="client-email">Email do Cliente *</Label>
          <Input
            id="client-email"
            type="email"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
            placeholder="email@exemplo.com"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="package-type">Pacote *</Label>
        <Select 
          value={packageType} 
          onValueChange={setPackageType}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o pacote" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Essencial">Essencial</SelectItem>
            <SelectItem value="Premium">Premium</SelectItem>
            <SelectItem value="Profissional">Profissional</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Versões Musicais</h3>
          <Button type="button" onClick={addVersion} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Versão
          </Button>
        </div>

        {versions.map((version, index) => (
          <PreviewVersionInput
            key={index}
            index={index}
            title={version.title}
            description={version.description}
            audioUrl={version.audioUrl}
            recommended={version.recommended}
            onTitleChange={(i, value) => updateVersion(i, 'title', value)}
            onDescriptionChange={(i, value) => updateVersion(i, 'description', value)}
            onAudioUrlChange={(i, value) => updateVersion(i, 'audioUrl', value)}
            onRecommendedChange={(i, value) => updateVersion(i, 'recommended', value)}
            onRemove={removeVersion}
            canRemove={versions.length > 1}
          />
        ))}
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Criando...' : 'Criar Projeto'}
        </Button>
      </div>
    </form>
  );
};

export default NewProjectForm;
