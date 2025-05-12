
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import LimitedAudioPlayer from '@/components/LimitedAudioPlayer';
import { ArrowRight } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<string>("before");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs 
          defaultValue="before" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="flex items-center justify-center mb-4">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="before">Antes de Masterização</TabsTrigger>
              <TabsTrigger value="after">Após Masterização</TabsTrigger>
            </TabsList>
          </div>
          
          <div className="relative mb-8">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg">
                <ArrowRight className="h-6 w-6 text-harmonia-green" />
              </div>
            </div>
            
            <TabsContent value="before" className="mt-0">
              <div className="p-4 bg-gray-100 rounded-md">
                <h3 className="text-sm font-medium mb-2 text-gray-700">Áudio Original</h3>
                <LimitedAudioPlayer 
                  title="Antes da Masterização" 
                  subtitle="Áudio original sem tratamento profissional" 
                  audioSrc={beforeUrl} 
                  previewDuration={30}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="after" className="mt-0">
              <div className="p-4 bg-green-50 rounded-md">
                <h3 className="text-sm font-medium mb-2 text-green-700">Resultado Final</h3>
                <LimitedAudioPlayer 
                  title="Depois da Masterização" 
                  subtitle="Áudio final com tratamento profissional" 
                  audioSrc={afterUrl} 
                  previewDuration={30}
                />
              </div>
            </TabsContent>
          </div>
          
          <div className="text-sm text-gray-500 text-center">
            <p>
              {activeTab === "before" 
                ? "Ouça o áudio original antes do tratamento professional. Note a diferença na qualidade sonora." 
                : "Ouça o resultado final após o tratamento e masterização profissional. Perceba a melhoria na clareza e volume."}
            </p>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ComparisonPlayer;
