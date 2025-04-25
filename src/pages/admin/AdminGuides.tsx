
import React from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminGuides: React.FC = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Guias e Documentação</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Material de Apoio</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Aqui você encontrará guias e documentação para ajudar no uso do sistema.</p>
            <p className="text-muted-foreground mt-4">Esta página está em desenvolvimento.</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminGuides;
