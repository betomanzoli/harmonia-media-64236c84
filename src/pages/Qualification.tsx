
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import QualificationForm from '@/components/qualification/QualificationForm';

const Qualification: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-32 pb-20 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Qualificação Inicial</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Queremos conhecer melhor suas necessidades para oferecer a melhor solução musical para você.
              Preencha o formulário abaixo para começarmos nossa jornada criativa.
            </p>
          </div>
          
          <QualificationForm />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Qualification;
