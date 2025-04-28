
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Play } from 'lucide-react';
import GoogleDriveAudioPlayer from '../GoogleDriveAudioPlayer';

interface MusicPreview {
  id: string;
  title: string;
  description: string;
  audioUrl?: string;
  url?: string;
  fileId?: string;
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
  if (!versions || versions.length === 0) {
    return (
      <div className="mb-10">
        <h2 className="text-xl font-bold mb-6 pb-2 border-b">Versões Disponíveis</h2>
        <Card className="p-6 text-center">
          <p className="text-gray-500">Nenhuma versão disponível no momento.</p>
        </Card>
      </div>
    );
  }

  // Extract file ID from URL if not directly provided
  const getFileId = (version: MusicPreview): string => {
    if (version.fileId) return version.fileId;
    
    const url = version.audioUrl || version.url || '';
    const match = url.match(/[-\w]{25,}/);
    return match ? match[0] : '';
  };
  
  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold mb-6 pb-2 border-b">Versões Disponíveis</h2>
      <div className="space-y-6">
        {versions.map(version => (
          <Card 
            key={version.id} 
            className={`p-6 transition-all ${selectedVersion === version.id ? 'border-harmonia-green ring-1 ring-harmonia-green' : 'hover:border-harmonia-green/50'}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg">{version.title}</h3>
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
              {getFileId(version) ? (
                <GoogleDriveAudioPlayer
                  fileId={getFileId(version)}
                  title={version.title}
                  subtitle="Pré-visualização de áudio"
                  isPreview={true}
                />
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-500">
                  Nenhum arquivo de áudio disponível para esta versão.
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PreviewPlayerList;
