
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AudioCard from './AudioCard';
import ComparisonPlayer from './ComparisonPlayer';
import { AudioExample } from './audioData';

export interface PortfolioTabsProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  examples: AudioExample[];
  comparisonExamples: AudioExample[];
  showAll: boolean;
  onShowMore: () => void;
}

const PortfolioTabs: React.FC<PortfolioTabsProps> = ({
  selectedCategory,
  onSelectCategory,
  examples,
  comparisonExamples,
  showAll,
  onShowMore
}) => {
  const filteredExamples = selectedCategory === 'all' ? examples : examples.filter(example => example.category.includes(selectedCategory));
  
  return (
    <div className="w-full">
      <Tabs defaultValue="exemplos" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="exemplos">Exemplos</TabsTrigger>
          <TabsTrigger value="comparacao">Antes & Depois</TabsTrigger>
        </TabsList>
        
        <TabsContent value="exemplos" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredExamples.map((example, index) => (
              <AudioCard
                key={index}
                title={example.title}
                description={example.description}
                audioUrl={example.audioUrl}
                featured={example.featured}
                imageUrl={example.imageUrl}
                tags={example.category}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="comparacao" className="space-y-6">
          {comparisonExamples.map((example, index) => (
            <ComparisonPlayer
              key={index}
              title={example.title}
              description={example.description}
              beforeUrl={example.audioUrl}
              afterUrl={example.audioUrl}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PortfolioTabs;
