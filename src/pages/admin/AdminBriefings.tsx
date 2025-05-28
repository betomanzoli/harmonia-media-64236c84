
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import NewAdminLayout from '@/components/admin/layout/NewAdminLayout';

const AdminBriefings: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <NewAdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Briefings</h1>
            <p className="text-gray-600">Gerencie os briefings dos clientes</p>
          </div>
          
          <Button className="bg-harmonia-green hover:bg-harmonia-green/90">
            <Plus className="mr-2 h-4 w-4" />
            Novo Briefing
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Lista de Briefings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-6">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar briefings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Nenhum briefing encontrado</p>
              <p className="text-sm">Os briefings dos clientes aparecerão aqui</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </NewAdminLayout>
  );
};

export default AdminBriefings;
