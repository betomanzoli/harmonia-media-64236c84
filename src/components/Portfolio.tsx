
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
    <div className="mb-12">
      <PortfolioSummary />
      <PortfolioTabs 
        examples={examples} 
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        showAll={showAll}
        onShowMore={handleShowMore}
      />
    </div>
  );
};

export default Portfolio;
