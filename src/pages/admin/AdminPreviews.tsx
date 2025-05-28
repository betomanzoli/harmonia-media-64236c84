
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import NewAdminLayout from '@/components/admin/layout/NewAdminLayout';
import ClientSelectionDialog from '@/components/admin/ClientSelectionDialog';

const AdminPreviews: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);

  const handleSelectClient = (client: any) => {
    console.log('Cliente selecionado:', client);
    setIsClientDialogOpen(false);
  };

  return (
    <NewAdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Prévias</h1>
            <p className="text-gray-600">Gerencie as prévias dos projetos</p>
          </div>
          
          <Button 
            onClick={() => setIsClientDialogOpen(true)}
            className="bg-harmonia-green hover:bg-harmonia-green/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nova Prévia
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Prévias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-6">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar prévias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <div className="text-center py-8 text-gray-500">
              <p>Nenhuma prévia encontrada</p>
              <p className="text-sm">As prévias dos projetos aparecerão aqui</p>
            </div>
          </CardContent>
        </Card>

        <ClientSelectionDialog
          isOpen={isClientDialogOpen}
          onOpenChange={setIsClientDialogOpen}
          onSelectClient={handleSelectClient}
        />
      </div>
    </NewAdminLayout>
  );
};

export default AdminPreviews;
