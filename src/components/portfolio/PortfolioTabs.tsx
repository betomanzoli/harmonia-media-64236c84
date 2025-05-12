
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
          <TabsTrigger value="exemplos">Exemplos de Música</TabsTrigger>
          <TabsTrigger value="comparacoes">Comparações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="exemplos">
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={() => onSelectCategory('all')}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedCategory === 'all' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              Todos
            </button>
            
            <button
              onClick={() => onSelectCategory('pop')}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedCategory === 'pop' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              Pop
            </button>
            
            <button
              onClick={() => onSelectCategory('rock')}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedCategory === 'rock' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              Rock
            </button>
            
            <button
              onClick={() => onSelectCategory('eletronica')}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedCategory === 'eletronica' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              Eletrônica
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExamples.slice(0, showAll ? filteredExamples.length : 6).map((example) => (
              <AudioCard key={example.id} example={example} />
            ))}
          </div>
          
          {!showAll && filteredExamples.length > 6 && (
            <div className="mt-8 text-center">
              <button 
                onClick={onShowMore}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Mostrar Mais
              </button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="comparacoes">
          <div className="space-y-6">
            {comparisonExamples.map((example) => (
              <ComparisonPlayer key={example.id} example={example} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PortfolioTabs;
