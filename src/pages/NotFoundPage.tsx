
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-20 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl mb-8">Página não encontrada</p>
        <Link to="/" className="text-harmonia-green hover:underline">
          Voltar para a página inicial
        </Link>
      </main>
      <Footer />
    </div>
  );
};

export default NotFoundPage;
