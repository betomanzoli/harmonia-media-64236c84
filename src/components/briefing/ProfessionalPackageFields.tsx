
import React from 'react';
import ConceptSection from './professional/ConceptSection';
import MusicStylesSection from './professional/MusicStylesSection';
import TechnicalDetailsSection from './professional/TechnicalDetailsSection';
import ReferencesSection from './professional/ReferencesSection';
import CommercialRequirementsSection from './professional/CommercialRequirementsSection';
import CallSchedulingSection from './professional/CallSchedulingSection';

const ProfessionalPackageFields: React.FC = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold pt-4">História e Conceito</h3>
      <ConceptSection />
      
      <h3 className="text-lg font-semibold pt-4">Preferências Estilísticas</h3>
      <MusicStylesSection />
      
      <h3 className="text-lg font-semibold pt-4">Detalhamento Técnico</h3>
      <TechnicalDetailsSection />
      
      <h3 className="text-lg font-semibold pt-4">Referências</h3>
      <ReferencesSection />
      
      <h3 className="text-lg font-semibold pt-4">Requisitos para Uso Comercial</h3>
      <CommercialRequirementsSection />
      
      <h3 className="text-lg font-semibold pt-4">Agendamento de Chamada (Opcional)</h3>
      <CallSchedulingSection />
    </div>
  );
};

export default ProfessionalPackageFields;
