
import React from 'react';
import { Button } from "@/components/ui/button";
import { Handshake, DollarSign, Users } from 'lucide-react';

const Partnership: React.FC = () => {
  return (
    <div className="py-16 bg-background">
      <div className="container px-4 mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">Parcerias</h2>
        <p className="text-center text-gray-400 max-w-2xl mx-auto mb-12">
          Entre em contato para discutir oportunidades de parceria.
        </p>
      </div>
    </div>
  );
};

export default Partnership;
