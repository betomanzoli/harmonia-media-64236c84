import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Gift, Briefcase, Building } from 'lucide-react';
import ServiceCard from './ServiceCard';

interface ServiceTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const ServiceTabs: React.FC<ServiceTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <Tabs defaultValue="todos" className="w-full" onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-4 max-w-md mx-auto mb-10">
        <TabsTrigger value="todos" className="data-[state=active]:bg-harmonia-green">
          Todos os Serviços
        </TabsTrigger>
        <TabsTrigger value="presentes" className="data-[state=active]:bg-harmonia-green">
          <Gift className="w-4 h-4 mr-1" /> Presentes
        </TabsTrigger>
        <TabsTrigger value="profissionais" className="data-[state=active]:bg-harmonia-green">
          <Briefcase className="w-4 h-4 mr-1" /> Profissionais
        </TabsTrigger>
        <TabsTrigger value="enterprise" className="data-[state=active]:bg-harmonia-green">
          <Building className="w-4 h-4 mr-1" /> Enterprise
        </TabsTrigger>
      </TabsList>

      <TabsContent value="todos" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ServiceCard 
          title="Pacote Essencial" 
          price="R$219"
          description="Ideal para presentes emocionais rápidos."
          features={[
            "1 composição musical via IA + supervisão/revisão humana",
            "1 revisão gratuita",
            "Arquivo digital em alta qualidade (MP3/WAV)",
            "Certificado digital de autoria",
            "Entrega em até 48 horas",
            "Uso permitido: Apenas pessoal, sem direitos comerciais"
          ]}
        />
        <ServiceCard 
          title="Pacote Profissional" 
          price="R$479"
          description="Perfeito para criadores de conteúdo e pequenos negócios."
          features={[
            "3 variações/propostas em estilos diferentes",
            "Masterização básica IA",
            "Stems separados (vocais + instrumentação)",
            "3 revisões gratuitas",
            "Entrega em até 72 horas",
            "Formato adequado para plataformas digitais",
            "Uso permitido: Uso em conteúdo digital próprio"
          ]}
          recommended={true}
        />
        <ServiceCard 
          title="Pacote Premium" 
          price="R$969"
          description="Melhor opção para empresas e projetos corporativos."
          features={[
            "5 variações/propostas de composição",
            "Masterização profissional IA",
            "Registro oficial na Biblioteca Nacional",
            "Partitura em formato MusicXML",
            "Stems completos separados",
            "Revisões ilimitadas (em 30 dias)",
            "Licença comercial completa",
            "Entrega prioritária",
            "Suporte pós-venda por 30 dias"
          ]}
        />
      </TabsContent>

      <TabsContent value="presentes" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ServiceCard 
          title="Pacote Essencial" 
          price="R$219"
          description="Ideal para presentes emocionais rápidos."
          features={[
            "1 composição musical via IA + supervisão/revisão humana",
            "1 revisão gratuita",
            "Arquivo digital em alta qualidade (MP3/WAV)",
            "Certificado digital de autoria",
            "Entrega em até 48 horas",
            "Uso permitido: Apenas pessoal, sem direitos comerciais"
          ]}
          recommended={true}
        />
      </TabsContent>

      <TabsContent value="profissionais" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ServiceCard 
          title="Pacote Profissional" 
          price="R$479"
          description="Perfeito para criadores de conteúdo e pequenos negócios."
          features={[
            "3 variações/propostas em estilos diferentes",
            "Masterização básica IA",
            "Stems separados (vocais + instrumentação)",
            "3 revisões gratuitas",
            "Entrega em até 72 horas",
            "Formato adequado para plataformas digitais",
            "Uso permitido: Uso em conteúdo digital próprio"
          ]}
          recommended={true}
        />
      </TabsContent>

      <TabsContent value="enterprise" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ServiceCard 
          title="Pacote Premium" 
          price="R$969"
          description="Melhor opção para empresas e projetos corporativos."
          features={[
            "5 variações/propostas de composição",
            "Masterização profissional IA",
            "Registro oficial na Biblioteca Nacional",
            "Partitura em formato MusicXML",
            "Stems completos separados",
            "Revisões ilimitadas (em 30 dias)",
            "Licença comercial completa",
            "Entrega prioritária",
            "Suporte pós-venda por 30 dias"
          ]}
          recommended={true}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ServiceTabs;
