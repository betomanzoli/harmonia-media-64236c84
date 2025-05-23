
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import AudioCard from '@/components/portfolio/AudioCard';
import ComparisonPlayer from '@/components/portfolio/ComparisonPlayer';
import AudioVersions from '@/components/portfolio/AudioVersions';
import PortfolioSummary from '@/components/portfolio/PortfolioSummary';
import { audioExamples, initialExamples, extraExamples, featuredExamples, comparisonExamples } from '@/components/portfolio/audioData';
import ExamplesList from '@/components/portfolio/ExamplesList';

const PortfolioPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAll, setShowAll] = useState(false);
  
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };
  
  const handleShowMore = () => {
    setShowAll(true);
  };

  const filteredExamples = selectedCategory === 'all' 
    ? audioExamples 
    : audioExamples.filter(example => example.category.includes(selectedCategory));
    
  const categories = [
    { id: 'all', name: 'Todos' },
    { id: 'Casamento', name: 'Casamentos' },
    { id: 'Corporativo', name: 'Corporativo' },
    { id: 'Romântico', name: 'Romântico' },
    { id: 'Publicidade', name: 'Publicidade' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-harmonia-green/10 to-background py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center">
            Nosso Portfólio Musical
          </h1>
          <p className="text-xl text-center mt-4 text-gray-600 max-w-3xl mx-auto">
            Conheça exemplos de nossos projetos de composição musical, arranjos e produções personalizadas.
          </p>
        </div>
      </div>

      {/* Portfolio Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Featured Examples Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Destaques</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredExamples.map((example, index) => (
              <AudioCard 
                key={index}
                title={example.title}
                description={example.description}
                audioUrl={example.audioUrl}
                featured={true}
                imageUrl={example.imageUrl}
                tags={example.tags}
              />
            ))}
          </div>
        </section>

        {/* Category Tabs */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Exemplos por Categoria</h2>
          
          <Tabs 
            defaultValue="all" 
            value={selectedCategory} 
            onValueChange={handleCategorySelect}
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
                onShowMore={handleShowMore}
              />
            </TabsContent>
          </Tabs>
        </section>

        {/* Comparison Players Section */}
        {comparisonExamples.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Antes e Depois</h2>
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
          </section>
        )}

        {/* Stems Comparison Example */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Exemplos de Stems</h2>
          <AudioVersions
            title="Música Pop - Composição e Produção"
            subtitle="Exemplos de stems separados"
            type="stems"
            versions={[
              {
                name: "Vocal Principal",
                audioSrc: "https://sample-music.com/stems-vocal.mp3",
                description: "Vocal isolado da faixa principal"
              },
              {
                name: "Instrumental Base",
                audioSrc: "https://sample-music.com/stems-instrumental.mp3",
                description: "Base instrumental completa"
              },
              {
                name: "Percussão",
                audioSrc: "https://sample-music.com/stems-drums.mp3",
                description: "Elementos de percussão isolados"
              }
            ]}
          />
        </section>

        {/* Portfolio Summary */}
        <PortfolioSummary />
      </div>
    </div>
  );
};

export default PortfolioPage;
