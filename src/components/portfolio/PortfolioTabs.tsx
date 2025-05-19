
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExamplesList from './ExamplesList';
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
  // Filter examples based on selected category
  const filteredExamples = selectedCategory === 'all' 
    ? examples 
    : examples.filter(example => 
        example.category && example.category.includes(selectedCategory)
      );
  
  // Get unique categories from all examples
  const allCategories = [...new Set(
    examples.flatMap(example => example.category || [])
  )];
  
  return (
    <Tabs defaultValue="examples" className="w-full">
      <TabsList className="mb-8">
        <TabsTrigger value="examples">Exemplos de Áudio</TabsTrigger>
        <TabsTrigger value="comparisons">Antes & Depois</TabsTrigger>
      </TabsList>
      
      <TabsContent value="examples" className="space-y-6">
        <div className="grid grid-cols-2 gap-4 md:flex md:flex-wrap md:gap-6 mb-6">
          <button 
            onClick={() => onSelectCategory('all')}
            className={`px-4 py-2 rounded-full text-sm ${
              selectedCategory === 'all' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos
          </button>
          
          {allCategories.map((category, index) => (
            <button 
              key={index}
              onClick={() => onSelectCategory(category)}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedCategory === category 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        <ExamplesList 
          initialExamples={filteredExamples}
          extraExamples={[]}
          showAll={showAll}
          onShowMore={onShowMore}
        />
      </TabsContent>
      
      <TabsContent value="comparisons">
        <div className="space-y-8">
          {comparisonExamples.length > 0 ? (
            comparisonExamples.map((example, index) => (
              <div key={index} className="mb-10">
                <h3 className="text-xl font-semibold mb-4">{example.title}</h3>
                <p className="text-gray-600 mb-4">{example.description}</p>
                
                {example.beforeUrl && example.afterUrl && (
                  <ComparisonPlayer 
                    beforeUrl={example.beforeUrl}
                    afterUrl={example.afterUrl}
                    title={example.title}
                  />
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">Nenhum exemplo de comparação disponível no momento.</p>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default PortfolioTabs;
