import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Play } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';

interface MusicPreview {
  id: string;
  title: string;
  description: string;
  audioUrl?: string;
  url?: string;
  recommended?: boolean;
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
        <Card className="p-6">
          <p className="text-center text-gray-500">
            Nenhuma versão disponível no momento. Entre em contato conosco se você acredita que isto é um erro.
          </p>
        </Card>
      </div>
    );
  }
  
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
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handlePlay(version)}
                  className="text-harmonia-green hover:bg-harmonia-green/10"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Ouvir
                </Button>
                
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
            </div>
            
            <p className="text-gray-600 mb-4">{version.description}</p>
            
            {!isApproved && (
              <div className="mt-4 pt-4 border-t">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Suas considerações sobre esta versão:
                </label>
                <Textarea
                  placeholder="Digite aqui seu feedback sobre esta versão..."
                  value={feedbacks[version.id] || ''}
                  onChange={(e) => handleFeedbackChange(version.id, e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PreviewPlayerList;
