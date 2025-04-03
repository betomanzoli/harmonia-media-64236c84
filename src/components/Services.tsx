
import React from 'react';
import ServicesHeader from './services/ServicesHeader';
import ServicesList from './services/ServicesList';

const Services: React.FC = () => {
  return (
    <section id="servicos" className="py-20 px-6 md:px-10 max-w-7xl mx-auto">
      <ServicesHeader />
      <ServicesList />
    </section>
  );
};

export default Services;
