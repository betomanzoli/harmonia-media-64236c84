
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GoogleDriveAudioPlayer from './GoogleDriveAudioPlayer';
import { useGoogleDriveAudio } from '@/hooks/audio/useGoogleDriveAudio';
import { Button } from "@/components/ui/button";
import { ExternalLink, FolderOpen } from 'lucide-react';

interface GoogleDrivePreviewsListProps {
  projectId?: string;
  title?: string;
}

const GoogleDrivePreviewsList: React.FC<GoogleDrivePreviewsListProps> = ({
  projectId,
  title = "Prévias disponíveis"
}) => {
  const {
    audioFiles,
    isLoading,
    error,
    getViewUrl,
    audioFolderUrl
  } = useGoogleDriveAudio();

  const openGoogleDriveFolder = () => {
    window.open(audioFolderUrl, '_blank');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-pulse h-6 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
            <div className="animate-pulse h-20 bg-gray-200 rounded mx-auto w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-500 py-8">
            <p>Erro ao carregar as prévias. Por favor, tente novamente.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={openGoogleDriveFolder}
          className="text-harmonia-green border-harmonia-green hover:bg-harmonia-green/10"
        >
          <FolderOpen className="w-4 h-4 mr-2" />
          Ver pasta completa
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">Todas as prévias</TabsTrigger>
            <TabsTrigger value="piano">Piano</TabsTrigger>
            <TabsTrigger value="cordas">Cordas</TabsTrigger>
            <TabsTrigger value="orquestra">Orquestra</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {audioFiles.map((file) => (
              <div key={file.id} className="relative">
                <GoogleDriveAudioPlayer
                  fileId={file.id}
                  title={file.name}
                  subtitle={file.category}
                  isPreview={file.type === 'preview'}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 text-gray-500 hover:text-harmonia-green"
                  onClick={() => window.open(getViewUrl(file.id), '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="piano" className="space-y-4">
            {audioFiles
              .filter(file => file.category?.toLowerCase() === 'piano')
              .map((file) => (
                <GoogleDriveAudioPlayer
                  key={file.id}
                  fileId={file.id}
                  title={file.name}
                  subtitle={file.category}
                  isPreview={file.type === 'preview'}
                />
              ))}
          </TabsContent>
          
          <TabsContent value="cordas" className="space-y-4">
            {audioFiles
              .filter(file => file.category?.toLowerCase() === 'cordas' || file.category?.toLowerCase() === 'violão')
              .map((file) => (
                <GoogleDriveAudioPlayer
                  key={file.id}
                  fileId={file.id}
                  title={file.name}
                  subtitle={file.category}
                  isPreview={file.type === 'preview'}
                />
              ))}
          </TabsContent>
          
          <TabsContent value="orquestra" className="space-y-4">
            {audioFiles
              .filter(file => file.category?.toLowerCase() === 'orquestra')
              .map((file) => (
                <GoogleDriveAudioPlayer
                  key={file.id}
                  fileId={file.id}
                  title={file.name}
                  subtitle={file.category}
                  isPreview={file.type === 'preview'}
                />
              ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default GoogleDrivePreviewsList;
