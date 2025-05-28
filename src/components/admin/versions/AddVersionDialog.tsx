
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import BandcampUtils from '../bandcamp/BandcampUtils';

interface AddVersionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddVersion: (formData: { name: string; description: string; bandcampUrl: string }) => Promise<void>;
  isProcessing: boolean;
}

const AddVersionDialog: React.FC<AddVersionDialogProps> = ({
  isOpen,
  onOpenChange,
  onAddVersion,
  isProcessing
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    bandcampUrl: ''
  });
  const [previewEmbed, setPreviewEmbed] = useState<string>('');
  const [embedError, setEmbedError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Auto-generate preview when URL changes
    if (name === 'bandcampUrl' && value) {
      setEmbedError('');
      try {
        console.log('Generating preview for URL:', value);
        
        if (BandcampUtils.isValidBandcampUrl(value)) {
          const embedUrl = BandcampUtils.autoGenerateEmbed(value);
          if (embedUrl) {
            setPreviewEmbed(embedUrl);
            console.log('Preview embed generated:', embedUrl);
            
            // Auto-fill name if empty
            if (!formData.name) {
              const autoTitle = BandcampUtils.extractTrackTitle(value);
              setFormData(prev => ({ ...prev, name: autoTitle }));
            }
          } else {
            setPreviewEmbed('');
            setEmbedError('Não foi possível gerar preview do embed');
          }
        } else {
          setPreviewEmbed('');
          setEmbedError('URL do Bandcamp inválida');
        }
      } catch (error) {
        console.error('Error generating preview:', error);
        setPreviewEmbed('');
        setEmbedError('Erro ao gerar preview');
      }
    } else if (name === 'bandcampUrl' && !value) {
      setPreviewEmbed('');
      setEmbedError('');
    }
  };

  const handleSubmit = async () => {
    await onAddVersion(formData);
    setFormData({ name: '', description: '', bandcampUrl: '' });
    setPreviewEmbed('');
    setEmbedError('');
  };

  const handleClose = () => {
    onOpenChange(false);
    setFormData({ name: '', description: '', bandcampUrl: '' });
    setPreviewEmbed('');
    setEmbedError('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Versão</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div>
            <Label htmlFor="bandcampUrl">URL do Bandcamp</Label>
            <Input
              id="bandcampUrl"
              name="bandcampUrl"
              placeholder="https://harmonia-media.bandcamp.com/track/nome-da-track"
              value={formData.bandcampUrl}
              onChange={handleChange}
            />
            <p className="text-xs text-gray-500 mt-1">
              Cole a URL completa do track no Bandcamp
            </p>
          </div>

          {/* Preview do embed com melhor tratamento de erro */}
          {formData.bandcampUrl && (
            <div className="border rounded p-3 bg-gray-50">
              <Label className="text-sm font-medium mb-2 block">Prévia do Embed:</Label>
              {embedError ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{embedError}</AlertDescription>
                </Alert>
              ) : previewEmbed ? (
                <div>
                  <div className="text-xs text-gray-600 mb-2">
                    URL: {previewEmbed}
                  </div>
                  <iframe
                    src={previewEmbed}
                    style={{ border: 0, width: '100%', height: '42px' }}
                    title="Preview do Bandcamp"
                    className="rounded"
                  />
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  Gerando preview...
                </div>
              )}
            </div>
          )}

          <div>
            <Label htmlFor="name">Nome da Versão</Label>
            <Input
              id="name"
              name="name"
              placeholder="Ex: Versão 1 - Demo Inicial"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Descreva as características desta versão..."
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="bg-harmonia-green hover:bg-harmonia-green/90"
              disabled={isProcessing || !previewEmbed}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
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
