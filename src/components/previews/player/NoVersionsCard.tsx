
import React from 'react';
import { Card } from "@/components/ui/card";

const NoVersionsCard: React.FC = () => {
  return (
    <Card className="p-6">
      <p className="text-center text-gray-500">
        Nenhuma versão disponível no momento. Entre em contato conosco se você acredita que isto é um erro.
      </p>
    </Card>
  );
};

export default NoVersionsCard;
