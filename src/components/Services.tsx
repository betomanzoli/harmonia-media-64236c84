
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Gift, Briefcase, Building, Plus, Music, Award, Clock, FileMusic, Sliders } from 'lucide-react';
import ServiceCard from './ServiceCard';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Services: React.FC = () => {
  const [activeTab, setActiveTab] = useState("todos");
  const { toast } = useToast();

  const handleExtraServiceClick = (service: string) => {
    toast({
      title: "Serviço Extra Selecionado",
      description: `Você selecionou o serviço: ${service}. Um de nossos atendentes entrará em contato.`,
    });

    // Scroll to the briefing form
    const briefingSection = document.getElementById('briefing');
    if (briefingSection) {
      briefingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

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

      {/* Serviços Extras Section */}
      <div className="mt-20">
        <h2 className="text-2xl font-bold mb-6 text-center">Serviços Extras</h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-center mb-10">
          Personalize sua experiência com estes serviços adicionais que podem ser contratados durante ou após o projeto.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Revisão Extra */}
          <div className="bg-card border border-border hover:border-harmonia-green/50 rounded-lg p-6 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <Music className="text-harmonia-green w-5 h-5" />
                <h3 className="font-semibold">Revisão Extra</h3>
              </div>
              <span className="text-harmonia-green font-bold">R$99</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Peça uma revisão adicional para ajustar a letra ou melodia da sua música.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="text-sm text-gray-300">• Prazo: Até 3 dias úteis após a solicitação</li>
              <li className="text-sm text-gray-300">• Disponível para todos os pacotes</li>
            </ul>
            <Button 
              onClick={() => handleExtraServiceClick("Revisão Extra")}
              className="w-full bg-secondary hover:bg-secondary/90"
            >
              Adicionar Revisão Extra
            </Button>
          </div>

          {/* Registro BN */}
          <div className="bg-card border border-border hover:border-harmonia-green/50 rounded-lg p-6 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <Award className="text-harmonia-green w-5 h-5" />
                <h3 className="font-semibold">Registro na BN</h3>
              </div>
              <span className="text-harmonia-green font-bold">R$199</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Garanta proteção legal com o registro tradicional na BN, além do blockchain CBL.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="text-sm text-gray-300">• Prazo: Até 30 dias úteis</li>
              <li className="text-sm text-gray-300">• Apenas para pacotes Profissional e Premium</li>
            </ul>
            <Button 
              onClick={() => handleExtraServiceClick("Registro na BN")}
              className="w-full bg-secondary hover:bg-secondary/90"
            >
              Solicitar Registro BN
            </Button>
          </div>

          {/* Masterização Premium */}
          <div className="bg-card border border-border hover:border-harmonia-green/50 rounded-lg p-6 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <Sliders className="text-harmonia-green w-5 h-5" />
                <h3 className="font-semibold">Masterização Premium</h3>
              </div>
              <span className="text-harmonia-green font-bold">R$149</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Melhore a qualidade sonora com masterização avançada em formato WAV 24-bit.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="text-sm text-gray-300">• Ideal para apresentações públicas ou uso comercial</li>
              <li className="text-sm text-gray-300">• Adicionado ao prazo original do pacote</li>
            </ul>
            <Button 
              onClick={() => handleExtraServiceClick("Masterização Premium")}
              className="w-full bg-secondary hover:bg-secondary/90"
            >
              Contratar Masterização Premium
            </Button>
          </div>

          {/* Stems Separados */}
          <div className="bg-card border border-border hover:border-harmonia-green/50 rounded-lg p-6 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <FileMusic className="text-harmonia-green w-5 h-5" />
                <h3 className="font-semibold">Stems Separados</h3>
              </div>
              <span className="text-harmonia-green font-bold">R$129</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Receba faixas separadas (vocais, instrumentos, etc.) para maior flexibilidade em edições futuras.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="text-sm text-gray-300">• Disponível apenas para pacotes Essencial e Profissional</li>
              <li className="text-sm text-gray-300">• Adicionado ao prazo original do pacote</li>
            </ul>
            <Button 
              onClick={() => handleExtraServiceClick("Stems Separados")}
              className="w-full bg-secondary hover:bg-secondary/90"
            >
              Obter Stems Separados
            </Button>
          </div>

          {/* Entrega Expressa */}
          <div className="bg-card border border-border hover:border-harmonia-green/50 rounded-lg p-6 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <Clock className="text-harmonia-green w-5 h-5" />
                <h3 className="font-semibold">Entrega Expressa (48h)</h3>
              </div>
              <span className="text-harmonia-green font-bold">R$199</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Priorize seu projeto e receba sua música finalizada em até 48 horas.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="text-sm text-gray-300">• Sujeito à disponibilidade da equipe</li>
              <li className="text-sm text-gray-300">• Depende da complexidade do briefing</li>
            </ul>
            <Button 
              onClick={() => handleExtraServiceClick("Entrega Expressa")}
              className="w-full bg-secondary hover:bg-secondary/90"
            >
              Solicitar Entrega Expressa
            </Button>
          </div>

          {/* Partituras */}
          <div className="bg-card border border-border hover:border-harmonia-green/50 rounded-lg p-6 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <FileMusic className="text-harmonia-green w-5 h-5" />
                <h3 className="font-semibold">Partituras MusicXML/PDF</h3>
              </div>
              <span className="text-harmonia-green font-bold">R$149</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Receba a partitura completa da sua música em formato MusicXML ou PDF, ideal para músicos e bandas.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="text-sm text-gray-300">• Prazo: Até 7 dias úteis após a entrega do áudio</li>
              <li className="text-sm text-gray-300">• Compatível com todos os softwares de notação musical</li>
            </ul>
            <Button 
              onClick={() => handleExtraServiceClick("Partituras MusicXML/PDF")}
              className="w-full bg-secondary hover:bg-secondary/90"
            >
              Solicitar Partituras
            </Button>
          </div>
        </div>

        {/* Armazenamento Premium */}
        <div className="mt-16 bg-gradient-to-r from-harmonia-green/20 to-transparent border border-harmonia-green/30 rounded-lg p-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h3 className="text-xl font-bold mb-2">Armazenamento Premium</h3>
              <p className="text-gray-300 mb-4">
                Mantenha seus arquivos seguros por mais tempo. Por padrão, os arquivos do projeto ficam disponíveis por até 7 dias após a entrega final. 
                Com o armazenamento premium, você terá acesso aos seus arquivos por até 12 meses.
              </p>
              <p className="text-harmonia-green font-semibold">R$49/ano por projeto</p>
            </div>
            <Button 
              onClick={() => handleExtraServiceClick("Armazenamento Premium")}
              className="whitespace-nowrap bg-harmonia-green hover:bg-harmonia-green/90 text-white"
            >
              Adicionar Armazenamento
            </Button>
          </div>
        </div>

        {/* Important Notes */}
        <div className="mt-10 border-t border-border pt-8">
          <h3 className="font-semibold mb-4">Avisos Importantes</h3>
          <ul className="space-y-2 text-gray-400">
            <li>• Os serviços extras devem ser solicitados durante ou até 7 dias após a entrega inicial do projeto.</li>
            <li>• Após o prazo de 7 dias, os arquivos podem ser removidos da plataforma, dificultando revisões ou upgrades.</li>
            <li>• Para garantir acesso contínuo aos arquivos, recomendamos contratar nosso serviço de armazenamento premium.</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Services;
