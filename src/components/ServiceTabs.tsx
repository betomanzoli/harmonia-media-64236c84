
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Gift, Briefcase, Building, Zap } from 'lucide-react';
import ServiceCard from './ServiceCard';
import { siteConfig } from "@/config/site";

interface ServiceTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const ServiceTabs: React.FC<ServiceTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <Tabs defaultValue="todos" className="w-full" onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-5 max-w-2xl mx-auto mb-10">
        <TabsTrigger value="todos" className="data-[state=active]:bg-harmonia-green">
          Todos
        </TabsTrigger>
        <TabsTrigger value="express" className="data-[state=active]:bg-harmonia-green">
          <Zap className="w-4 h-4 mr-1" /> Express
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

      <TabsContent value="todos" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ServiceCard 
          title="Pacote Express" 
          price="R$ 79,00"
          description="Para quem quer resultados rápidos."
          features={[
            "COM LETRA: 6 versões da SUA letra em estilos diferentes",
            "SEM LETRA: 3 letras diferentes + 2 versões de cada",
            "Arquivos de áudio em MP3",
            "Baseado em 1 briefing simples",
            "Prazo: 2-3 dias úteis",
            "Uso pessoal não-comercial",
            "Ideal para presentes e testes"
          ]}
        />
        <ServiceCard 
          title="Pacote Essencial" 
          price="R$ 219,00"
          description="Ideal para presentes emocionais."
          features={[
            "Composição musical única",
            "Uma revisão gratuita",
            "Masterização",
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
            "Masterização IA",
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
            "Masterização IA",
            "Consultoria de 30 minutos",
            "Entrega prioritária",
            "Suporte VIP por WhatsApp",
            "Partitura em formato MusicXML"
          ]}
        />
      </TabsContent>

      <TabsContent value="express" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ServiceCard 
          title="Pacote Express" 
          price="R$ 79,00"
          description="Para quem quer resultados rápidos."
          features={[
            "COM LETRA: 6 versões da SUA letra em estilos diferentes",
            "SEM LETRA: 3 letras diferentes + 2 versões de cada",
            "Arquivos de áudio em MP3",
            "Baseado em 1 briefing simples",
            "Prazo: 2-3 dias úteis",
            "Uso pessoal não-comercial",
            "Ideal para presentes e testes"
          ]}
          recommended={true}
        />
      </TabsContent>

      <TabsContent value="presentes" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ServiceCard 
          title="Pacote Express" 
          price="R$ 79,00"
          description="Para quem quer resultados rápidos."
          features={[
            "COM LETRA: 6 versões da SUA letra em estilos diferentes",
            "SEM LETRA: 3 letras diferentes + 2 versões de cada",
            "Arquivos de áudio em MP3",
            "Baseado em 1 briefing simples",
            "Prazo: 2-3 dias úteis",
            "Uso pessoal não-comercial",
            "Ideal para presentes e testes"
          ]}
        />
        <ServiceCard 
          title="Pacote Essencial" 
          price="R$ 219,00"
          description="Ideal para presentes emocionais."
          features={[
            "Composição musical única",
            "Uma revisão gratuita",
            "Masterização",
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
            "Masterização IA",
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
            "Masterização IA",
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
