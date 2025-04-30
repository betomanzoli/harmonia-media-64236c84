import React from 'react';
import { Card } from "@/components/ui/card";
import PreviewVersionCard from './PreviewVersionCard';

interface MusicPreview {
  id: string;
  title: string;
  description: string;
  audioUrl?: string;
  url?: string;
  fileId?: string;
  recommended?: boolean;
}

interface PreviewPlayerListProps {
  versions: MusicPreview[];
  selectedVersion: string | null;
  setSelectedVersion: (id: string) => void;
  isApproved: boolean;
  onPlay?: (version: MusicPreview) => void;
}

const PreviewPlayerList: React.FC<PreviewPlayerListProps> = ({
  versions,
  selectedVersion,
  setSelectedVersion,
  isApproved,
  onPlay = () => {}
}) => {
  if (!versions || versions.length === 0) {
    return (
      <div className="mb-10">
        <h2 className="text-xl font-bold text-black mb-6 pb-2 border-b">Versões Disponíveis</h2>
        <Card className="p-6 text-center">
          <p className="text-gray-500">Nenhuma versão disponível no momento.</p>
        </Card>
      </div>
    );
  }

  // Handle playing the version audio
  const handlePlay = (version: MusicPreview) => {
    // If version has fileId, create a Google Drive URL
    if (version.fileId) {
      const driveUrl = `https://drive.google.com/file/d/${version.fileId}/view`;
      window.open(driveUrl, '_blank');
      return;
    }
    
    // Otherwise use the provided audioUrl or url
    if (version.audioUrl) {
      window.open(version.audioUrl, '_blank');
      return;
    }
    
    // Fall back to onPlay handler
    onPlay(version);
  };
  
  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold text-black mb-6 pb-2 border-b">Versões Disponíveis</h2>
      <div className="space-y-6">
        {versions.map(version => (
          <PreviewVersionCard 
            key={version.id}
            version={version}
            isSelected={selectedVersion === version.id}
            isApproved={isApproved}
            onSelect={setSelectedVersion}
            onPlay={handlePlay}
          />
        ))}
      </div>
    </div>
  );
};

export default PreviewPlayerList;
