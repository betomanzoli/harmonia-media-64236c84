
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import BandcampUtils from '../bandcamp/BandcampUtils';
import VersionsTable from './VersionsTable';
import VersionPreview from './VersionPreview';
import AddVersionDialog from '../previews/AddVersionDialog';
import { VersionItem } from '@/hooks/admin/usePreviewProjects';

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

  // Convert VersionItem to internal format and handle the addition
  const handleAddVersion = async (versionData: VersionItem) => {
    setIsProcessing(true);

    try {
      console.log('Processing version data:', versionData);
      
      // Extract trackInfo from audioUrl if it's a Bandcamp URL
      let trackInfo = null;
      if (versionData.audioUrl && BandcampUtils.isValidBandcampUrl(versionData.audioUrl)) {
        trackInfo = BandcampUtils.createTrackInfoFromUrl(versionData.audioUrl);
      }

      const trackNumber = versions.length + 1;
      const newVersion: ProjectVersion = {
        id: versionData.id,
        name: versionData.name,
        description: versionData.description,
        trackNumber,
        bandcampUrl: versionData.audioUrl, // Use audioUrl as bandcampUrl
        embedUrl: trackInfo?.embedUrl || versionData.audioUrl,
        albumId: trackInfo?.albumId || versionData.fileId,
        trackId: trackInfo?.trackId,
        createdAt: versionData.dateAdded,
        isRecommended: versionData.recommended
      };

      console.log('Creating new version:', newVersion);

      setVersions([...versions, newVersion]);
      
      toast({
        title: "Versão adicionada",
        description: `A versão "${versionData.name}" foi adicionada ao projeto.`
      });

      setShowNewVersionDialog(false);

    } catch (error) {
      console.error('Error adding version:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      toast({
        title: "Erro ao processar versão",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
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
          <VersionsTable
            versions={versions}
            onDeleteVersion={handleDeleteVersion}
            onToggleRecommended={toggleRecommended}
            onRefreshEmbed={refreshEmbed}
          />
        </CardContent>
      </Card>

      <VersionPreview versions={versions} />

      <AddVersionDialog
        projectId={projectId}
        onAddVersion={handleAddVersion}
        isOpen={showNewVersionDialog}
        onOpenChange={setShowNewVersionDialog}
        isFinalVersion={false}
      />
    </div>
  );
};

export default VersionManager;
