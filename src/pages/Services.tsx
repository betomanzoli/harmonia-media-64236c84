
import React from 'react';
import PublicLayout from '@/layouts/PublicLayout';
import ServicesList from '@/components/services/ServicesList';

const Services: React.FC = () => {
  return (
    <PublicLayout>
      <div className="pt-24 pb-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Nossos Serviços</h1>
            <p className="text-gray-500 max-w-3xl mx-auto">
              A harmonIA oferece serviços personalizados de composição e produção musical para transformar sua história, emoção ou ideia em uma música única e inesquecível.
            </p>
          </div>
          
          <ServicesList />
        </div>
      </div>
    </PublicLayout>
  );
};

export default Services;
