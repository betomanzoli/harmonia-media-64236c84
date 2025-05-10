
import React from 'react';
import PublicLayout from '@/layouts/PublicLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Headphones } from 'lucide-react';

const Portfolio: React.FC = () => {
  const portfolioItems = [
    {
      id: 1,
      title: "Canção de Aniversário Personalizada",
      description: "Música criada para celebrar o aniversário de 40 anos de Maria.",
      audioUrl: "/audio/sample1.mp3",
      type: "Presente",
      testimonial: "Foi um presente inesquecível! Todo mundo se emocionou quando a música tocou na festa."
    },
    {
      id: 2,
      title: "Música Corporativa para Lançamento",
      description: "Tema musical criado para o lançamento da nova linha de produtos da empresa Natura.",
      audioUrl: "/audio/sample2.mp3",
      type: "Corporativo",
      testimonial: "A música capturou perfeitamente a essência da nossa marca. Foi um diferencial no evento de lançamento."
    },
    {
      id: 3,
      title: "Declaração de Amor em Melodia",
      description: "Canção romântica criada para um pedido de casamento.",
      audioUrl: "/audio/sample3.mp3",
      type: "Presente",
      testimonial: "Ela disse sim! A música foi fundamental para criar o momento perfeito."
    },
    {
      id: 4,
      title: "Jingle Publicitário",
      description: "Jingle criado para campanha de marketing digital da empresa XYZ.",
      audioUrl: "/audio/sample4.mp3",
      type: "Comercial",
      testimonial: "O jingle ficou na cabeça de todos. Nossa marca ganhou muito reconhecimento após a campanha."
    }
  ];

  return (
    <PublicLayout>
      <div className="pt-24 pb-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Nosso Portfólio</h1>
            <p className="text-gray-500 max-w-3xl mx-auto">
              Confira algumas das músicas que criamos para nossos clientes. Cada composição é única e personalizada para atender às necessidades específicas de cada projeto.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {portfolioItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{item.title}</h3>
                      <span className="inline-block px-3 py-1 rounded-full bg-harmonia-green/10 text-harmonia-green text-xs mt-2">
                        {item.type}
                      </span>
                    </div>
                    <Button size="sm" variant="outline" className="flex items-center gap-1">
                      <Headphones className="h-4 w-4" />
                      <span>Ouvir</span>
                    </Button>
                  </div>
                  
                  <p className="text-gray-500 mb-4">{item.description}</p>
                  
                  <div className="bg-gray-50 p-4 rounded-md italic text-sm">
                    "{item.testimonial}"
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-500 mb-6">
              Estes são apenas alguns exemplos do nosso trabalho. Cada projeto é único e personalizado de acordo com as necessidades do cliente.
            </p>
            <Button className="bg-harmonia-green hover:bg-harmonia-green/90">
              Crie sua música personalizada
            </Button>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Portfolio;
