
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ClientDashboard = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Painel do Cliente</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Resumo de Projetos</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Você tem 0 projetos ativos.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Nenhuma atividade registrada recentemente.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientDashboard;
