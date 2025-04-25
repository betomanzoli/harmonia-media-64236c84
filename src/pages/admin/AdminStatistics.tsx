
import React from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminStatistics: React.FC = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Estatísticas</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Dados Analíticos</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Aqui você poderá visualizar estatísticas e dados analíticos.</p>
            <p className="text-muted-foreground mt-4">Esta página está em desenvolvimento.</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminStatistics;
