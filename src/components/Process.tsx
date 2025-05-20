
import React, { useEffect } from 'react';
import ProcessStep from './ProcessStep';
import { Card } from "@/components/ui/card";
import { FileText, Package, CreditCard, MessageSquare, Music, Headphones, FileCheck, Settings } from 'lucide-react';

const Process: React.FC = () => {
  // Make sure the element ID is properly set for the scroll target
  useEffect(() => {
    // Ensure the section has an id for scrolling
    const section = document.getElementById('processo');
    if (!section && typeof document !== 'undefined') {
      const element = document.querySelector('section:nth-of-type(2)');
      if (element) {
        element.id = 'processo';
      }
    }
  }, []);

  return (
    <section id="processo" className="py-20 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Como Funciona</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Conheça o processo da harmonIA para transformar sua história em uma composição musical única.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <ProcessStep icon={<Package className="w-8 h-8 text-harmonia-green" />} title="1. Escolha do Pacote" description="Selecione o plano que melhor atende suas necessidades de uso e orçamento." />
          <ProcessStep icon={<CreditCard className="w-8 h-8 text-harmonia-green" />} title="2. Pagamento" description="Processo seguro com múltiplas formas de pagamento, com emissão de nota fiscal." />
          <ProcessStep icon={<MessageSquare className="w-8 h-8 text-harmonia-green" />} title="3. Briefing Detalhado" description="Após o pagamento, compartilhe sua história em detalhes para orientar a composição." />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <ProcessStep icon={<Music className="w-8 h-8 text-harmonia-green" />} title="4. Criação com IA" description="Nossa tecnologia transforma sua história em múltiplas versões musicais para avaliação." />
          <ProcessStep icon={<Headphones className="w-8 h-8 text-harmonia-green" />} title="5. Refinamento Humano" description="Músicos especialistas aprimoram a composição gerada pela IA para garantir qualidade profissional." />
          <ProcessStep icon={<FileCheck className="w-8 h-8 text-harmonia-green" />} title="6. Apresentação" description="Você recebe prévias de sua música para avaliação através de nossa plataforma exclusiva." />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <ProcessStep icon={<Settings className="w-8 h-8 text-harmonia-green" />} title="7. Revisões" description="Ajustamos a composição conforme seu feedback (número de revisões varia de acordo com o pacote)." />
          <ProcessStep icon={<Music className="w-8 h-8 text-harmonia-green" />} title="8. Entrega Final" description="Receba sua música finalizada com toda documentação e direitos conforme o pacote contratado." />
        </div>
        
        {/* Flowchart */}
        <div className="mb-16">
          
        </div>
      </div>
    </section>
  );
};

export default Process;
