
import React from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminInvoices: React.FC = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Gerenciamento de Faturas</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Faturas e Pagamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Aqui você poderá gerenciar as faturas e pagamentos.</p>
            <p className="text-muted-foreground mt-4">Esta página está em desenvolvimento.</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminInvoices;
