
import React, { useState } from 'react';
import PortfolioTabs from './portfolio/PortfolioTabs';
import PortfolioSummary from './portfolio/PortfolioSummary';
import { initialExamples, extraExamples, comparisonExamples, AudioExample } from './portfolio/audioData';

const Portfolio: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [examples, setExamples] = useState<AudioExample[]>(initialExamples);
  
  const handleShowMore = () => {
    setShowAll(true);
    setExamples([...initialExamples, ...extraExamples]);
  };
  
  return (
    <section id="portfolio" className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Nosso Portfolio</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Ouça exemplos de músicas personalizadas criadas pela nossa equipe para diversos clientes e ocasiões.
          </p>
        </div>
        
        <PortfolioSummary />
        
        <div className="mt-12">
          <PortfolioTabs 
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            examples={showAll ? examples : initialExamples}
            comparisonExamples={comparisonExamples}
          />
          
          {!showAll && (
            <div className="text-center mt-8">
              <button
                onClick={handleShowMore}
                className="bg-harmonia-green hover:bg-harmonia-green/90 text-white px-6 py-2 rounded-md"
              >
                Ver mais exemplos
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
