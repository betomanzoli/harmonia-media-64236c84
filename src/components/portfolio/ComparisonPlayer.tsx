
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import LimitedAudioPlayer from '@/components/LimitedAudioPlayer';

interface ComparisonPlayerProps {
  title: string;
  description: string;
  beforeUrl: string;
  afterUrl: string;
}

const ComparisonPlayer: React.FC<ComparisonPlayerProps> = ({
  title,
  description,
  beforeUrl,
  afterUrl
}) => {
  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <p className="text-xs font-medium uppercase text-gray-500 mb-2">Antes</p>
          <LimitedAudioPlayer 
            title="Versão original" 
            subtitle="Demo enviada pelo cliente" 
            audioSrc={beforeUrl}
          />
        </div>
        
        <div>
          <p className="text-xs font-medium uppercase text-gray-500 mb-2">Depois</p>
          <LimitedAudioPlayer 
            title="Versão harmonIA" 
            subtitle="Produção profissional" 
            audioSrc={afterUrl}
          />
        </div>
      </div>
    </Card>
  );
};

export default ComparisonPlayer;
