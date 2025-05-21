
import { useState } from 'react';
import { VersionItem } from '@/types/preview.types';
import { useToast } from '@/hooks/use-toast';

interface AdditionalLink {
  label: string;
  url: string;
}

export const useAddVersionForm = (
  projectId: string, 
  onAddVersion: (version: VersionItem) => void, 
  isFinalVersion: boolean
) => {
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

  return {
    title,
    setTitle,
    description,
    setDescription,
    audioUrl,
    setAudioUrl,
    recommended,
    setRecommended,
    additionalLinks,
    isLoading,
    handleAddLink,
    handleRemoveLink,
    updateLinkLabel,
    updateLinkUrl,
    handleSubmit
  };
};
