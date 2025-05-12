
import React from 'react';
import LimitedAudioPlayer from '@/components/LimitedAudioPlayer';
import { Card } from "@/components/ui/card";

interface Version {
  name: string;
  audioSrc: string;
  description: string;
}

interface AudioVersionsProps {
  title: string;
  subtitle: string;
  versions: Version[];
  type: "comparison" | "stems";
}

const AudioVersions: React.FC<AudioVersionsProps> = ({ 
  title, 
  subtitle, 
  versions, 
  type 
}) => {
  return (
    <Card className="border border-border rounded-lg overflow-hidden bg-card">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-gray-400 text-sm">{subtitle}</p>
      </div>
      
      {type === "comparison" ? (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {versions.map((version, vIndex) => (
            <Card key={vIndex} className="border border-border overflow-hidden">
              <div className="p-3 bg-background/40 border-b border-border">
                <h4 className="text-sm font-medium">{version.name}</h4>
                <p className="text-xs text-gray-400">{version.description}</p>
              </div>
              <div className="p-3">
                <LimitedAudioPlayer 
                  title={version.name} 
                  subtitle={title} 
                  audioSrc={version.audioSrc}
                  previewDuration={30}
                />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="p-6 space-y-6">
          {versions.map((version, vIndex) => (
            <Card key={vIndex} className="border border-border overflow-hidden">
              <div className="p-3 bg-background/40 border-b border-border">
                <h4 className="text-sm font-medium">{version.name}</h4>
                <p className="text-xs text-gray-400">{version.description}</p>
              </div>
              <div className="p-3">
                <LimitedAudioPlayer 
                  title={version.name} 
                  subtitle={title} 
                  audioSrc={version.audioSrc}
                  previewDuration={30}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
};

export default AudioVersions;
