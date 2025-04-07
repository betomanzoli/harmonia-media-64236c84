
import React from 'react';
import ServiceExtrasGrid from './services/ServiceExtrasGrid';

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

      <ServiceExtrasGrid onExtraServiceClick={onExtraServiceClick} />
    </div>
  );
};

export default ServiceExtras;
