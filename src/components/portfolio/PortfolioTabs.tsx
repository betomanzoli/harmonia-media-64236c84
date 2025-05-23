
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AudioCard from './AudioCard';
import ComparisonPlayer from './ComparisonPlayer';
import ExamplesList from './ExamplesList';
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
  
  const categories = [
    { id: 'all', name: 'Todos' },
    { id: 'Casamento', name: 'Casamentos' },
    { id: 'Corporativo', name: 'Corporativo' },
    { id: 'Romântico', name: 'Romântico' },
    { id: 'Publicidade', name: 'Publicidade' }
  ];

  return (
    <div className="w-full">
      <Tabs 
        defaultValue="all" 
        value={selectedCategory} 
        onValueChange={onSelectCategory}
        className="w-full"
      >
        <TabsList className="w-full flex flex-wrap justify-start mb-8 border-b">
          {categories.map(category => (
            <TabsTrigger 
              key={category.id}
              value={category.id}
              className="text-sm md:text-base"
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          <ExamplesList 
            initialExamples={filteredExamples.slice(0, 4)}
            extraExamples={filteredExamples.slice(4)}
            showAll={showAll}
            onShowMore={onShowMore}
          />
        </TabsContent>
      </Tabs>
      
      {comparisonExamples.length > 0 && selectedCategory === 'all' && (
        <div className="mt-16">
          <h3 className="text-2xl font-semibold mb-6">Antes e Depois</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {comparisonExamples.map((example, index) => (
              <ComparisonPlayer
                key={index}
                title={example.title}
                description={example.description}
                beforeUrl={example.beforeUrl || ''}
                afterUrl={example.afterUrl || ''}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioTabs;
