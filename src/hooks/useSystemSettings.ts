
import { useState } from 'react';

export function useSystemSettings() {
  const [settings, setSettings] = useState({
    maxUploadSize: 10, // MB
    allowedFileTypes: ['image/jpeg', 'image/png', 'audio/mp3', 'video/mp4'],
    storageProvider: 'local',
    cloudSettings: {
      apiKey: '',
      bucket: ''
    }
  });
  
  const updateSettings = (newSettings: Partial<typeof settings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };
  
  return {
    settings,
    updateSettings
  };
}
