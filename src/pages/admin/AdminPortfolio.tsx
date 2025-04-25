
import React from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminPortfolio: React.FC = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Gerenciamento do Portfólio</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Músicas do Portfólio</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Aqui você poderá gerenciar as músicas do portfólio.</p>
            <p className="text-muted-foreground mt-4">Esta página está em desenvolvimento.</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminPortfolio;
