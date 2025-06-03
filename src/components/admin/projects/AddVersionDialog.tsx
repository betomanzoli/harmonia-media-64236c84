
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useProjects } from '@/hooks/admin/useProjects';
import { Loader2 } from 'lucide-react';
import { BandcampUtils } from '../bandcamp/BandcampUtils';

interface AddVersionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  packageType?: string;
}

const AddVersionDialog: React.FC<AddVersionDialogProps> = ({
  isOpen,
  onOpenChange,
  projectId,
  packageType
}) => {
  const { toast } = useToast();
  const { addVersionToProject } = useProjects();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    bandcampInput: '',
    recommended: false
  });

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira um nome para a versão.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.bandcampInput.trim()) {
      toast({
        title: "Link ou código obrigatório",
        description: "Por favor, insira um link do Bandcamp ou código embed.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Processar o input do Bandcamp
      const processed = BandcampUtils.processInput(formData.bandcampInput);
      
      let audio_url = '';
      let embed_url = '';
      let bandcamp_private_url = '';
      let original_bandcamp_url = '';

      if (processed.isPrivateLink) {
        // Para links privados, armazenar o link diretamente
        bandcamp_private_url = processed.originalUrl || formData.bandcampInput;
        audio_url = bandcamp_private_url;
      } else if (processed.embedUrl) {
        // Para links normais, usar o embed
        embed_url = processed.embedUrl;
        audio_url = processed.embedUrl;
        original_bandcamp_url = processed.originalUrl || '';
      } else {
        toast({
          title: "URL inválida",
          description: "Não foi possível processar o link do Bandcamp fornecido.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      // Criar a versão
      const result = await addVersionToProject(projectId, {
        name: formData.name,
        description: formData.description,
        audio_url,
        embed_url,
        bandcamp_private_url,
        original_bandcamp_url,
        recommended: formData.recommended
      });

      if (result.success) {
        toast({
          title: "Versão adicionada!",
          description: `A versão "${formData.name}" foi criada com sucesso.`
        });
        
        // Reset form
        setFormData({
          name: '',
          description: '',
          bandcampInput: '',
          recommended: false
        });
        
        onOpenChange(false);
      } else {
        toast({
          title: "Erro ao criar versão",
          description: result.error || "Ocorreu um erro inesperado.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error creating version:", error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao criar a versão.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Versão</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div>
            <Label htmlFor="name">Nome da Versão</Label>
            <Input
              id="name"
              placeholder="Ex: Versão Final, Mix 1, etc."
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Descreva as características desta versão..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="bandcampInput">Link ou Código do Bandcamp</Label>
            <Textarea
              id="bandcampInput"
              placeholder="Cole aqui o link do Bandcamp, código embed ou link privado"
              value={formData.bandcampInput}
              onChange={(e) => handleChange('bandcampInput', e.target.value)}
              rows={4}
            />
            <div className="mt-2 text-sm text-gray-600">
              <p><strong>Aceita:</strong></p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Links diretos (ex: https://harmonia-media.bandcamp.com/track/...)</li>
                <li>Códigos embed (&lt;iframe src="..."&gt;...&lt;/iframe&gt;)</li>
                <li>Links privados (ex: https://bandcamp.com/private/...)</li>
              </ul>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="recommended"
              checked={formData.recommended}
              onChange={(e) => handleChange('recommended', e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="recommended">Marcar como versão recomendada</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-harmonia-green hover:bg-harmonia-green/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                'Adicionar Versão'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddVersionDialog;
