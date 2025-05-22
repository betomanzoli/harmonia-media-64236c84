
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash } from 'lucide-react';
import { VersionItem } from '@/hooks/admin/usePreviewProjects';
import { useToast } from '@/hooks/use-toast';

interface AdditionalLink {
  label: string;
  url: string;
}

interface AddVersionFormProps {
  projectId: string;
  onAddVersion: (version: VersionItem) => void;
  onCancel: () => void;
  isFinalVersion?: boolean;
  packageType?: string;  // Added packageType property
}

const AddVersionForm: React.FC<AddVersionFormProps> = ({ 
  projectId, 
  onAddVersion, 
  onCancel,
  isFinalVersion = false,
  packageType
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [recommended, setRecommended] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [additionalLinks, setAdditionalLinks] = useState<AdditionalLink[]>([]);
  const { toast } = useToast();

  const handleAddLink = () => {
    setAdditionalLinks([...additionalLinks, { label: '', url: '' }]);
  };

  const handleRemoveLink = (index: number) => {
    setAdditionalLinks(additionalLinks.filter((_, i) => i !== index));
  };

  const updateLinkLabel = (index: number, label: string) => {
    const updatedLinks = [...additionalLinks];
    updatedLinks[index].label = label;
    setAdditionalLinks(updatedLinks);
  };

  const updateLinkUrl = (index: number, url: string) => {
    const updatedLinks = [...additionalLinks];
    updatedLinks[index].url = url;
    setAdditionalLinks(updatedLinks);
  };

  const validateForm = () => {
    if (!title.trim()) {
      toast({
        title: "Título obrigatório",
        description: "Por favor, informe um título para a versão.",
        variant: "destructive"
      });
      return false;
    }

    if (!audioUrl.trim()) {
      toast({
        title: "URL de áudio obrigatória",
        description: "Por favor, informe a URL do áudio principal.",
        variant: "destructive"
      });
      return false;
    }

    // Check if all additional links have both label and URL
    if (additionalLinks.some(link => !link.label.trim() || !link.url.trim())) {
      toast({
        title: "Links adicionais incompletos",
        description: "Todos os links adicionais devem ter um rótulo e uma URL.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Extract Google Drive file ID if possible
      const fileIdMatch = audioUrl.match(/[-\w]{25,}/);
      const fileId = fileIdMatch ? fileIdMatch[0] : '';
      
      const newVersion: VersionItem = {
        id: `v${Date.now()}`,
        name: title,
        description,
        audioUrl,
        fileId,
        dateAdded: new Date().toLocaleDateString('pt-BR'),
        recommended,
        final: isFinalVersion,
        additionalLinks: additionalLinks.length > 0 ? additionalLinks : undefined
      };
      
      onAddVersion(newVersion);
      toast({
        title: isFinalVersion ? "Versão final adicionada" : "Versão adicionada",
        description: `"${title}" foi adicionada com sucesso.`
      });
    } catch (error) {
      console.error('Erro ao adicionar versão:', error);
      toast({
        title: "Erro ao adicionar versão",
        description: "Ocorreu um erro ao adicionar a versão. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Título da Versão</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={isFinalVersion ? "Ex: Versão Final" : "Ex: Versão Acústica"}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={isFinalVersion ? "Detalhes sobre a versão final" : "Detalhes sobre esta versão"}
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="audioUrl">URL do Google Drive (principal)</Label>
        <Input
          id="audioUrl"
          value={audioUrl}
          onChange={(e) => setAudioUrl(e.target.value)}
          placeholder="https://drive.google.com/file/d/..."
          required
        />
      </div>
      
      {isFinalVersion && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Links Adicionais (Stems, etc)</Label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={handleAddLink}
            >
              <Plus className="w-4 h-4 mr-1" /> Adicionar Link
            </Button>
          </div>
          
          {additionalLinks.map((link, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-4">
                <Input
                  value={link.label}
                  onChange={(e) => updateLinkLabel(index, e.target.value)}
                  placeholder="Tipo (Ex: Vocal Stem)"
                />
              </div>
              <div className="col-span-7">
                <Input
                  value={link.url}
                  onChange={(e) => updateLinkUrl(index, e.target.value)}
                  placeholder="https://drive.google.com/file/d/..."
                />
              </div>
              <div className="col-span-1">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleRemoveLink(index)}
                >
                  <Trash className="w-4 h-4 text-gray-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isFinalVersion && (
        <div className="flex items-center space-x-2">
          <Switch 
            id="recommended"
            checked={recommended}
            onCheckedChange={setRecommended}
          />
          <Label htmlFor="recommended">Marcar como recomendada</Label>
        </div>
      )}
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar Versão'}
        </Button>
      </div>
    </form>
  );
};

export default AddVersionForm;
