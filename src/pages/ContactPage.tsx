
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Contato</h1>
        <p className="text-lg">Entre em contato conosco para mais informações.</p>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
