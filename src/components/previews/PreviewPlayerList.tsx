
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import PreviewVersionCard from './player/PreviewVersionCard';
import NoVersionsCard from './player/NoVersionsCard';

interface MusicPreview {
  id: string;
  title: string;
  description: string;
  audioUrl?: string;
  url?: string;
}

interface PreviewVersionsListProps {
  versions: MusicPreview[];
  selectedVersion: string | null;
  setSelectedVersion: (id: string) => void;
  isApproved: boolean;
}

const PreviewPlayerList: React.FC<PreviewVersionsListProps> = ({
  versions,
  selectedVersion,
  setSelectedVersion,
  isApproved
}) => {
  const [feedbacks, setFeedbacks] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handlePlay = (version: MusicPreview) => {
    const audioUrl = version.audioUrl || version.url;
    if (audioUrl) {
      window.open(audioUrl, '_blank');
      toast({
        title: "Reproduzindo versão",
        description: "A versão está sendo reproduzida em uma nova aba."
      });
    }
  };

  const handleFeedbackChange = (versionId: string, feedback: string) => {
    setFeedbacks(prev => ({
      ...prev,
      [versionId]: feedback
    }));
  };

  if (!versions || versions.length === 0) {
    return (
      <div className="mb-10">
        <h2 className="text-xl font-bold mb-6 pb-2 border-b">Versões Disponíveis</h2>
        <NoVersionsCard />
      </div>
    );
  }
  
  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold mb-6 pb-2 border-b">Versões Disponíveis</h2>
      <div className="space-y-6">
        {versions.map(version => (
          <PreviewVersionCard
            key={version.id}
            version={version}
            isSelected={selectedVersion === version.id}
            isApproved={isApproved}
            feedback={feedbacks[version.id]}
            onPlay={handlePlay}
            onSelect={setSelectedVersion}
            onFeedbackChange={handleFeedbackChange}
          />
        ))}
      </div>
    </div>
  );
};

export default PreviewPlayerList;
