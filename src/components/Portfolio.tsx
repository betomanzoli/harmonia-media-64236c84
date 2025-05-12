
import React, { useState } from 'react';
import PortfolioTabs from './portfolio/PortfolioTabs';
import PortfolioSummary from './portfolio/PortfolioSummary';
import { initialExamples, extraExamples, comparisonExamples } from './portfolio/audioData';

const Portfolio: React.FC = () => {
  const [showAll, setShowAll] = useState(false);

  const handleShowMore = () => {
    setShowAll(true);
  };

  return (
    <section id="portfolio" className="py-20 px-6 md:px-10 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Ouça algumas das histórias que transformamos em música</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Cada composição é única e feita especificamente para atender aos desejos e necessidades de nossos clientes.
        </p>
      </div>
      
      <PortfolioTabs 
        initialExamples={initialExamples}
        extraExamples={extraExamples}
        comparisonExamples={comparisonExamples}
        showAll={showAll}
        onShowMore={handleShowMore}
      />

      <PortfolioSummary />
    </section>
  );
};

export default Portfolio;
