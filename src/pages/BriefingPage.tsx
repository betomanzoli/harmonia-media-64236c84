
import React from 'react';
import PublicLayout from '@/layouts/PublicLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BriefingPage: React.FC = () => {
  return (
    <PublicLayout>
      <div className="pt-24 pb-20 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Briefing do Projeto
            </h1>
            <p className="text-lg text-gray-600">
              Conte-nos sobre sua ideia musical
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center text-harmonia-green">
                Em breve: Formulário de Briefing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-600">
                Esta página está em desenvolvimento. Em breve você poderá enviar seu briefing musical diretamente aqui.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
};

export default BriefingPage;
