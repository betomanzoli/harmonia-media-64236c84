
import React from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminClients: React.FC = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Gerenciamento de Clientes</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Lista de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Aqui você poderá gerenciar informações de clientes.</p>
            <p className="text-muted-foreground mt-4">Esta página está em desenvolvimento.</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminClients;
