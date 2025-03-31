
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Gift, Briefcase, Building } from 'lucide-react';
import ServiceCard from './ServiceCard';

const Services: React.FC = () => {
  const [activeTab, setActiveTab] = useState("todos");

  return (
    <section id="servicos" className="py-20 px-6 md:px-10 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Nossos Serviços</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Escolha o pacote ideal para suas necessidades musicais. Todos incluem composição com IA e aprimoramento por músicos profissionais.
        </p>
      </div>

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
              "Música gerada por IA + revisão humana",
              "Certificado digital incluso",
              "Entrega em até 48 horas",
              "1 revisão gratuita"
            ]}
          />
          <ServiceCard 
            title="Pacote Profissional" 
            price="R$479"
            description="Perfeito para criadores de conteúdo e pequenos negócios."
            features={[
              "3 variações + stems separados",
              "Registro blockchain CBL incluso",
              "Entrega em até 72 horas",
              "3 revisões gratuitas",
              "Formato adequado para plataformas digitais"
            ]}
            recommended={true}
          />
          <ServiceCard 
            title="Pacote Premium" 
            price="R$969"
            description="Melhor opção para empresas e projetos corporativos."
            features={[
              "5 variações + registro BN e partitura MusicXML",
              "Suporte pós-venda por 30 dias",
              "Entrega prioritária",
              "Revisões ilimitadas",
              "Licença comercial completa"
            ]}
          />
        </TabsContent>

        <TabsContent value="presentes" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ServiceCard 
            title="Pacote Essencial" 
            price="R$219"
            description="Ideal para presentes emocionais rápidos."
            features={[
              "Música gerada por IA + revisão humana",
              "Certificado digital incluso",
              "Entrega em até 48 horas",
              "1 revisão gratuita"
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
              "3 variações + stems separados",
              "Registro blockchain CBL incluso",
              "Entrega em até 72 horas",
              "3 revisões gratuitas",
              "Formato adequado para plataformas digitais"
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
              "5 variações + registro BN e partitura MusicXML",
              "Suporte pós-venda por 30 dias",
              "Entrega prioritária",
              "Revisões ilimitadas",
              "Licença comercial completa"
            ]}
            recommended={true}
          />
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default Services;
