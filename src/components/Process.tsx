
import React from 'react';

const Process: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Briefing',
      description: 'Conte-nos sua história ou ideia através do nosso formulário intuitivo.'
    },
    {
      number: '02',
      title: 'Composição',
      description: 'Nossa equipe de músicos trabalha na criação da sua música personalizada.'
    },
    {
      number: '03',
      title: 'Feedback',
      description: 'Ouça a prévia e solicite ajustes para garantir que a música seja perfeita.'
    },
    {
      number: '04',
      title: 'Entrega Final',
      description: 'Receba sua música finalizada em alta qualidade pronta para usar.'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          Como funciona
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="bg-card p-6 rounded-lg">
              <div className="text-4xl font-bold text-harmonia-green mb-4">{step.number}</div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
