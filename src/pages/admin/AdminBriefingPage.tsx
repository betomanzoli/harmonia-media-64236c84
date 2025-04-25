
import React from 'react';
import { useParams } from 'react-router-dom';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const AdminBriefingPage: React.FC = () => {
  const { briefingId } = useParams<{ briefingId: string }>();
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Detalhes do Briefing</h1>
          <p className="text-muted-foreground">ID: {briefingId}</p>
        </div>
        
        <Separator className="my-6" />
        
        <Card>
          <CardHeader>
            <CardTitle>Informações do Briefing</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Carregando detalhes do briefing...</p>
            {/* Content to be implemented based on briefing data */}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminBriefingPage;
