
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';
import BandcampUtils from '../bandcamp/BandcampUtils';

interface AddVersionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddVersion: (formData: { 
    name: string; 
    description: string; 
    audioUrl: string;
    fileId?: string;
    recommended: boolean;
    final?: boolean;
  }) => Promise<void>;
  isProcessing?: boolean;
  projectId: string;
  isFinalVersion?: boolean;
  packageType?: string;
}

const AddVersionDialog: React.FC<AddVersionDialogProps> = ({
  isOpen,
  onOpenChange,
  onAddVersion,
  isProcessing = false,
  isFinalVersion = false,
  packageType = 'essencial'
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    audioUrl: '',
    recommended: false
  });
  const [previewEmbed, setPreviewEmbed] = useState<string>('');
  const [embedError, setEmbedError] = useState<string>('');
  const [urlType, setUrlType] = useState<'bandcamp' | 'drive' | 'other'>('bandcamp');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Auto-detectar tipo de URL e gerar preview
    if (name === 'audioUrl' && value) {
      setEmbedError('');
      
      if (value.includes('bandcamp.com')) {
        setUrlType('bandcamp');
        try {
          if (BandcampUtils.isValidBandcampUrl(value)) {
            const embedUrl = BandcampUtils.autoGenerateEmbed(value);
            if (embedUrl) {
              setPreviewEmbed(embedUrl);
              console.log('Bandcamp preview generated:', embedUrl);
              
              // Auto-fill name if empty
              if (!formData.name) {
                const autoTitle = BandcampUtils.extractTrackTitle(value);
                setFormData(prev => ({ ...prev, name: autoTitle }));
              }
            } else {
              setEmbedError('Não foi possível gerar preview do embed do Bandcamp');
            }
          } else {
            setEmbedError('URL do Bandcamp inválida');
          }
        } catch (error) {
          console.error('Error generating Bandcamp preview:', error);
          setEmbedError('Erro ao gerar preview do Bandcamp');
        }
      } else if (value.includes('drive.google.com')) {
        setUrlType('drive');
        const fileIdMatch = value.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
        if (fileIdMatch) {
          setPreviewEmbed(`Preview: Arquivo do Google Drive (ID: ${fileIdMatch[1]})`);
        } else {
          setEmbedError('URL do Google Drive inválida. Use o formato de compartilhamento correto.');
        }
      } else {
        setUrlType('other');
        setPreviewEmbed('Preview: URL de áudio externa');
      }
    } else if (name === 'audioUrl' && !value) {
      setPreviewEmbed('');
      setEmbedError('');
      setUrlType('bandcamp');
    }
  };

  const handleRecommendedChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, recommended: checked }));
  };

  const extractGoogleDriveFileId = (url: string): string | null => {
    const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
    return fileIdMatch ? fileIdMatch[1] : null;
  };

  const handleSubmit = async () => {
    const versionData = {
      name: formData.name,
      description: formData.description,
      audioUrl: formData.audioUrl,
      recommended: formData.recommended,
      final: isFinalVersion
    };

    // Adicionar fileId se for Google Drive
    if (urlType === 'drive') {
      const fileId = extractGoogleDriveFileId(formData.audioUrl);
      if (fileId) {
        (versionData as any).fileId = fileId;
      }
    }

    await onAddVersion(versionData);
    handleClose();
  };

  const handleClose = () => {
    onOpenChange(false);
    setFormData({ name: '', description: '', audioUrl: '', recommended: false });
    setPreviewEmbed('');
    setEmbedError('');
    setUrlType('bandcamp');
  };

  const getUrlPlaceholder = () => {
    switch (urlType) {
      case 'bandcamp':
        return 'https://harmonia-media.bandcamp.com/track/nome-da-track';
      case 'drive':
        return 'https://drive.google.com/file/d/ID_DO_ARQUIVO/view';
      default:
        return 'https://exemplo.com/audio.mp3';
    }
  };

  const getUrlHelperText = () => {
    switch (urlType) {
      case 'bandcamp':
        return 'Cole a URL completa do track no Bandcamp';
      case 'drive':
        return 'Cole o link de compartilhamento do Google Drive (configurado como "Qualquer pessoa com o link")';
      default:
        return 'Cole a URL direta do arquivo de áudio';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isFinalVersion ? "Adicionar Versão Final" : "Adicionar Nova Versão"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 pt-4">
          {/* URL do áudio */}
          <div>
            <Label htmlFor="audioUrl">URL do Áudio</Label>
            <Input
              id="audioUrl"
              name="audioUrl"
              placeholder={getUrlPlaceholder()}
              value={formData.audioUrl}
              onChange={handleChange}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              {getUrlHelperText()}
            </p>
            
            {/* Botões de tipo de URL */}
            <div className="flex gap-2 mt-2">
              <Button
                type="button"
                variant={urlType === 'bandcamp' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setUrlType('bandcamp')}
              >
                Bandcamp
              </Button>
              <Button
                type="button"
                variant={urlType === 'drive' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setUrlType('drive')}
              >
                Google Drive
              </Button>
              <Button
                type="button"
                variant={urlType === 'other' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setUrlType('other')}
              >
                Outro
              </Button>
            </div>
          </div>

          {/* Preview do embed/arquivo */}
          {formData.audioUrl && (
            <div className="border rounded p-4 bg-gray-50">
              <Label className="text-sm font-medium mb-2 block">Prévia:</Label>
              {embedError ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{embedError}</AlertDescription>
                </Alert>
              ) : previewEmbed ? (
                <div>
                  {urlType === 'bandcamp' ? (
                    <div>
                      <div className="text-xs text-gray-600 mb-2">
                        Embed URL: {previewEmbed}
                      </div>
                      <iframe
                        src={previewEmbed}
                        style={{ border: 0, width: '100%', height: '42px' }}
                        title="Preview do Bandcamp"
                        className="rounded"
                        onError={() => setEmbedError('Erro ao carregar embed do Bandcamp')}
                      />
                      <div className="mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(formData.audioUrl, '_blank')}
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Abrir no Bandcamp
                        </Button>
                      </div>
                    </div>
                  ) : urlType === 'drive' ? (
                    <div className="text-center p-4 bg-blue-50 rounded">
                      <p className="text-blue-700 font-medium">📁 Arquivo do Google Drive</p>
                      <p className="text-sm text-blue-600 mt-1">{previewEmbed}</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => window.open(formData.audioUrl, '_blank')}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Abrir no Google Drive
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center p-4 bg-purple-50 rounded">
                      <p className="text-purple-700 font-medium">🎵 Áudio Externo</p>
                      <audio controls className="mt-2 w-full">
                        <source src={formData.audioUrl} type="audio/mpeg" />
                        Seu navegador não suporta o elemento de áudio.
                      </audio>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  Gerando preview...
                </div>
              )}
            </div>
          )}

          {/* Nome da versão */}
          <div>
            <Label htmlFor="name">Nome da Versão</Label>
            <Input
              id="name"
              name="name"
              placeholder={isFinalVersion ? "Ex: Versão Final - Master" : "Ex: Versão 1 - Demo Inicial"}
              value={formData.name}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          {/* Descrição */}
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Descreva as características desta versão..."
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="mt-1"
            />
          </div>

          {/* Versão recomendada */}
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="recommended"
              checked={formData.recommended}
              onCheckedChange={handleRecommendedChange}
            />
            <Label htmlFor="recommended" className="text-sm font-medium">
              Marcar como versão recomendada
            </Label>
          </div>

          {/* Ações */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="bg-harmonia-green hover:bg-harmonia-green/90"
              disabled={isProcessing || !formData.name || !formData.audioUrl}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                `Adicionar ${isFinalVersion ? 'Versão Final' : 'Versão'}`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddVersionDialog;
