
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const Services: React.FC = () => {
  const [activeTab, setActiveTab] = useState('todos');

  return (
    <section id="servicos" className="py-20 px-6 md:px-10 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Nossos Serviços</h1>
        <p className="text-gray-500 max-w-3xl mx-auto">
          A harmonIA oferece serviços personalizados de composição e produção musical 
          para transformar sua história, emoção ou ideia em uma música única e inesquecível.
        </p>
      </div>
      
      <ServiceTabs 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
    </section>
  );
};

interface ServiceTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ServiceTabs: React.FC<ServiceTabsProps> = ({ activeTab, setActiveTab }) => {
  const [currentTab, setCurrentTab] = useState(activeTab || 'todos');
  
  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    setActiveTab(value);
  };
  
  const categories = [
    { id: 'todos', name: 'Todos' },
    { id: 'eventos', name: 'Eventos' },
    { id: 'videos', name: 'Vídeos' },
    { id: 'pessoais', name: 'Pessoais' }
  ];
  
  return (
    <Tabs
      defaultValue={currentTab}
      className="w-full"
      onValueChange={handleTabChange}
    >
      <div className="flex justify-center mb-8">
        <TabsList>
          {categories.map((category) => (
            <TabsTrigger 
              key={category.id} 
              value={category.id}
              className="px-6"
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      
      <TabsContent value="todos">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ServiceCard 
            title="Músicas para Eventos"
            description="Composições únicas para casamentos, aniversários e ocasiões especiais."
            icon="🎵"
          />
          <ServiceCard 
            title="Trilhas para Vídeos"
            description="Música personalizada para seus conteúdos digitais e apresentações."
            icon="🎬"
          />
          <ServiceCard 
            title="Projetos Pessoais"
            description="Transforme sua história ou poema em uma canção inesquecível."
            icon="❤️"
          />
        </div>
      </TabsContent>
      
      <TabsContent value="eventos">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ServiceCard 
            title="Músicas para Casamentos"
            description="Crie uma música única para o seu dia especial."
            icon="💍"
          />
          <ServiceCard 
            title="Músicas para Aniversários"
            description="Celebre uma data importante com uma composição personalizada."
            icon="🎂"
          />
        </div>
      </TabsContent>
      
      <TabsContent value="videos">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ServiceCard 
            title="Trilhas para YouTube"
            description="Música original para seus vídeos na internet."
            icon="📱"
          />
          <ServiceCard 
            title="Música para Apresentações"
            description="Eleve suas apresentações profissionais com trilhas exclusivas."
            icon="💼"
          />
        </div>
      </TabsContent>
      
      <TabsContent value="pessoais">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ServiceCard 
            title="Histórias em Canções"
            description="Transforme lembranças em música."
            icon="📖"
          />
          <ServiceCard 
            title="Poemas Musicados"
            description="Seus versos transformados em melodias."
            icon="📝"
          />
        </div>
      </TabsContent>
    </Tabs>
  );
};

interface ServiceCardProps {
  title: string;
  description: string;
  icon: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, icon }) => {
  return (
    <div className="bg-card p-6 rounded-lg text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
};

export default Services;
