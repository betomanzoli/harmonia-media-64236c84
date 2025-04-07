
import React from 'react';
import { Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import LimitedAudioPlayer from '@/components/LimitedAudioPlayer';

interface MusicPreview {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
}

interface PreviewPlayerListProps {
  previews: MusicPreview[];
  selectedPreview: string | null;
  setSelectedPreview: (id: string) => void;
  isApproved: boolean;
}

const PreviewPlayerList: React.FC<PreviewPlayerListProps> = ({
  previews,
  selectedPreview,
  setSelectedPreview,
  isApproved
}) => {
  return (
    <div className="space-y-6">
      {previews.map(preview => (
        <div key={preview.id} className="relative">
          <LimitedAudioPlayer 
            title={preview.title}
            subtitle={preview.description}
            audioSrc={preview.audioUrl}
            previewDuration={30}
          />
          
          {selectedPreview === preview.id ? (
            <Button 
              variant="outline" 
              size="sm"
              className="absolute top-6 right-6 bg-harmonia-green/20 text-harmonia-green border-harmonia-green"
              disabled
            >
              <Check className="w-4 h-4 mr-2" />
              Selecionada
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm"
              className="absolute top-6 right-6 hover:bg-harmonia-green/20 hover:text-harmonia-green"
              onClick={() => setSelectedPreview(preview.id)}
              disabled={isApproved}
            >
              Selecionar esta versão
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default PreviewPlayerList;
