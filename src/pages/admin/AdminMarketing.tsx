
import React from 'react';
import NewAdminLayout from '@/components/admin/layout/NewAdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail } from 'lucide-react';

const AdminMarketing: React.FC = () => {
  return (
    <NewAdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Marketing</h1>
          <p className="text-gray-600">Funcionalidade em desenvolvimento</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="mr-2 h-5 w-5" />
              Marketing & Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Mail className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Funcionalidade de marketing será implementada em versão futura</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </NewAdminLayout>
  );
};

export default AdminMarketing;
