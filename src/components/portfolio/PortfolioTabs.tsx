
import React from 'react';
import { AudioExample as AudioExampleType } from './audioData';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronRight } from 'lucide-react';
import AudioExampleComponent from './AudioExample';

export interface PortfolioTabsProps {
  examples: AudioExampleType[];
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  showAll: boolean;
  onShowMore: () => void;
}

const PortfolioTabs: React.FC<PortfolioTabsProps> = ({ 
  examples, 
  selectedCategory, 
  setSelectedCategory, 
  showAll, 
  onShowMore 
}) => {
  // Filter examples by category
  const filteredExamples = selectedCategory === 'all' 
    ? examples 
    : examples.filter(example => example.categories.includes(selectedCategory));

  return (
    <div className="mt-12">
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid grid-cols-3 md:grid-cols-5 mb-8">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="original">Original</TabsTrigger>
          <TabsTrigger value="jingle">Jingles</TabsTrigger>
          <TabsTrigger value="soundtrack">Trilhas</TabsTrigger>
          <TabsTrigger value="corporate">Corporativo</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExamples.map((example) => (
          <AudioExampleComponent 
            key={example.id} 
            title={example.title}
            subtitle={example.description}
            audioSrc={example.audioUrl}
            type={example.type}
          />
        ))}
      </div>

      {!showAll && examples.length > 6 && (
        <div className="text-center mt-8">
          <Button 
            onClick={onShowMore}
            variant="outline" 
            className="px-6"
          >
            Ver mais exemplos
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default PortfolioTabs;
