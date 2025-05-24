
import React from 'react';
import Hero from '@/components/Hero';
import Process from '@/components/Process';
import Services from '@/components/Services';
import Portfolio from '@/components/Portfolio';
import Testimonials from '@/components/Testimonials';
import Partnership from '@/components/Partnership';
import Contact from '@/components/Contact';

const HomePage: React.FC = () => {
  return (
    <div className="bg-black text-white">
      <Hero />
      <Process />
      <Services />
      <Portfolio />
      <Testimonials />
      <Partnership />
      <Contact />
    </div>
  );
};

export default HomePage;
