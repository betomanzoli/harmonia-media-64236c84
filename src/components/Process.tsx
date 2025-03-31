
import React from 'react';
import ProcessStep from './ProcessStep';

const Process: React.FC = () => {
  return (
    <section id="processo" className="py-20 px-6 md:px-10 bg-secondary">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Transforme sua ideia em música perfeita, em 3 passos</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Nosso processo combina tecnologia de ponta com expertise musical para criar composições únicas e emocionantes.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ProcessStep 
            number="1"
            title="Briefing Personalizado"
            description="Conte sua história ou objetivo musical em até 3 frases usando nosso formulário simples."
          />
          <ProcessStep 
            number="2"
            title="Produção com IA + Humanos"
            description="Nossa IA gera as bases musicais, que são refinadas por músicos profissionais para garantir qualidade máxima."
          />
          <ProcessStep 
            number="3"
            title="Entrega Rápida e Segura"
            description="Receba sua música finalizada em até 72h, com certificados digitais e opções de registro legal."
          />
        </div>
      </div>
    </section>
  );
};

export default Process;
