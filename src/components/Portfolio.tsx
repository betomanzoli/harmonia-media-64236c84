
import React, { useState } from 'react';
import AudioPlayer from './AudioPlayer';
import { Button } from "@/components/ui/button";
import { Plus, FileAudio } from 'lucide-react';

const Portfolio: React.FC = () => {
  const [showAll, setShowAll] = useState(false);

  const initialExamples = [
    {
      title: "Canção do Amor Familiar",
      subtitle: "Pacote Essencial - Aniversário",
      audioSrc: "https://example.com/audio1.mp3",
      genre: "Pop/Acústico"
    },
    {
      title: "Jingle Corporativo Tech Solutions",
      subtitle: "Pacote Profissional - Marketing",
      audioSrc: "https://example.com/audio2.mp3",
      genre: "Eletrônico/Corporativo"
    },
    {
      title: "Hino Oficial da Escola XYZ",
      subtitle: "Pacote Premium - Institucional",
      audioSrc: "https://example.com/audio3.mp3",
      genre: "Orquestral/Coral"
    },
    {
      title: "Tema de Casamento para Maria e João",
      subtitle: "Pacote Essencial - Casamento",
      audioSrc: "https://example.com/audio4.mp3",
      genre: "Clássico/Romântico"
    }
  ];

  const extraExamples = [
    {
      title: "Música Instrumental para Meditação",
      subtitle: "Pacote Profissional - Bem-estar",
      audioSrc: "https://example.com/audio5.mp3",
      genre: "Ambient/New Age"
    },
    {
      title: "Tema para Podcast Educativo",
      subtitle: "Pacote Essencial - Podcast",
      audioSrc: "https://example.com/audio6.mp3",
      genre: "Lo-fi/Instrumental"
    },
    {
      title: "Abertura para Canal no YouTube",
      subtitle: "Pacote Profissional - Digital",
      audioSrc: "https://example.com/audio7.mp3",
      genre: "Eletrônico/Pop"
    },
    {
      title: "Trilha para Vídeo Institucional",
      subtitle: "Pacote Premium - Corporativo",
      audioSrc: "https://example.com/audio8.mp3",
      genre: "Corporativo/Orquestral"
    },
    {
      title: "Música para Aniversário Infantil",
      subtitle: "Pacote Essencial - Infantil",
      audioSrc: "https://example.com/audio9.mp3",
      genre: "Pop/Infantil"
    },
    {
      title: "Tema Musical para Evento Esportivo",
      subtitle: "Pacote Premium - Eventos",
      audioSrc: "https://example.com/audio10.mp3",
      genre: "Rock/Épico"
    },
    {
      title: "Música Personalizada com Letra Temática",
      subtitle: "Pacote Profissional - Presente",
      audioSrc: "https://example.com/audio11.mp3",
      genre: "MPB/Acústico"
    },
    {
      title: "Instrumental para Apresentação de Dança",
      subtitle: "Pacote Premium - Artes",
      audioSrc: "https://example.com/audio12.mp3",
      genre: "Eletrônico/Clássico"
    }
  ];

  const displayedExamples = showAll ? [...initialExamples, ...extraExamples] : initialExamples;

  return (
    <section id="portfolio" className="py-20 px-6 md:px-10 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Ouça algumas das histórias que transformamos em música</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Cada composição é única e feita especificamente para atender aos desejos e necessidades de nossos clientes.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayedExamples.map((example, index) => (
          <div key={index} className="border border-border rounded-lg overflow-hidden bg-card hover:border-harmonia-green/40 transition-colors">
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold">{example.title}</h3>
              <div className="flex items-center justify-between">
                <p className="text-gray-400 text-sm">{example.subtitle}</p>
                <span className="text-xs bg-harmonia-green/20 text-harmonia-green px-2 py-1 rounded-full">
                  {example.genre}
                </span>
              </div>
            </div>
            <AudioPlayer 
              title={example.title} 
              subtitle={example.subtitle} 
              audioSrc={example.audioSrc} 
            />
            <div className="p-4 border-t border-border flex justify-between">
              <span className="text-xs text-gray-400">Ver detalhes do projeto</span>
              <div className="flex items-center gap-2">
                <FileAudio className="w-4 h-4 text-harmonia-green" />
                <span className="text-xs text-gray-400">Disponível em alta qualidade</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!showAll && (
        <div className="flex justify-center mt-10">
          <Button 
            onClick={() => setShowAll(true)} 
            variant="outline"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Carregar Mais Exemplos
          </Button>
        </div>
      )}

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 bg-card border border-border rounded-lg p-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">Comparações de Resultados</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-harmonia-green"></span>
              <span>Exemplos com e sem Masterização</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-harmonia-green"></span>
              <span>Stems Separados vs. Faixas Completas</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-harmonia-green"></span>
              <span>Comparação entre os Pacotes</span>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Gêneros Disponíveis</h3>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs bg-harmonia-green/20 text-harmonia-green px-2 py-1 rounded-full">Pop</span>
            <span className="text-xs bg-harmonia-green/20 text-harmonia-green px-2 py-1 rounded-full">Rock</span>
            <span className="text-xs bg-harmonia-green/20 text-harmonia-green px-2 py-1 rounded-full">MPB</span>
            <span className="text-xs bg-harmonia-green/20 text-harmonia-green px-2 py-1 rounded-full">Eletrônico</span>
            <span className="text-xs bg-harmonia-green/20 text-harmonia-green px-2 py-1 rounded-full">Clássico</span>
            <span className="text-xs bg-harmonia-green/20 text-harmonia-green px-2 py-1 rounded-full">Instrumental</span>
            <span className="text-xs bg-harmonia-green/20 text-harmonia-green px-2 py-1 rounded-full">Jazz</span>
            <span className="text-xs bg-harmonia-green/20 text-harmonia-green px-2 py-1 rounded-full">Samba</span>
            <span className="text-xs bg-harmonia-green/20 text-harmonia-green px-2 py-1 rounded-full">Bossa Nova</span>
            <span className="text-xs bg-harmonia-green/20 text-harmonia-green px-2 py-1 rounded-full">Country</span>
            <span className="text-xs bg-harmonia-green/20 text-harmonia-green px-2 py-1 rounded-full">Gospel</span>
            <span className="text-xs bg-harmonia-green/20 text-harmonia-green px-2 py-1 rounded-full">Metal</span>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Tipos de Projeto</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-harmonia-green"></span>
              <span>Presentes Personalizados</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-harmonia-green"></span>
              <span>Jingles Comerciais</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-harmonia-green"></span>
              <span>Trilhas para Vídeos</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-harmonia-green"></span>
              <span>Música para Eventos</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-harmonia-green"></span>
              <span>Podcasts e Streaming</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
