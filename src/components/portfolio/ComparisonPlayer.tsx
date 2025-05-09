
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [activeTab, setActiveTab] = useState<string>("after");
  
  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      
      <Tabs defaultValue="after" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-4 pt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="before">Versão Original</TabsTrigger>
            <TabsTrigger value="after">Versão Final</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="before" className="p-4">
          <div className="text-sm text-gray-500 mb-2">
            Gravação original antes da produção profissional
          </div>
          <LimitedAudioPlayer 
            title="Versão Original" 
            subtitle={title} 
            audioSrc={beforeUrl}
            previewDuration={30}
          />
        </TabsContent>
        
        <TabsContent value="after" className="p-4">
          <div className="text-sm text-gray-500 mb-2">
            Versão final após nossa produção musical
          </div>
          <LimitedAudioPlayer 
            title="Versão Final" 
            subtitle={title} 
            audioSrc={afterUrl}
            previewDuration={30}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ComparisonPlayer;
