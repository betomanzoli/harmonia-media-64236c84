
import React from 'react';
import { Check, Lock } from 'lucide-react';
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
      {previews.map((preview, index) => (
        <div key={preview.id} className="relative">
          <div 
            className={`border rounded-lg p-1 transition-all ${
              selectedPreview === preview.id 
                ? 'border-harmonia-green ring-1 ring-harmonia-green' 
                : 'border-transparent hover:border-harmonia-green/50'
            }`}
          >
            <div className="absolute -top-3 left-3 bg-white px-2 py-0.5 text-xs font-medium text-gray-600">
              Versão {index + 1}
            </div>
            
            <div className="absolute -top-3 right-3 bg-harmonia-green/20 px-2 py-0.5 text-xs font-medium text-harmonia-green rounded-full flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Prévia 30s
            </div>
            
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
                className="absolute bottom-6 right-6 bg-harmonia-green/20 text-harmonia-green border-harmonia-green"
                disabled
              >
                <Check className="w-4 h-4 mr-2" />
                Selecionada
              </Button>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                className="absolute bottom-6 right-6 hover:bg-harmonia-green/20 hover:text-harmonia-green"
                onClick={() => setSelectedPreview(preview.id)}
                disabled={isApproved}
              >
                Selecionar esta versão
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PreviewPlayerList;
