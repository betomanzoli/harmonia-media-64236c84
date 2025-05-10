
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
    <section className="py-16 px-6 bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <PortfolioSummary />
        
        <div className="mt-12">
          <PortfolioTabs 
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            examples={examples}
            comparisonExamples={comparisonExamples}
          />
        </div>
        
        {!showAll && (
          <div className="text-center mt-8">
            <button
              onClick={handleShowMore}
              className="text-harmonia-green hover:text-harmonia-green/80 font-medium"
            >
              Ver mais exemplos
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Portfolio;
