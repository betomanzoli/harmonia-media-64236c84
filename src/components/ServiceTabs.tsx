
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Gift, Briefcase, Building } from 'lucide-react';
import ServiceCard from './ServiceCard';
import { siteConfig } from "@/config/site";

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
          price="R$ 219,00"
          description="Ideal para presentes emocionais rápidos."
          features={[
            "Composição musical única",
            "Uma revisão gratuita",
            "Uso exclusivamente pessoal",
            "Entrega digital em até 7 dias",
            "Suporte por e-mail",
            "Arquivo digital em alta qualidade (MP3/WAV)",
            "Certificado digital de autoria"
          ]}
        />
        <ServiceCard 
          title="Pacote Profissional" 
          price="R$ 479,00"
          description="Perfeito para criadores de conteúdo e pequenos negócios."
          features={[
            "Composição musical personalizada",
            "Até três revisões gratuitas",
            "Licença para uso em conteúdo digital próprio",
            "Três versões para escolha",
            "Entrega em até 5 dias",
            "Suporte prioritário",
            "Masterização básica IA",
            "Stems separados (vocais + instrumentação)"
          ]}
          recommended={true}
        />
        <ServiceCard 
          title="Pacote Premium" 
          price="R$ 969,00"
          description="Melhor opção para empresas e projetos corporativos."
          features={[
            "Composição totalmente personalizada",
            "Revisões ilimitadas (até aprovação)*",
            "Cessão total dos direitos autorais",
            "Cinco versões para escolha",
            "Registro na Biblioteca Nacional",
            "Consultoria de 30 minutos",
            "Entrega prioritária",
            "Suporte VIP por WhatsApp",
            "Partitura em formato MusicXML"
          ]}
        />
      </TabsContent>

      <TabsContent value="presentes" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ServiceCard 
          title="Pacote Essencial" 
          price="R$ 219,00"
          description="Ideal para presentes emocionais rápidos."
          features={[
            "Composição musical única",
            "Uma revisão gratuita",
            "Uso exclusivamente pessoal",
            "Entrega digital em até 7 dias",
            "Suporte por e-mail",
            "Arquivo digital em alta qualidade (MP3/WAV)",
            "Certificado digital de autoria"
          ]}
          recommended={true}
        />
      </TabsContent>

      <TabsContent value="profissionais" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ServiceCard 
          title="Pacote Profissional" 
          price="R$ 479,00"
          description="Perfeito para criadores de conteúdo e pequenos negócios."
          features={[
            "Composição musical personalizada",
            "Até três revisões gratuitas",
            "Licença para uso em conteúdo digital próprio",
            "Três versões para escolha",
            "Entrega em até 5 dias",
            "Suporte prioritário",
            "Masterização básica IA",
            "Stems separados (vocais + instrumentação)"
          ]}
          recommended={true}
        />
      </TabsContent>

      <TabsContent value="enterprise" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ServiceCard 
          title="Pacote Premium" 
          price="R$ 969,00"
          description="Melhor opção para empresas e projetos corporativos."
          features={[
            "Composição totalmente personalizada",
            "Revisões ilimitadas (até aprovação)*",
            "Cessão total dos direitos autorais",
            "Cinco versões para escolha",
            "Registro na Biblioteca Nacional",
            "Consultoria de 30 minutos",
            "Entrega prioritária",
            "Suporte VIP por WhatsApp",
            "Partitura em formato MusicXML"
          ]}
          recommended={true}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ServiceTabs;
