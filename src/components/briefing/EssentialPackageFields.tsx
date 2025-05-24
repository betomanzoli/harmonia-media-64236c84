
import React from 'react';
import StorySection from './essential/StorySection';
import EmotionsSelector from './essential/EmotionsSelector';
import MusicPreferences from './essential/MusicPreferences';
import SpecificElements from './essential/SpecificElements';
import CertificateInfo from './essential/CertificateInfo';

const EssentialPackageFields: React.FC = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold pt-4">História ou Conceito</h3>
      
      <StorySection />
      <EmotionsSelector />
      
      <h3 className="text-lg font-semibold pt-4">Preferências Musicais</h3>
      <MusicPreferences />
      
      <h3 className="text-lg font-semibold pt-4">Elementos Específicos</h3>
      <SpecificElements />
      
      <h3 className="text-lg font-semibold pt-4">Informações para Certificado Digital</h3>
      <CertificateInfo />
    </div>
  );
};

export default EssentialPackageFields;
