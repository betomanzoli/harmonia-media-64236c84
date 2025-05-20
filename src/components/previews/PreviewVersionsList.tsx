
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';
import LimitedAudioPlayer from '@/components/LimitedAudioPlayer';

interface MusicPreview {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  recommended?: boolean;
}

interface PreviewVersionsListProps {
  versions: MusicPreview[];
  selectedVersion: string | null;
  setSelectedVersion: (id: string) => void;
  isApproved: boolean;
}

const PreviewVersionsList: React.FC<PreviewVersionsListProps> = ({
  versions,
  selectedVersion,
  setSelectedVersion,
  isApproved
}) => {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold mb-6 pb-2 border-b text-white">Versões Disponíveis</h2>
      <div className="space-y-6">
        {versions.map(version => (
          <Card 
            key={version.id} 
            className={`p-6 transition-all ${selectedVersion === version.id ? 'border-harmonia-green ring-1 ring-harmonia-green' : 'hover:border-harmonia-green/50'}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-gray-800">{version.title}</h3>
                {version.recommended && (
                  <span className="inline-block px-2 py-1 bg-harmonia-green/20 text-harmonia-green text-xs rounded-full mt-1">
                    Recomendada
                  </span>
                )}
              </div>
              {selectedVersion === version.id ? (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-harmonia-green/10 text-harmonia-green border-harmonia-green"
                  disabled
                >
                  <Check className="w-4 h-4 mr-2" />
                  Selecionada
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="hover:bg-harmonia-green/10 hover:text-harmonia-green"
                  onClick={() => setSelectedVersion(version.id)}
                  disabled={isApproved}
                >
                  Selecionar
                </Button>
              )}
            </div>
            
            <p className="text-gray-600 mb-4">{version.description}</p>
            
            <div className="mb-4">
              <LimitedAudioPlayer 
                audioSrc={version.audioUrl}
                previewDuration={30}
                title=""
                subtitle=""
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PreviewVersionsList;
