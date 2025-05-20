
import React from 'react';
import { Helmet } from 'react-helmet-async';
import MarketingLandingPage from '../components/marketing/MarketingLandingPage';

const Descobrir: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Descubra a Música Perfeita | harmonIA</title>
        <meta name="description" content="Descubra o tipo de música personalizada ideal para o seu projeto em poucos passos." />
      </Helmet>
      
      <MarketingLandingPage />
    </>
  );
};

export default Descobrir;
