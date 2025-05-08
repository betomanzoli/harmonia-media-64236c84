
import React, { useState } from 'react';
import PreviewVersionCard from './PreviewVersionCard';
import { MusicPreview } from '@/types/project.types';

interface PreviewPlayerListProps {
  versions: MusicPreview[];
  selectedVersion: string | null;
  setSelectedVersion: (id: string) => void;
  isApproved: boolean;
}

const PreviewPlayerList: React.FC<PreviewPlayerListProps> = ({ 
  versions,
  selectedVersion,
  setSelectedVersion,
  isApproved
}) => {
  // Set first version as selected by default if none provided
  React.useEffect(() => {
    if (!selectedVersion && versions.length > 0) {
      const recommendedVersion = versions.find(v => v.recommended);
      setSelectedVersion(recommendedVersion?.id || versions[0].id);
    }
  }, [versions, selectedVersion, setSelectedVersion]);

  return (
    <div className="space-y-6">
      {versions.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-gray-500">Nenhuma versão disponível ainda.</p>
          <p className="text-sm text-gray-400 mt-2">Volte mais tarde para ver as versões propostas.</p>
        </div>
      ) : (
        versions.map((version) => {
          // Check if version has required fields
          const hasValidFileId = Boolean(version.file_id);
          const hasValidAudioUrl = Boolean(version.audio_url);
          
          if (!hasValidAudioUrl && !hasValidFileId) {
            console.warn(`Version ${version.id} missing both audio_url and file_id`, version);
            return null;
          }
          
          return (
            <PreviewVersionCard
              key={version.id}
              version={version}
              isSelected={selectedVersion === version.id}
              onSelect={() => setSelectedVersion(version.id)}
              isApproved={isApproved}
            />
          );
        }).filter(Boolean)
      )}
    </div>
  );
};

export default PreviewPlayerList;
