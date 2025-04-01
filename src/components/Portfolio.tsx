
import React, { useState } from 'react';
import AudioPlayer from './AudioPlayer';
import { Button } from "@/components/ui/button";
import { Plus, FileAudio, Volume2, Music, Sliders, Layers } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Portfolio: React.FC = () => {
  const [showAll, setShowAll] = useState(false);

  const initialExamples = [
    {
      title: "Canção do Amor Familiar",
      subtitle: "Pacote Essencial - Aniversário",
      audioSrc: "https://example.com/audio1.mp3",
      genre: "Pop/Acústico",
      type: "completa"
    },
    {
      title: "Jingle Corporativo Tech Solutions",
      subtitle: "Pacote Profissional - Marketing",
      audioSrc: "https://example.com/audio2.mp3",
      genre: "Eletrônico/Corporativo",
      type: "completa"
    },
    {
      title: "Hino Oficial da Escola XYZ",
      subtitle: "Pacote Premium - Institucional",
      audioSrc: "https://example.com/audio3.mp3",
      genre: "Orquestral/Coral",
      type: "completa"
    },
    {
      title: "Tema de Casamento para Maria e João",
      subtitle: "Pacote Essencial - Casamento",
      audioSrc: "https://example.com/audio4.mp3",
      genre: "Clássico/Romântico",
      type: "completa"
    }
  ];

  const extraExamples = [
    {
      title: "Música Instrumental para Meditação",
      subtitle: "Pacote Profissional - Bem-estar",
      audioSrc: "https://example.com/audio5.mp3",
      genre: "Ambient/New Age",
      type: "instrumental"
    },
    {
      title: "Tema para Podcast Educativo",
      subtitle: "Pacote Essencial - Podcast",
      audioSrc: "https://example.com/audio6.mp3",
      genre: "Lo-fi/Instrumental",
      type: "instrumental"
    },
    {
      title: "Abertura para Canal no YouTube",
      subtitle: "Pacote Profissional - Digital",
      audioSrc: "https://example.com/audio7.mp3",
      genre: "Eletrônico/Pop",
      type: "completa"
    },
    {
      title: "Trilha para Vídeo Institucional",
      subtitle: "Pacote Premium - Corporativo",
      audioSrc: "https://example.com/audio8.mp3",
      genre: "Corporativo/Orquestral",
      type: "completa"
    }
  ];

  // Stems separados e exemplos de comparação
  const comparisonExamples = [
    // Exemplo de comparação entre masterizado e não masterizado
    {
      title: "Comparação: Masterizado vs. Não Masterizado",
      subtitle: "Veja a diferença na qualidade sonora",
      versions: [
        {
          name: "Versão Não Masterizada",
          audioSrc: "https://example.com/not-mastered.mp3",
          description: "Mix básico sem ajustes finais"
        },
        {
          name: "Versão Masterizada",
          audioSrc: "https://example.com/mastered.mp3",
          description: "Qualidade profissional com masterização"
        }
      ],
      type: "comparison"
    },
    // Exemplo de stems separados
    {
      title: "Stems Separados: Composição Rock",
      subtitle: "Ouça cada instrumento individualmente",
      versions: [
        {
          name: "Música Completa",
          audioSrc: "https://example.com/full-rock.mp3",
          description: "Composição final com todos os instrumentos"
        },
        {
          name: "Vocal",
          audioSrc: "https://example.com/vocal-stem.mp3",
          description: "Apenas a faixa vocal"
        },
        {
          name: "Guitarra",
          audioSrc: "https://example.com/guitar-stem.mp3",
          description: "Apenas a faixa de guitarra"
        },
        {
          name: "Bateria",
          audioSrc: "https://example.com/drum-stem.mp3",
          description: "Apenas a faixa de bateria"
        },
        {
          name: "Baixo",
          audioSrc: "https://example.com/bass-stem.mp3",
          description: "Apenas a faixa de baixo"
        }
      ],
      type: "stems"
    },
    // Comparação entre pacotes
    {
      title: "Comparação entre Pacotes: Música de Casamento",
      subtitle: "Ouça as diferenças entre os pacotes",
      versions: [
        {
          name: "Pacote Essencial",
          audioSrc: "https://example.com/wedding-basic.mp3",
          description: "Qualidade básica, sem masterização"
        },
        {
          name: "Pacote Profissional",
          audioSrc: "https://example.com/wedding-pro.mp3",
          description: "Com masterização e arranjo aprimorado"
        },
        {
          name: "Pacote Premium",
          audioSrc: "https://example.com/wedding-premium.mp3",
          description: "Com orquestra completa e masterização premium"
        }
      ],
      type: "comparison"
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
      
      <Tabs defaultValue="exemplos" className="w-full mb-10">
        <TabsList className="grid grid-cols-3 max-w-md mx-auto">
          <TabsTrigger value="exemplos" className="data-[state=active]:bg-harmonia-green">
            <Music className="w-4 h-4 mr-1" /> Exemplos
          </TabsTrigger>
          <TabsTrigger value="comparacoes" className="data-[state=active]:bg-harmonia-green">
            <Sliders className="w-4 h-4 mr-1" /> Comparações
          </TabsTrigger>
          <TabsTrigger value="stems" className="data-[state=active]:bg-harmonia-green">
            <Layers className="w-4 h-4 mr-1" /> Stems
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="exemplos" className="mt-6">
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
                    {example.type === "instrumental" ? (
                      <Volume2 className="w-4 h-4 text-harmonia-green" />
                    ) : (
                      <FileAudio className="w-4 h-4 text-harmonia-green" />
                    )}
                    <span className="text-xs text-gray-400">
                      {example.type === "instrumental" ? "Instrumental" : "Disponível em alta qualidade"}
                    </span>
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
        </TabsContent>
        
        <TabsContent value="comparacoes" className="mt-6">
          <div className="space-y-10">
            {comparisonExamples.filter(ex => ex.type === "comparison").map((example, index) => (
              <div key={index} className="border border-border rounded-lg overflow-hidden bg-card">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold">{example.title}</h3>
                  <p className="text-gray-400 text-sm">{example.subtitle}</p>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {example.versions.map((version, vIndex) => (
                    <div key={vIndex} className="border border-border rounded-lg overflow-hidden">
                      <div className="p-3 bg-background/40 border-b border-border">
                        <h4 className="text-sm font-medium">{version.name}</h4>
                        <p className="text-xs text-gray-400">{version.description}</p>
                      </div>
                      <AudioPlayer 
                        title={version.name} 
                        subtitle={example.title} 
                        audioSrc={version.audioSrc} 
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="stems" className="mt-6">
          <div className="space-y-10">
            {comparisonExamples.filter(ex => ex.type === "stems").map((example, index) => (
              <div key={index} className="border border-border rounded-lg overflow-hidden bg-card">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold">{example.title}</h3>
                  <p className="text-gray-400 text-sm">{example.subtitle}</p>
                </div>
                <div className="p-6 space-y-6">
                  {example.versions.map((version, vIndex) => (
                    <div key={vIndex} className="border border-border rounded-lg overflow-hidden">
                      <div className="p-3 bg-background/40 border-b border-border">
                        <h4 className="text-sm font-medium">{version.name}</h4>
                        <p className="text-xs text-gray-400">{version.description}</p>
                      </div>
                      <AudioPlayer 
                        title={version.name} 
                        subtitle={example.title} 
                        audioSrc={version.audioSrc} 
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

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
