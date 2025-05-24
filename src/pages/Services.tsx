
import React, { useState } from 'react';
import ServiceTabs from '../components/ServiceTabs';

const Services: React.FC = () => {
  const [activeTab, setActiveTab] = useState('todos');

  return (
    <section id="servicos" className="py-20 px-6 md:px-10 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Nossos Serviços</h1>
        <p className="text-gray-500 max-w-3xl mx-auto">
          A harmonIA oferece serviços personalizados de composição e produção musical 
          para transformar sua história, emoção ou ideia em uma música única e inesquecível.
        </p>
      </div>
      
      <ServiceTabs 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
    </section>
  );
};

export default Services;
