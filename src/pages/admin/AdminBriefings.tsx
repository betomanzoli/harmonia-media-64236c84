
import React from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminBriefings: React.FC = () => {
  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Briefings</h1>
        <Button variant="outline" asChild>
          <Link to="/admin-j28s7d1k/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Dashboard
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Briefings</CardTitle>
          <CardDescription>
            Visualize e gerencie os briefings enviados pelos clientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">
            Esta funcionalidade está em desenvolvimento. Em breve você poderá visualizar e gerenciar os briefings aqui.
          </p>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminBriefings;
