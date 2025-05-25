
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketingLead } from '@/types/marketing';

interface MarketingLeadsListProps {
  leads: MarketingLead[];
}

const MarketingLeadsList: React.FC<MarketingLeadsListProps> = ({ leads }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Leads de Marketing</CardTitle>
      </CardHeader>
      <CardContent>
        {leads.length > 0 ? (
          <div className="space-y-4">
            {leads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{lead.name}</h3>
                  <p className="text-sm text-gray-500">{lead.email}</p>
                  <p className="text-xs text-gray-400">{lead.source}</p>
                </div>
                <Badge variant={lead.status === 'new' ? 'default' : 'secondary'}>
                  {lead.status}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Nenhum lead encontrado</p>
        )}
      </CardContent>
    </Card>
  );
};

export default MarketingLeadsList;
