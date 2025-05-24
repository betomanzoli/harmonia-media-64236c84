
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { 
  BarChart3, 
  Users, 
  DollarSign,
  ClipboardList
} from "lucide-react";

interface StatsSummaryProps {
  projectCount: number;
  clientCount: number;
  briefingCount: number;
  revenueTotal: number;
}

const StatsSummary: React.FC<StatsSummaryProps> = ({
  projectCount,
  clientCount,
  briefingCount,
  revenueTotal
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Projetos */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary-100 rounded-full">
              <BarChart3 className="h-6 w-6 text-primary-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Projetos
              </p>
              <h3 className="text-2xl font-bold">
                {projectCount}
              </h3>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clientes */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-green-100 rounded-full">
              <Users className="h-6 w-6 text-green-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Clientes
              </p>
              <h3 className="text-2xl font-bold">
                {clientCount}
              </h3>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Briefings */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 rounded-full">
              <ClipboardList className="h-6 w-6 text-blue-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Briefings
              </p>
              <h3 className="text-2xl font-bold">
                {briefingCount}
              </h3>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Receita */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-purple-100 rounded-full">
              <DollarSign className="h-6 w-6 text-purple-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Receita
              </p>
              <h3 className="text-2xl font-bold">
                R$ {revenueTotal.toLocaleString('pt-BR')}
              </h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsSummary;
