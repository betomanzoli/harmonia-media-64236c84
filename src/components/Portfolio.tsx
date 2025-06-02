
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
        
        {/* Bandcamp Embeds Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Ouça Nosso Portfólio Completo</h2>
          <div className="flex flex-col lg:flex-row gap-6 justify-center items-center">
            <div className="w-full max-w-sm">
              <iframe 
                style={{ border: 0, width: '100%', height: '786px' }} 
                src="https://bandcamp.com/EmbeddedPlayer/album=3897753197/size=large/bgcol=ffffff/linkcol=2ebd35/transparent=true/campaign=mix-de-estilos/" 
                seamless
                title="Portifólio (Mix de Estilos)"
              >
                <a href="https://harmonia-media.bandcamp.com/album/portif-lio-mix-de-estilos">Portifólio (Mix de Estilos) by harmonIA</a>
              </iframe>
            </div>
            <div className="w-full max-w-sm">
              <iframe 
                style={{ border: 0, width: '100%', height: '786px' }} 
                src="https://bandcamp.com/EmbeddedPlayer/album=2774072802/size=large/bgcol=ffffff/linkcol=2ebd35/transparent=true/campaign=promocionais/" 
                seamless
                title="Promocionais"
              >
                <a href="https://harmonia-media.bandcamp.com/album/promocionais">Promocionais by harmonIA</a>
              </iframe>
            </div>
          </div>
        </div>
        
        <PortfolioTabs 
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          examples={examples}
          showAll={showAll}
          onShowMore={handleShowMore}
          comparisonExamples={comparisonExamples}
        />
      </div>
    </section>
  );
};

export default Portfolio;
