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
  return <div className="w-full">
      <Tabs defaultValue="exemplos" className="w-full">
        
        
        
        
        <TabsContent value="comparacoes">
          <div className="space-y-6">
            {comparisonExamples.map(example => <ComparisonPlayer key={example.id} title={example.title} description={example.description} beforeUrl={example.beforeUrl || ''} afterUrl={example.afterUrl || ''} />)}
          </div>
        </TabsContent>
      </Tabs>
    </div>;
};
export default PortfolioTabs;