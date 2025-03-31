
import React from 'react';
import AudioPlayer from './AudioPlayer';

const Portfolio: React.FC = () => {
  return (
    <section id="portfolio" className="py-20 px-6 md:px-10 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Ouça algumas das histórias que transformamos em música</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Cada composição é única e feita especificamente para atender aos desejos e necessidades de nossos clientes.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AudioPlayer 
          title="Canção do Amor Familiar" 
          subtitle="Pacote Essencial - Aniversário" 
          audioSrc="https://example.com/audio1.mp3" 
        />
        <AudioPlayer 
          title="Jingle Corporativo Tech Solutions" 
          subtitle="Pacote Profissional - Marketing" 
          audioSrc="https://example.com/audio2.mp3" 
        />
        <AudioPlayer 
          title="Hino Oficial da Escola XYZ" 
          subtitle="Pacote Premium - Institucional" 
          audioSrc="https://example.com/audio3.mp3" 
        />
        <AudioPlayer 
          title="Tema de Casamento para Maria e João" 
          subtitle="Pacote Essencial - Casamento" 
          audioSrc="https://example.com/audio4.mp3" 
        />
      </div>
    </section>
  );
};

export default Portfolio;
