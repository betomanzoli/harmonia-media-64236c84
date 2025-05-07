
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Music } from 'lucide-react';

const FormHeader: React.FC = () => {
  return (
    <CardHeader className="text-center">
      <div className="mx-auto w-12 h-12 bg-harmonia-green/10 rounded-full flex items-center justify-center mb-2">
        <Music className="text-harmonia-green h-6 w-6" />
      </div>
      <CardTitle className="text-2xl">Acesse sua Prévia</CardTitle>
      <CardDescription>
        Por favor, informe os dados abaixo para acessar a prévia do seu projeto musical.
      </CardDescription>
    </CardHeader>
  );
};

export default FormHeader;
