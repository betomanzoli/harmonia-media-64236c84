
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Services from './Services';

const ServicesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Services />
      <Footer />
    </div>
  );
};

export default ServicesPage;
