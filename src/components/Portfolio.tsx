import React, { useState } from 'react';
import PortfolioTabs from './portfolio/PortfolioTabs';
import PortfolioSummary from './portfolio/PortfolioSummary';
import { initialExamples, extraExamples, comparisonExamples, AudioExample } from './portfolio/audioData';
const Portfolio: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const handleShowMore = () => {
    setShowAll(true);
  };
  return;
};
export default Portfolio;