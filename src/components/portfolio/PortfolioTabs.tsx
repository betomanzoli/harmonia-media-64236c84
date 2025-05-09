
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronDown } from 'lucide-react';
import AudioCard from './AudioCard';
import { AudioExample } from './audioData';

interface PortfolioTabsProps {
  initialExamples: AudioExample[];
  extraExamples: AudioExample[];
  comparisonExamples: AudioExample[];
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
  const [activeTab, setActiveTab] = useState('exemplos');
  const [portfolioItems, setPortfolioItems] = useState<AudioExample[]>([]);
  
  useEffect(() => {
    // Try loading from localStorage
    const storedItems = localStorage.getItem('harmonIA_portfolio_items');
    
    if (storedItems) {
      try {
        setPortfolioItems(JSON.parse(storedItems));
      } catch (error) {
        console.error('Error parsing portfolio items:', error);
        // Fallback to provided examples
        setPortfolioItems([...initialExamples, ...extraExamples, ...comparisonExamples]);
      }
    } else {
      // Use provided examples if localStorage is empty
      setPortfolioItems([...initialExamples, ...extraExamples, ...comparisonExamples]);
    }
  }, [initialExamples, extraExamples, comparisonExamples]);

  // Filter items by type
  const examples = portfolioItems.filter(item => item.type === 'example');
  const comparisons = portfolioItems.filter(item => item.type === 'comparison');
  const stems = portfolioItems.filter(item => item.type === 'stem');
  
  // Display featured items first
  const sortedExamples = [...examples].sort((a, b) => 
    (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
  );
  
  // Limit the number of examples shown if showAll is false
  const displayedExamples = showAll ? sortedExamples : sortedExamples.slice(0, 3);

  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-20">
        <TabsList className="grid grid-cols-3 max-w-md mx-auto mb-10">
          <TabsTrigger value="exemplos" className="data-[state=active]:bg-harmonia-green">
            Exemplos
          </TabsTrigger>
          <TabsTrigger value="comparacoes" className="data-[state=active]:bg-harmonia-green">
            Comparações
          </TabsTrigger>
          <TabsTrigger value="stems" className="data-[state=active]:bg-harmonia-green">
            Stems
          </TabsTrigger>
        </TabsList>

        <TabsContent value="exemplos" className="space-y-8">
          {displayedExamples.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedExamples.map(example => (
                <AudioCard
                  key={example.id}
                  title={example.title}
                  description={example.description}
                  audioUrl={example.audioUrl}
                  featured={example.featured}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">Nenhum exemplo disponível no momento.</p>
            </div>
          )}
          
          {!showAll && sortedExamples.length > 3 && (
            <div className="flex justify-center mt-8">
              <Button 
                variant="outline" 
                onClick={onShowMore}
                className="flex items-center"
              >
                Ver Mais Exemplos
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="comparacoes">
          {comparisons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {comparisons.map(example => (
                <AudioCard
                  key={example.id}
                  title={example.title}
                  description={example.description}
                  audioUrl={example.audioUrl}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">Nenhuma comparação disponível no momento.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="stems">
          {stems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stems.map(example => (
                <AudioCard
                  key={example.id}
                  title={example.title}
                  description={example.description}
                  audioUrl={example.audioUrl}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">Nenhum stem disponível no momento.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
};

export default PortfolioTabs;
