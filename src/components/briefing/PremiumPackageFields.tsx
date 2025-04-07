
import React from 'react';
import ConceptSection from './premium/ConceptSection';
import EmotionalPaletteSection from './premium/EmotionalPaletteSection';
import AestheticPreferencesSection from './premium/AestheticPreferencesSection';
import TechnicalSpecsSection from './premium/TechnicalSpecsSection';
import RegistrationSection from './premium/RegistrationSection';

const PremiumPackageFields: React.FC = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold pt-4">Conceito e Aplicação Estratégica</h3>
      <ConceptSection />
      
      <h3 className="text-lg font-semibold pt-4">Paleta Emocional</h3>
      <EmotionalPaletteSection />
      
      <h3 className="text-lg font-semibold pt-4">Preferências Estéticas Completas</h3>
      <AestheticPreferencesSection />
      
      <h3 className="text-lg font-semibold pt-4">Especificações Técnicas</h3>
      <TechnicalSpecsSection />
      
      <h3 className="text-lg font-semibold pt-4">Documentação para Registro na Biblioteca Nacional</h3>
      <RegistrationSection />
    </div>
  );
};

export default PremiumPackageFields;
