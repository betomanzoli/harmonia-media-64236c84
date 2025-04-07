import React from 'react';
import ProcessStep from './ProcessStep';
import { Card } from "@/components/ui/card";
import Testimonials from './Testimonials';
import { FileText, Package, CreditCard, MessageSquare, Music, Headphones, FileCheck, Settings } from 'lucide-react';
const Process: React.FC = () => {
  return <section id="processo" className="py-20 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Como Funciona</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Conheça o processo da harmonIA para transformar sua história em uma composição musical única.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <ProcessStep icon={<FileText className="w-8 h-8 text-harmonia-green" />} title="1. Qualificação Inicial" description="Preencha um formulário simples para entendermos sua necessidade musical e objetivo do projeto." />
          <ProcessStep icon={<Package className="w-8 h-8 text-harmonia-green" />} title="2. Escolha do Pacote" description="Selecione o plano que melhor atende suas necessidades de uso e orçamento." />
          <ProcessStep icon={<CreditCard className="w-8 h-8 text-harmonia-green" />} title="3. Pagamento" description="Processo seguro com múltiplas formas de pagamento e emissão automática de nota fiscal." />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <ProcessStep icon={<MessageSquare className="w-8 h-8 text-harmonia-green" />} title="4. Briefing Detalhado" description="Após o pagamento, compartilhe sua história em detalhes para orientar a composição." />
          <ProcessStep icon={<Music className="w-8 h-8 text-harmonia-green" />} title="5. Criação com IA" description="Nossa tecnologia transforma sua história em múltiplas versões musicais para avaliação." />
          <ProcessStep icon={<Headphones className="w-8 h-8 text-harmonia-green" />} title="6. Refinamento Humano" description="Músicos especialistas aprimoram a composição gerada pela IA para garantir qualidade profissional." />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <ProcessStep icon={<FileCheck className="w-8 h-8 text-harmonia-green" />} title="7. Apresentação" description="Você recebe prévias de sua música para avaliação através de nossa plataforma exclusiva." />
          <ProcessStep icon={<Settings className="w-8 h-8 text-harmonia-green" />} title="8. Revisões" description="Ajustamos a composição conforme seu feedback (número de revisões varia de acordo com o pacote)." />
          <ProcessStep icon={<Music className="w-8 h-8 text-harmonia-green" />} title="9. Entrega Final" description="Receba sua música finalizada com toda documentação e direitos conforme o pacote contratado." />
        </div>
        
        {/* Flowchart */}
        <div className="mb-16">
          <Card className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 border-harmonia-green/20">
            <h3 className="text-xl font-semibold mb-6 text-center">Fluxo de Trabalho Simplificado</h3>
            <div className="relative">
              {/* Flowchart visualization */}
              <div className="flex flex-col md:flex-row justify-between items-center relative">
                <div className="bg-card p-4 rounded-lg border border-harmonia-green/30 w-full md:w-64 text-center mb-8 md:mb-0">
                  <h4 className="font-medium">Sua Ideia</h4>
                </div>
                
                {/* Line connector */}
                <div className="hidden md:block h-0.5 flex-grow mx-4 bg-gradient-to-r from-harmonia-green/80 to-harmonia-green/80"></div>
                
                <div className="bg-card p-4 rounded-lg border border-harmonia-green/30 w-full md:w-64 text-center mb-8 md:mb-0">
                  <h4 className="font-medium">harmonIA</h4>
                </div>
                
                {/* Line connector */}
                <div className="hidden md:block h-0.5 flex-grow mx-4 bg-gradient-to-r from-harmonia-green/80 to-harmonia-green/80"></div>
                
                <div className="bg-card p-4 rounded-lg border border-harmonia-green/30 w-full md:w-64 text-center">
                  <h4 className="font-medium">Sua Música</h4>
                </div>
              </div>
              
              {/* Mobile version arrows */}
              <div className="flex flex-col items-center md:hidden">
                <div className="h-8 w-0.5 bg-harmonia-green/80 my-2"></div>
                <div className="h-8 w-0.5 bg-harmonia-green/80 my-2"></div>
              </div>
              
              {/* Process details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="space-y-4">
                  <p className="text-sm text-gray-400">Você nos conta sua história, objetivo e referências musicais.</p>
                </div>
                <div className="space-y-4">
                  <p className="text-sm text-gray-400">Transformamos seus sentimentos em composição musical usando IA + expertise humana.</p>
                </div>
                <div className="space-y-4">
                  <p className="text-sm text-gray-400">Receba uma obra musical única, com todos os direitos conforme o pacote escolhido.</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Testimonials */}
        
      </div>
    </section>;
};
export default Process;