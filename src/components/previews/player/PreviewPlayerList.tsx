
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PreviewVersionCard from './PreviewVersionCard';

interface MusicPreview {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  audio_url?: string;
  recommended?: boolean;
  final?: boolean;
  file_url?: string;
  final_version_url?: string;
  stems_url?: string;
  created_at?: string;
  date_added?: string;
}

interface PreviewPlayerListProps {
  versions: MusicPreview[];
  selectedVersion: string | null;
  onSelectVersion: (id: string) => void;
  isApproved?: boolean;
}

const PreviewPlayerList: React.FC<PreviewPlayerListProps> = ({
  versions,
  selectedVersion,
  onSelectVersion,
  isApproved = false
}) => {
  // Check if we have any versions with audio URLs
  const hasPlayableVersions = versions.some(v => v.audio_url || v.file_url);
  
  if (!hasPlayableVersions) {
    return (
      <Card className="p-6 text-center bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma prévia disponível</h3>
        <p className="text-gray-600">
          Você será notificado assim que houver prévias disponíveis para ouvir.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {versions
        .filter(version => version.audio_url || version.file_url)
        .map(version => (
          <PreviewVersionCard
            key={version.id}
            version={version}
            isSelected={selectedVersion === version.id}
            onSelect={() => onSelectVersion(version.id)}
            isApproved={isApproved}
          />
        ))}
    </div>
  );
};

export default PreviewPlayerList;
