
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
}

const PortfolioTabs: React.FC<PortfolioTabsProps> = ({
  selectedCategory,
  onSelectCategory,
  examples,
  comparisonExamples
}) => {
  const filteredExamples = selectedCategory === 'all' 
    ? examples 
    : examples.filter(example => example.categories.includes(selectedCategory));

  return (
    <Tabs defaultValue="examples" className="w-full">
      <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
        <TabsTrigger value="examples">Exemplos de Músicas</TabsTrigger>
        <TabsTrigger value="comparisons">Antes & Depois</TabsTrigger>
      </TabsList>
      
      <TabsContent value="examples" className="space-y-8">
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded-full text-sm ${
              selectedCategory === 'all' 
                ? 'bg-harmonia-green text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => onSelectCategory('all')}
          >
            Todos
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm ${
              selectedCategory === 'romantic' 
                ? 'bg-harmonia-green text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => onSelectCategory('romantic')}
          >
            Românticas
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm ${
              selectedCategory === 'commercial' 
                ? 'bg-harmonia-green text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => onSelectCategory('commercial')}
          >
            Comerciais
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm ${
              selectedCategory === 'special-date' 
                ? 'bg-harmonia-green text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => onSelectCategory('special-date')}
          >
            Datas Especiais
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExamples.map(example => (
            <AudioCard 
              key={example.id}
              title={example.title}
              description={example.description}
              audioUrl={example.audioUrl}
              imageUrl={example.imageUrl}
              tags={example.tags}
            />
          ))}
        </div>
        
        {filteredExamples.length === 0 && (
          <p className="text-center text-gray-500">
            Nenhum exemplo encontrado para esta categoria.
          </p>
        )}
      </TabsContent>
      
      <TabsContent value="comparisons">
        <div className="space-y-8 max-w-3xl mx-auto">
          {comparisonExamples.map(example => (
            <ComparisonPlayer
              key={example.id}
              title={example.title}
              description={example.description}
              beforeUrl={example.beforeUrl || ''}
              afterUrl={example.audioUrl}
            />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default PortfolioTabs;
