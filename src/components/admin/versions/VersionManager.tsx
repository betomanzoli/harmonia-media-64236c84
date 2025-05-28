
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Play, Trash2, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
}

interface VersionManagerProps {
  projectId: string;
  projectTitle: string;
}

const VersionManager: React.FC<VersionManagerProps> = ({ projectId, projectTitle }) => {
  const { toast } = useToast();
  const [versions, setVersions] = useState<ProjectVersion[]>([]);
  const [showNewVersionDialog, setShowNewVersionDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    bandcampUrl: ''
  });

  const handleAddVersion = () => {
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

    const trackNumber = versions.length + 1;
    const trackInfo = BandcampUtils.createTrackInfoFromUrl(formData.bandcampUrl);

    if (!trackInfo) {
      toast({
        title: "Erro ao processar URL",
        description: "Não foi possível extrair informações da URL do Bandcamp.",
        variant: "destructive"
      });
      return;
    }

    const newVersion: ProjectVersion = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      trackNumber,
      bandcampUrl: formData.bandcampUrl,
      embedUrl: trackInfo.embedUrl,
      createdAt: new Date().toLocaleDateString('pt-BR'),
      isRecommended: versions.length === 0 // First version is recommended by default
    };

    setVersions([...versions, newVersion]);
    
    toast({
      title: "Versão adicionada",
      description: `A versão "${formData.name}" foi adicionada ao projeto.`
    });

    setShowNewVersionDialog(false);
    setFormData({ name: '', description: '', bandcampUrl: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
                <TableHead>Recomendada</TableHead>
                <TableHead>Criada</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {versions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
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

      {/* Preview Section */}
      {versions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Prévia do Player</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {versions.filter(v => v.isRecommended).map((version) => {
                const trackInfo = BandcampUtils.createTrackInfoFromUrl(version.bandcampUrl);
                return (
                  <div key={version.id}>
                    <h3 className="font-medium mb-2">{version.name}</h3>
                    {trackInfo && (
                      <iframe
                        src={trackInfo.embedUrl}
                        style={{ border: 0, width: '100%', height: '42px' }}
                        title={`Player ${version.name}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* New Version Dialog */}
      <Dialog open={showNewVersionDialog} onOpenChange={setShowNewVersionDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Versão</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
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
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowNewVersionDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddVersion} className="bg-harmonia-green hover:bg-harmonia-green/90">
                Adicionar Versão
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VersionManager;
