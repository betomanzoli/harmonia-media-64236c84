
import React, { useState } from 'react';
import PortfolioTabs from './portfolio/PortfolioTabs';
import PortfolioSummary from './portfolio/PortfolioSummary';
import { initialExamples, extraExamples, comparisonExamples, AudioExample } from './portfolio/audioData';

const Portfolio: React.FC = () => {
  const [showAll, setShowAll] = useState(false);

  const handleShowMore = () => {
    setShowAll(true);
  };

  return (
    <section id="portfolio" className="py-20 px-6 md:px-10 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Portfolio de Composições</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Ouça algumas de nossas composições musicais personalizadas e veja como podemos transformar sua história em música.
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
      </div>
    </section>
  );
};

export default Portfolio;
