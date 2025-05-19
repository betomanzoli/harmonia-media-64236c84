
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ClientProjects = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Meus Projetos</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Lista de Projetos</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Você ainda não tem nenhum projeto.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientProjects;
