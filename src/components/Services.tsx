
import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import ServiceTabs from './ServiceTabs';
import ServiceExtras from './ServiceExtras';
import PremiumStorage from './PremiumStorage';
import ServiceNotices from './ServiceNotices';

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

      <ServiceTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Serviços Extras Section */}
      <ServiceExtras onExtraServiceClick={handleExtraServiceClick} />

      {/* Armazenamento Premium */}
      <PremiumStorage onStorageClick={handleExtraServiceClick} />

      {/* Important Notes */}
      <ServiceNotices />
    </section>
  );
};

export default Services;
