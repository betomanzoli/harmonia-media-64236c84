
import React from 'react';
import Header from '@/components/audio-database/Header';
import AudioTable from '@/components/audio-database/AudioTable';
import IntegrationConfig from '@/components/audio-database/IntegrationConfig';
import AddAudioSampleForm from '@/components/audio-database/AddAudioSampleForm';
import { useAudioSamples } from '@/hooks/useAudioSamples';
import WebhookUrlManager from '@/components/admin/integrations/WebhookUrlManager';

const AudioDatabase: React.FC = () => {
  const {
    audioSamples,
    isLoading,
    webhookUrl,
    setWebhookUrl,
    saveWebhookUrl,
    handleAddSample,
    getApiUrl,
    getJsonData,
    copyToClipboard
  } = useAudioSamples();

  return (
    <div className="container mx-auto py-20 px-4">
      <Header getApiUrl={getApiUrl} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
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
          <WebhookUrlManager 
            title="Integração de Áudios" 
            description="Configure o webhook para notificações de novos áudios"
            serviceType="audio"
            storageUrl="https://drive.google.com/drive/folders/1zOKfHNA7rAihCmEVKZtL191k8XgUsXMg"
          />
        </div>
      </div>
      
      <AudioTable
        audioSamples={audioSamples}
        isLoading={isLoading}
      />
      
      <AddAudioSampleForm onAddSample={handleAddSample} />
    </div>
  );
};

export default AudioDatabase;
