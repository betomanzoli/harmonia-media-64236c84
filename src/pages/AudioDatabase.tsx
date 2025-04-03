
import React from 'react';
import Header from '@/components/audio-database/Header';
import AudioTable from '@/components/audio-database/AudioTable';
import IntegrationConfig from '@/components/audio-database/IntegrationConfig';
import AddAudioSampleForm from '@/components/audio-database/AddAudioSampleForm';
import { useAudioSamples } from '@/hooks/useAudioSamples';

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
      
      <IntegrationConfig
        webhookUrl={webhookUrl}
        setWebhookUrl={setWebhookUrl}
        saveWebhookUrl={saveWebhookUrl}
        getApiUrl={getApiUrl}
        getJsonData={getJsonData}
        copyToClipboard={copyToClipboard}
      />
      
      <AudioTable
        audioSamples={audioSamples}
        isLoading={isLoading}
      />
      
      <AddAudioSampleForm onAddSample={handleAddSample} />
    </div>
  );
};

export default AudioDatabase;
