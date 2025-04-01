
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Music, Sliders, Layers } from 'lucide-react';
import ExamplesList, { AudioExampleItem } from './ExamplesList';
import AudioVersions from './AudioVersions';

interface ComparisonExample {
  title: string;
  subtitle: string;
  versions: {
    name: string;
    audioSrc: string;
    description: string;
  }[];
  type: "comparison" | "stems";
}

interface PortfolioTabsProps {
  initialExamples: AudioExampleItem[];
  extraExamples: AudioExampleItem[];
  comparisonExamples: ComparisonExample[];
  showAll: boolean;
  onShowMore: () => void;
}

const PortfolioTabs: React.FC<PortfolioTabsProps> = ({ 
  initialExamples,
  extraExamples,
  comparisonExamples,
  showAll,
  onShowMore
}) => {
  return (
    <Tabs defaultValue="exemplos" className="w-full mb-10">
      <TabsList className="grid grid-cols-3 max-w-md mx-auto">
        <TabsTrigger value="exemplos" className="data-[state=active]:bg-harmonia-green">
          <Music className="w-4 h-4 mr-1" /> Exemplos
        </TabsTrigger>
        <TabsTrigger value="comparacoes" className="data-[state=active]:bg-harmonia-green">
          <Sliders className="w-4 h-4 mr-1" /> Comparações
        </TabsTrigger>
        <TabsTrigger value="stems" className="data-[state=active]:bg-harmonia-green">
          <Layers className="w-4 h-4 mr-1" /> Stems
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="exemplos" className="mt-6">
        <ExamplesList 
          initialExamples={initialExamples}
          extraExamples={extraExamples}
          showAll={showAll}
          onShowMore={onShowMore}
        />
      </TabsContent>
      
      <TabsContent value="comparacoes" className="mt-6">
        <div className="space-y-10">
          {comparisonExamples.filter(ex => ex.type === "comparison").map((example, index) => (
            <AudioVersions
              key={index}
              title={example.title}
              subtitle={example.subtitle}
              versions={example.versions}
              type="comparison"
            />
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="stems" className="mt-6">
        <div className="space-y-10">
          {comparisonExamples.filter(ex => ex.type === "stems").map((example, index) => (
            <AudioVersions
              key={index}
              title={example.title}
              subtitle={example.subtitle}
              versions={example.versions}
              type="stems"
            />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default PortfolioTabs;
