
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { BandcampUtils } from '@/components/admin/bandcamp/BandcampUtils';
import { useProjects } from '@/hooks/admin/useProjects';

interface AddVersionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onAddVersion?: (version: any) => void;
  packageType?: string;
}

const AddVersionDialog: React.FC<AddVersionDialogProps> = ({
  isOpen,
  onOpenChange,
  projectId,
  onAddVersion,
  packageType
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [bandcampUrl, setBandcampUrl] = useState('');
  const [recommended, setRecommended] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { addVersionToProject } = useProjects();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe o nome da versão.",
        variant: "destructive"
      });
      return;
    }

    if (!bandcampUrl.trim()) {
      toast({
        title: "URL obrigatória",
        description: "Por favor, informe a URL do Bandcamp.",
        variant: "destructive"
      });
      return;
    }

    if (!BandcampUtils.validateBandcampUrl(bandcampUrl)) {
      toast({
        title: "URL inválida",
        description: "Por favor, informe uma URL válida do Bandcamp.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await addVersionToProject(projectId, {
        name: name.trim(),
        description: description.trim() || undefined,
        audio_url: bandcampUrl.trim(),
        recommended
      });

      if (result.success) {
        toast({
          title: "Versão adicionada",
          description: `${name} foi adicionada ao projeto com sucesso.`
        });

        // Limpar formulário
        setName('');
        setDescription('');
        setBandcampUrl('');
        setRecommended(false);
        
        // Fechar dialog
        onOpenChange(false);

        // Callback para o componente pai
        if (onAddVersion && result.version) {
          onAddVersion(result.version);
        }
      } else {
        toast({
          title: "Erro ao adicionar versão",
          description: result.error || "Ocorreu um erro inesperado.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error adding version:', error);
      toast({
        title: "Erro ao adicionar versão",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Versão</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome da Versão *</Label>
            <Input
              id="name"
              placeholder="Ex: Versão 1 - Mix Inicial"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descrição opcional da versão..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="bandcampUrl">URL do Bandcamp *</Label>
            <Input
              id="bandcampUrl"
              placeholder="https://artist.bandcamp.com/track/song-name"
              value={bandcampUrl}
              onChange={(e) => setBandcampUrl(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              URL da música no Bandcamp (será convertida automaticamente para embed)
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="recommended"
              checked={recommended}
              onCheckedChange={(checked) => setRecommended(checked as boolean)}
            />
            <Label htmlFor="recommended" className="text-sm">
              Marcar como versão recomendada
            </Label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-harmonia-green hover:bg-harmonia-green/90"
            >
              {isSubmitting ? 'Adicionando...' : 'Adicionar Versão'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddVersionDialog;
