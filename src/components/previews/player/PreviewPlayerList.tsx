
import React from 'react';
import PreviewVersionCard from './PreviewVersionCard';
import NoVersionsCard from './NoVersionsCard';

interface MusicPreview {
  id: string;
  title: string;
  description: string;
  audioUrl?: string;
  url?: string;
  recommended?: boolean;
}

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
  const handlePlay = (version: MusicPreview) => {
    const audioUrl = version.audioUrl || version.url;
    if (audioUrl) {
      window.open(audioUrl, '_blank');
    }
  };

  if (!versions || versions.length === 0) {
    return <NoVersionsCard />;
  }
  
  return (
    <div className="space-y-6">
      {versions.map(version => (
        <PreviewVersionCard
          key={version.id}
          version={version}
          isSelected={selectedVersion === version.id}
          isApproved={isApproved}
          onPlay={handlePlay}
          onSelect={setSelectedVersion}
        />
      ))}
    </div>
  );
};

export default PreviewPlayerList;
