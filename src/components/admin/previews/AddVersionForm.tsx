import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { Version } from '@/hooks/admin/useVersions'; // ✅ CORRIGIDO

interface AddVersionFormProps {
  projectId: string;
  onAddVersion: (version: Version) => void; // ✅ CORRIGIDO
  onCancel: () => void;
  isFinalVersion?: boolean;
  packageType?: string;
}

const AddVersionForm: React.FC<AddVersionFormProps> = ({
  projectId,
  onAddVersion,
  onCancel,
  isFinalVersion = false,
  packageType = 'essencial'
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    bandcamp_url: '', // ✅ CORRIGIDO
    recommended: false
  });
  const [previewEmbed, setPreviewEmbed] = useState<string>('');
  const [embedError, setEmbedError] = useState<string>('');
  const [urlType, setUrlType] = useState<'bandcamp' | 'drive' | 'other'>('bandcamp');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'bandcamp_url' && value) { // ✅ CORRIGIDO
      setEmbedError('');
      
      if (value.includes('bandcamp.com')) {
        setUrlType('bandcamp');
        setPreviewEmbed('Preview: Bandcamp track');
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
    } else if (name === 'bandcamp_url' && !value) { // ✅ CORRIGIDO
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const versionData: Omit<Version, 'id' | 'created_at' | 'updated_at'> = { // ✅ CORRIGIDO
        project_id: projectId,
        name: formData.name,
        description: formData.description,
        bandcamp_url: formData.bandcamp_url, // ✅ CORRIGIDO
        recommended: formData.recommended
      };

      await onAddVersion(versionData as Version); // ✅ CORRIGIDO
    } catch (error) {
      console.error('Error adding version:', error);
    } finally {
      setIsProcessing(false);
    }
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="bandcamp_url">URL do Áudio</Label> {/* ✅ CORRIGIDO */}
        <Input
          id="bandcamp_url"
          name="bandcamp_url" // ✅ CORRIGIDO
          placeholder={getUrlPlaceholder()}
          value={formData.bandcamp_url} // ✅ CORRIGIDO
          onChange={handleChange}
          className="mt-1"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          {getUrlHelperText()}
        </p>
        
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

      {formData.bandcamp_url && ( // ✅ CORRIGIDO
        <div className="border rounded p-4 bg-gray-50">
          <Label className="text-sm font-medium mb-2 block">Prévia:</Label>
          {embedError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{embedError}</AlertDescription>
            </Alert>
          ) : previewEmbed ? (
            <div className="text-center p-4 bg-blue-50 rounded">
              <p className="text-blue-700 font-medium">{previewEmbed}</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => window.open(formData.bandcamp_url, '_blank')} // ✅ CORRIGIDO
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Abrir URL
              </Button>
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
          placeholder={isFinalVersion ? "Ex: Versão Final - Master" : "Ex: Versão 1 - Demo Inicial"}
          value={formData.name}
          onChange={handleChange}
          className="mt-1"
          required
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
          className="mt-1"
        />
      </div>

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

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button 
          type="submit" 
          className="bg-harmonia-green hover:bg-harmonia-green/90"
          disabled={isProcessing || !formData.name || !formData.bandcamp_url} // ✅ CORRIGIDO
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
    </form>
  );
};

export default AddVersionForm;
