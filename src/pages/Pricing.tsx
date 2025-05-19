
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Pricing = () => {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Nossos Planos e Preços</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Pacote Essencial</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold mb-4">R$XXX</p>
            <ul className="space-y-2">
              <li>• Música personalizada</li>
              <li>• 1 revisão incluída</li>
              <li>• Entrega em 7 dias</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="border-green-500 border-2">
          <CardHeader className="bg-green-50">
            <CardTitle>Pacote Profissional</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold mb-4">R$XXX</p>
            <ul className="space-y-2">
              <li>• Música personalizada premium</li>
              <li>• 3 revisões incluídas</li>
              <li>• Entrega em 5 dias</li>
              <li>• Arquivo de mixagem profissional</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pacote Premium</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold mb-4">R$XXX</p>
            <ul className="space-y-2">
              <li>• Música exclusiva de alta qualidade</li>
              <li>• Revisões ilimitadas</li>
              <li>• Entrega em 3 dias</li>
              <li>• Arquivo de mixagem profissional</li>
              <li>• Licença comercial completa</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Pricing;
