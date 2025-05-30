
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Upload, ExternalLink } from 'lucide-react';
import { BandcampUtils } from '../bandcamp/BandcampUtils';

interface AddVersionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onAddVersion: (version: any) => void;
  isFinalVersion?: boolean;
  packageType?: string;
}

const AddVersionDialog: React.FC<AddVersionDialogProps> = ({
  isOpen,
  onOpenChange,
  projectId,
  onAddVersion,
  isFinalVersion = false,
  packageType
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    bandcampUrl: '',
    isFinal: isFinalVersion,
    isRecommended: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewEmbed, setPreviewEmbed] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira um nome para a versão.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.bandcampUrl.trim()) {
      toast({
        title: "URL do Bandcamp obrigatória",
        description: "Por favor, insira a URL do track no Bandcamp.",
        variant: "destructive"
      });
      return;
    }

    // Validate Bandcamp URL
    if (!BandcampUtils.isValidBandcampUrl(formData.bandcampUrl)) {
      toast({
        title: "URL inválida",
        description: "Por favor, insira uma URL válida do Bandcamp (album ou track).",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Extract track information from Bandcamp URL
      const trackInfo = BandcampUtils.createTrackInfoFromUrl(formData.bandcampUrl);
      
      if (!trackInfo) {
        throw new Error('Não foi possível extrair informações da URL do Bandcamp');
      }

      // Create version object with Bandcamp integration
      const newVersion = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        bandcampUrl: formData.bandcampUrl,
        albumId: trackInfo.albumId,
        trackId: trackInfo.trackId,
        embedUrl: trackInfo.embedUrl,
        audioUrl: trackInfo.directUrl,
        final: formData.isFinal,
        recommended: formData.isRecommended,
        dateAdded: new Date().toLocaleDateString('pt-BR')
      };

      console.log('Adding new version:', newVersion);

      // Call parent handler
      await onAddVersion(newVersion);

      // Reset form
      setFormData({
        name: '',
        description: '',
        bandcampUrl: '',
        isFinal: isFinalVersion,
        isRecommended: false
      });
      setPreviewEmbed('');

      onOpenChange(false);

      toast({
        title: "Versão adicionada",
        description: `${formData.name} foi adicionada com player do Bandcamp para track individual.`
      });

    } catch (error) {
      console.error('Erro ao adicionar versão:', error);
      toast({
        title: "Erro ao adicionar versão",
        description: "Não foi possível adicionar a versão. Verifique a URL do Bandcamp.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate embed preview when URL changes
    if (field === 'bandcampUrl' && value) {
      const embedUrl = BandcampUtils.autoGenerateEmbed(value);
      if (embedUrl) {
        setPreviewEmbed(embedUrl);
        
        // Auto-fill name if empty
        if (!formData.name) {
          const autoTitle = BandcampUtils.extractTrackTitle(value);
          setFormData(prev => ({ ...prev, name: autoTitle }));
        }
      } else {
        setPreviewEmbed('');
      }
    }
  };

  const testBandcampUrl = () => {
    if (formData.bandcampUrl) {
      window.open(formData.bandcampUrl, '_blank');
    }
  };

  const clearForm = () => {
    setFormData({
      name: '',
      description: '',
      bandcampUrl: '',
      isFinal: isFinalVersion,
      isRecommended: false
    });
    setPreviewEmbed('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isFinalVersion ? 'Adicionar Versão Final' : 'Adicionar Nova Versão'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="bandcampUrl">URL do Track no Bandcamp</Label>
            <div className="flex gap-2">
              <Input
                id="bandcampUrl"
                placeholder="https://harmonia-media.bandcamp.com/track/nome-da-track"
                value={formData.bandcampUrl}
                onChange={(e) => handleChange('bandcampUrl', e.target.value)}
                required
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={testBandcampUrl}
                disabled={!formData.bandcampUrl}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Cole a URL de um track específico do Bandcamp. O embed será gerado automaticamente.
            </p>
          </div>

          {/* Preview do Embed */}
          {previewEmbed && (
            <div className="border rounded p-3 bg-gray-50">
              <Label className="text-sm font-medium mb-2 block">Prévia do Player:</Label>
              <iframe
                src={previewEmbed}
                style={{ border: 0, width: '100%', height: '42px' }}
                title="Preview do Bandcamp"
                className="rounded"
              />
            </div>
          )}

          <div>
            <Label htmlFor="name">Nome da Versão</Label>
            <Input
              id="name"
              placeholder="Ex: Versão 1 - Mix Inicial"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Nome será preenchido automaticamente baseado na URL, mas você pode editar.
            </p>
          </div>

          <div>
            <Label htmlFor="description">Descrição (Opcional)</Label>
            <Textarea
              id="description"
              placeholder="Descreva as mudanças nesta versão..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="h-20"
            />
          </div>

          <div className="space-y-3">
            {!isFinalVersion && (
              <div className="flex items-center justify-between">
                <Label htmlFor="isFinal">Marcar como versão final</Label>
                <Switch
                  id="isFinal"
                  checked={formData.isFinal}
                  onCheckedChange={(checked) => handleChange('isFinal', checked)}
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <Label htmlFor="isRecommended">Versão recomendada</Label>
              <Switch
                id="isRecommended"
                checked={formData.isRecommended}
                onCheckedChange={(checked) => handleChange('isRecommended', checked)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                clearForm();
                onOpenChange(false);
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !previewEmbed}
              className="bg-harmonia-green hover:bg-harmonia-green/90"
            >
              {isSubmitting ? (
                <>
                  <Upload className="w-4 h-4 mr-2 animate-spin" />
                  Adicionando...
                </>
              ) : (
                'Adicionar Versão'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddVersionDialog;
