
import React from 'react';
import PublicLayout from '@/layouts/PublicLayout';
import Hero from '@/components/Hero';
import Process from '@/components/Process';
import Services from '@/components/Services';
import Portfolio from '@/components/Portfolio';
import Testimonials from '@/components/Testimonials';
import Partnership from '@/components/Partnership';
import ServiceExtras from '@/components/ServiceExtras';

const Home: React.FC = () => {
  const handleExtraServiceClick = (serviceId: string) => {
    console.log('Extra service clicked on Home page:', serviceId);
    // Implementação adicional se necessário
  };

  return (
    <PublicLayout>
      <Hero />
      <Process />
      <Services />
      <Portfolio />
      <Testimonials />
      <ServiceExtras onExtraServiceClick={handleExtraServiceClick} />
      <Partnership />
    </PublicLayout>
  );
};

export default Home;
