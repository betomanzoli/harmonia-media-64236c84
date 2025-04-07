
import React from 'react';
import { Button } from "@/components/ui/button";
import { Music, Award, Clock, FileMusic, Sliders, Edit, MusicIcon, Headphones } from 'lucide-react';

interface ServiceExtrasProps {
  onExtraServiceClick: (service: string) => void;
}

const ServiceExtras: React.FC<ServiceExtrasProps> = ({ onExtraServiceClick }) => {
  return (
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
            onClick={() => onExtraServiceClick("Revisão Extra")}
            className="w-full bg-secondary hover:bg-secondary/90"
          >
            Adicionar Revisão Extra
          </Button>
        </div>

        {/* Registro BN (Somente Letra) */}
        <div className="bg-card border border-border hover:border-harmonia-green/50 rounded-lg p-6 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <Award className="text-harmonia-green w-5 h-5" />
              <h3 className="font-semibold">Registro na BN (Letra)</h3>
            </div>
            <span className="text-harmonia-green font-bold">R$99</span>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Proteja legalmente a letra da sua música com registro na Biblioteca Nacional.
          </p>
          <ul className="space-y-2 mb-6">
            <li className="text-sm text-gray-300">• Não protege melodia, arranjos ou gravações</li>
            <li className="text-sm text-gray-300">• Não gera royalties</li>
            <li className="text-sm text-gray-300">• Ideal para proteção sem intenção comercial imediata</li>
            <li className="text-sm text-gray-300">• Prazo: Até 30 dias úteis</li>
          </ul>
          <Button 
            onClick={() => onExtraServiceClick("Registro na BN (Letra)")}
            className="w-full bg-secondary hover:bg-secondary/90"
          >
            Solicitar Registro BN
          </Button>
        </div>

        {/* Registro UBC */}
        <div className="bg-card border border-border hover:border-harmonia-green/50 rounded-lg p-6 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <Award className="text-harmonia-green w-5 h-5" />
              <h3 className="font-semibold">Registro UBC</h3>
            </div>
            <span className="text-harmonia-green font-bold">R$199</span>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Registro completo na UBC (letra, melodia, arranjo) com código ISWC para direitos de execução pública.
          </p>
          <ul className="space-y-2 mb-6">
            <li className="text-sm text-gray-300">• Proteção integral (letra + melodia + arranjo)</li>
            <li className="text-sm text-gray-300">• Direitos autorais em execuções públicas</li>
            <li className="text-sm text-gray-300">• Essencial para receber royalties</li>
            <li className="text-sm text-gray-300">• Ideal para uso comercial da música</li>
            <li className="text-sm text-gray-300">• Disponível para todos os pacotes</li>
          </ul>
          <Button 
            onClick={() => onExtraServiceClick("Registro UBC")}
            className="w-full bg-secondary hover:bg-secondary/90"
          >
            Solicitar Registro UBC
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
            onClick={() => onExtraServiceClick("Masterização Premium")}
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
            onClick={() => onExtraServiceClick("Stems Separados")}
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
            onClick={() => onExtraServiceClick("Entrega Expressa")}
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
            onClick={() => onExtraServiceClick("Partituras MusicXML/PDF")}
            className="w-full bg-secondary hover:bg-secondary/90"
          >
            Solicitar Partituras
          </Button>
        </div>

        {/* NEW: Composição sem IA (letra) */}
        <div className="bg-card border border-border hover:border-harmonia-green/50 rounded-lg p-6 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <Edit className="text-harmonia-green w-5 h-5" />
              <h3 className="font-semibold">Composição sem IA (letra)</h3>
            </div>
            <span className="text-harmonia-green font-bold">R$499</span>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Composição 100% humana da letra da sua música, criada por um de nossos letristas profissionais.
          </p>
          <ul className="space-y-2 mb-6">
            <li className="text-sm text-gray-300">• Processo 100% criativo humano</li>
            <li className="text-sm text-gray-300">• Inclui 2 revisões gratuitas</li>
            <li className="text-sm text-gray-300">• Prazo: Até 10 dias úteis</li>
          </ul>
          <Button 
            onClick={() => onExtraServiceClick("Composição sem IA (letra)")}
            className="w-full bg-secondary hover:bg-secondary/90"
          >
            Solicitar Composição Humana
          </Button>
        </div>

        {/* NEW: Composição sem IA (letra + melodia com partitura) */}
        <div className="bg-card border border-border hover:border-harmonia-green/50 rounded-lg p-6 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <MusicIcon className="text-harmonia-green w-5 h-5" />
              <h3 className="font-semibold">Composição sem IA (letra + melodia)</h3>
            </div>
            <span className="text-harmonia-green font-bold">R$1499</span>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Composição 100% humana da letra e melodia da sua música, incluindo partitura completa (sem gravação).
          </p>
          <ul className="space-y-2 mb-6">
            <li className="text-sm text-gray-300">• Processo 100% criativo humano</li>
            <li className="text-sm text-gray-300">• Inclui partitura em formato MusicXML/PDF</li>
            <li className="text-sm text-gray-300">• 3 revisões gratuitas</li>
            <li className="text-sm text-gray-300">• Prazo: Até 15 dias úteis</li>
          </ul>
          <Button 
            onClick={() => onExtraServiceClick("Composição sem IA (letra + melodia com partitura)")}
            className="w-full bg-secondary hover:bg-secondary/90"
          >
            Solicitar Composição Completa
          </Button>
        </div>

        {/* NEW: Composição sem IA (letra + melodia + gravação) */}
        <div className="bg-card border border-border hover:border-harmonia-green/50 rounded-lg p-6 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <Headphones className="text-harmonia-green w-5 h-5" />
              <h3 className="font-semibold">Composição sem IA (completa)</h3>
            </div>
            <span className="text-amber-400 font-bold">Consultar valor</span>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Composição 100% humana com letra, melodia e gravação profissional da sua música.
          </p>
          <ul className="space-y-2 mb-6">
            <li className="text-sm text-gray-300">• Processo 100% criativo e produção humana</li>
            <li className="text-sm text-gray-300">• Inclui compositores e músicos profissionais</li>
            <li className="text-sm text-gray-300">• Gravação em estúdio profissional</li>
            <li className="text-sm text-gray-300">• Masterização de áudio incluída</li>
            <li className="text-sm text-gray-300">• Prazo: A combinar conforme complexidade</li>
          </ul>
          <Button 
            onClick={() => onExtraServiceClick("Composição sem IA (letra + melodia + gravação)")}
            className="w-full bg-secondary hover:bg-secondary/90"
          >
            Solicitar Orçamento Personalizado
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceExtras;
