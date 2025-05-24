
import React from 'react';
import Portfolio from '@/components/Portfolio';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PortfolioPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <Portfolio />
      </main>
      <Footer />
    </div>
  );
};

export default PortfolioPage;
