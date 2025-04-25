
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Contact from '@/components/Contact';

const ContactPage: React.FC = () => {
  return (
    <div className="bg-background min-h-screen">
      <Header />
      <Contact />
      <Footer />
    </div>
  );
};

export default ContactPage;
