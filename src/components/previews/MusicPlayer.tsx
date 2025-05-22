
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import PreviewVersionsList from './PreviewVersionsList';
import { MusicPreview } from '@/hooks/usePreviewProject';

interface MusicPlayerProps {
  previews: MusicPreview[];
  selectedVersion: string | null;
  onVersionSelect: (id: string) => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ 
  previews, 
  selectedVersion, 
  onVersionSelect 
}) => {
  const currentPreview = selectedVersion 
    ? previews.find(p => p.id === selectedVersion)
    : null;
  
  const isApproved = false; // This would come from props if needed
  
  return (
    <div>
      <PreviewVersionsList 
        versions={previews} 
        selectedVersion={selectedVersion} 
        setSelectedVersion={onVersionSelect}
        isApproved={isApproved}
      />
      
      {currentPreview && (
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">{currentPreview.title}</h3>
          
          <div className="relative bg-gray-100 rounded-md overflow-hidden">
            <audio 
              src={currentPreview.audioUrl} 
              className="w-full" 
              controls
              controlsList="nodownload"
            />
          </div>
        </Card>
      )}
    </div>
  );
};

export default MusicPlayer;
