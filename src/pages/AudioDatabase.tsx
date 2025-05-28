
import React from 'react';
import Header from '@/components/audio-database/Header';
import AudioTable from '@/components/audio-database/AudioTable';
import IntegrationConfig from '@/components/audio-database/IntegrationConfig';
import AddAudioSampleForm from '@/components/audio-database/AddAudioSampleForm';
import { useAudioSamples } from '@/hooks/useAudioSamples';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FolderOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StorageLinks } from '@/components/admin/storage/StorageLinks';

const AudioDatabase: React.FC = () => {
  const {
    audioSamples,
    isLoading,
    webhookUrl,
    setWebhookUrl,
    saveWebhookUrl,
    handleAddSample,
    deleteSample,
    getApiUrl,
    getJsonData,
    copyToClipboard,
    folderUrl,
    openFolder
  } = useAudioSamples();

  const storageLinks = [
    {
      title: "Banco de Dados de Áudio",
      description: "Armazenamento de amostras e exemplos de áudio",
      url: folderUrl
    }
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6 flex items-center justify-between">
        <Link to="/admin-j28s7d1k/dashboard">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Dashboard
          </Button>
        </Link>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 text-harmonia-green hover:bg-harmonia-light-green/20"
          onClick={openFolder}
        >
          <FolderOpen className="h-4 w-4" />
          Abrir Pasta de Armazenamento
        </Button>
      </div>
      
      <Header getApiUrl={getApiUrl} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <IntegrationConfig
            webhookUrl={webhookUrl}
            setWebhookUrl={setWebhookUrl}
            saveWebhookUrl={saveWebhookUrl}
            getApiUrl={getApiUrl}
            getJsonData={getJsonData}
            copyToClipboard={copyToClipboard}
          />
        </div>
        <div>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Configuração de Integração</h2>
            <div className="p-4 border rounded bg-muted">
              <h3 className="font-medium mb-2">Webhook de Áudios</h3>
              <p className="text-sm text-muted-foreground">
                Configure webhooks para notificações de novos áudios
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <StorageLinks
          title="Armazenamento de Áudio"
          links={storageLinks}
        />
      </div>
      
      <AudioTable
        audioSamples={audioSamples}
        isLoading={isLoading}
        onDelete={deleteSample}
      />
      
      <AddAudioSampleForm onAddSample={handleAddSample} />
    </div>
  );
};

export default AudioDatabase;
