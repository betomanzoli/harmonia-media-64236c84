
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Play, Trash2, ExternalLink, AlertCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import BandcampUtils from '../bandcamp/BandcampUtils';

interface ProjectVersion {
  id: string;
  name: string;
  description: string;
  trackNumber: number;
  bandcampUrl: string;
  embedUrl: string;
  createdAt: string;
  isRecommended: boolean;
  albumId?: string;
  trackId?: string;
}

interface VersionManagerProps {
  projectId: string;
  projectTitle: string;
}

const VersionManager: React.FC<VersionManagerProps> = ({ projectId, projectTitle }) => {
  const { toast } = useToast();
  const [versions, setVersions] = useState<ProjectVersion[]>([]);
  const [showNewVersionDialog, setShowNewVersionDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    bandcampUrl: ''
  });
  const [previewEmbed, setPreviewEmbed] = useState<string>('');
  const [embedError, setEmbedError] = useState<string>('');

  const handleAddVersion = async () => {
    if (!formData.name || !formData.bandcampUrl) {
      toast({
        title: "Dados incompletos",
        description: "Nome e URL do Bandcamp são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    if (!BandcampUtils.isValidBandcampUrl(formData.bandcampUrl)) {
      toast({
        title: "URL inválida",
        description: "Por favor, insira uma URL válida do Bandcamp.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setEmbedError('');

    try {
      console.log('Processing Bandcamp URL:', formData.bandcampUrl);
      
      const trackInfo = BandcampUtils.createTrackInfoFromUrl(formData.bandcampUrl);

      if (!trackInfo) {
        throw new Error('Não foi possível extrair informações da URL do Bandcamp');
      }

      console.log('Track info extracted:', trackInfo);

      // Test if embed URL is valid
      if (!BandcampUtils.testEmbedUrl(trackInfo.embedUrl)) {
        console.warn('Embed URL may not be valid:', trackInfo.embedUrl);
      }

      const trackNumber = versions.length + 1;
      const newVersion: ProjectVersion = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        trackNumber,
        bandcampUrl: formData.bandcampUrl,
        embedUrl: trackInfo.embedUrl,
        albumId: trackInfo.albumId,
        trackId: trackInfo.trackId,
        createdAt: new Date().toLocaleDateString('pt-BR'),
        isRecommended: versions.length === 0 // First version is recommended by default
      };

      console.log('Creating new version:', newVersion);

      setVersions([...versions, newVersion]);
      
      toast({
        title: "Versão adicionada",
        description: `A versão "${formData.name}" foi adicionada ao projeto.`
      });

      setShowNewVersionDialog(false);
      setFormData({ name: '', description: '', bandcampUrl: '' });
      setPreviewEmbed('');

    } catch (error) {
      console.error('Error adding version:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setEmbedError(errorMessage);
      
      toast({
        title: "Erro ao processar URL",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

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

  const handleDeleteVersion = (versionId: string) => {
    setVersions(versions.filter(v => v.id !== versionId));
    toast({
      title: "Versão removida",
      description: "A versão foi removida do projeto.",
      variant: "destructive"
    });
  };

  const toggleRecommended = (versionId: string) => {
    setVersions(versions.map(v => ({
      ...v,
      isRecommended: v.id === versionId
    })));
  };

  const refreshEmbed = (version: ProjectVersion) => {
    try {
      console.log('Refreshing embed for version:', version.id);
      const trackInfo = BandcampUtils.createTrackInfoFromUrl(version.bandcampUrl);
      if (trackInfo) {
        setVersions(versions.map(v => 
          v.id === version.id 
            ? { ...v, embedUrl: trackInfo.embedUrl, albumId: trackInfo.albumId, trackId: trackInfo.trackId }
            : v
        ));
        toast({
          title: "Embed atualizado",
          description: "O embed foi atualizado com sucesso."
        });
      }
    } catch (error) {
      console.error('Error refreshing embed:', error);
      toast({
        title: "Erro ao atualizar embed",
        description: "Não foi possível atualizar o embed.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Versões - {projectTitle}</h2>
        <Button onClick={() => setShowNewVersionDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Versão
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Versões</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Track #</TableHead>
                <TableHead>IDs</TableHead>
                <TableHead>Recomendada</TableHead>
                <TableHead>Criada</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {versions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Nenhuma versão criada ainda.
                  </TableCell>
                </TableRow>
              ) : (
                versions.map((version) => (
                  <TableRow key={version.id}>
                    <TableCell className="font-medium">
                      {version.name}
                      {version.isRecommended && (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Recomendada
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-md truncate">{version.description}</TableCell>
                    <TableCell>#{version.trackNumber}</TableCell>
                    <TableCell className="text-xs text-gray-500">
                      {version.albumId && version.trackId ? (
                        <div>
                          <div>Album: {version.albumId}</div>
                          <div>Track: {version.trackId}</div>
                        </div>
                      ) : (
                        <span className="text-red-500">IDs não encontrados</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRecommended(version.id)}
                        className={version.isRecommended ? 'text-green-600' : 'text-gray-400'}
                      >
                        {version.isRecommended ? '⭐' : '☆'}
                      </Button>
                    </TableCell>
                    <TableCell>{version.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => refreshEmbed(version)}
                          title="Atualizar embed"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => window.open(version.bandcampUrl, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => window.open(version.embedUrl, '_blank')}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600"
                          onClick={() => handleDeleteVersion(version.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Preview Section with better error handling */}
      {versions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Prévia do Player</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {versions.filter(v => v.isRecommended).map((version) => (
                <div key={version.id}>
                  <h3 className="font-medium mb-2">{version.name}</h3>
                  <div className="bg-gray-50 p-2 rounded mb-2">
                    <div className="text-xs text-gray-600">
                      <div>URL do Embed: {version.embedUrl}</div>
                      {version.albumId && version.trackId && (
                        <div>Album ID: {version.albumId} | Track ID: {version.trackId}</div>
                      )}
                    </div>
                  </div>
                  <iframe
                    src={version.embedUrl}
                    style={{ border: 0, width: '100%', height: '42px' }}
                    title={`Player ${version.name}`}
                    onError={(e) => {
                      console.error('Iframe error for version:', version.id, e);
                    }}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* New Version Dialog with improved preview */}
      <Dialog open={showNewVersionDialog} onOpenChange={setShowNewVersionDialog}>
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
              <Button variant="outline" onClick={() => setShowNewVersionDialog(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleAddVersion} 
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
    </div>
  );
};

export default VersionManager;
