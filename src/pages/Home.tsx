
import React from 'react';
import PublicLayout from '@/layouts/PublicLayout';
import Hero from '@/components/Hero';
import Process from '@/components/Process';
import Services from '@/components/Services';
import Portfolio from '@/components/Portfolio';
import Testimonials from '@/components/Testimonials';
import Partnership from '@/components/Partnership';

const Home: React.FC = () => {
  return (
    <PublicLayout>
      <Hero />
      <Process />
      <Services />
      <Portfolio />
      <Testimonials />
      <Partnership />
    </PublicLayout>
  );
};

export default Home;
