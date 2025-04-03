
import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import ServiceTabs from '../ServiceTabs';
import ServiceExtras from '../ServiceExtras';
import PremiumStorage from '../PremiumStorage';
import ServiceNotices from '../ServiceNotices';

const ServicesList: React.FC = () => {
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
    <div>
      <ServiceTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Serviços Extras Section */}
      <ServiceExtras onExtraServiceClick={handleExtraServiceClick} />

      {/* Armazenamento Premium */}
      <PremiumStorage onStorageClick={handleExtraServiceClick} />

      {/* Important Notes */}
      <ServiceNotices />
    </div>
  );
};

export default ServicesList;
