
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ClientInvoices = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Minhas Faturas</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Faturas</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Você ainda não tem nenhuma fatura.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientInvoices;
