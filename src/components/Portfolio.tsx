
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
    <section className="py-12">
      <div className="container mx-auto px-4">
        <PortfolioSummary />
        
        <PortfolioTabs 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          examples={examples}
          showAll={showAll}
          onShowMore={handleShowMore}
        />
      </div>
    </section>
  );
};

export default Portfolio;
