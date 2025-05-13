
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
        <TabsList className="mb-6">
          <TabsTrigger value="exemplos">Exemplos</TabsTrigger>
          <TabsTrigger value="comparacoes">Antes & Depois</TabsTrigger>
        </TabsList>
        
        <TabsContent value="exemplos">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExamples.slice(0, showAll ? filteredExamples.length : 6).map(example => (
              <AudioCard 
                key={example.id}
                title={example.title}
                description={example.description}
                imageUrl={example.imageUrl}
                audioUrl={example.audioUrl}
                tags={example.tags}
                featured={example.featured}
              />
            ))}
          </div>
          
          {!showAll && filteredExamples.length > 6 && (
            <div className="text-center mt-8">
              <button 
                onClick={onShowMore}
                className="px-4 py-2 bg-harmonia-green text-white rounded-md hover:bg-harmonia-green/80 transition-colors"
              >
                Ver mais exemplos
              </button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="comparacoes">
          <div className="space-y-6">
            {comparisonExamples.map(example => (
              <ComparisonPlayer 
                key={example.id} 
                title={example.title} 
                description={example.description} 
                beforeUrl={example.beforeUrl || ''} 
                afterUrl={example.afterUrl || ''} 
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PortfolioTabs;
