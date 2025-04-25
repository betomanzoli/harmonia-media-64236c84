
import React from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminStorage: React.FC = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Gerenciamento de Armazenamento</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Arquivos e Mídias</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Aqui você poderá gerenciar arquivos e mídias armazenados no sistema.</p>
            <p className="text-muted-foreground mt-4">Esta página está em desenvolvimento.</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminStorage;
