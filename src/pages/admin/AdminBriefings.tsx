
import React from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminBriefings: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-harmonia-green">Briefings</h1>
            <p className="text-muted-foreground">
              Gerencie os formulários de briefing enviados pelos clientes
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            asChild
            className="border-harmonia-green text-harmonia-green hover:bg-harmonia-green/10"
          >
            <Link to="/admin-j28s7d1k/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Dashboard
            </Link>
          </Button>
        </div>
        
        <div className="p-8 text-center bg-card border rounded-lg">
          <h3 className="text-xl font-medium mb-4">Gerenciamento de Briefings</h3>
          <p className="text-muted-foreground mb-4">
            A funcionalidade de gerenciamento de briefings está em desenvolvimento.
            Em breve você poderá visualizar, editar e gerenciar todos os briefings enviados pelos clientes.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBriefings;
