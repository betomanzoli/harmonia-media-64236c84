
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  FileAudio, 
  Music, 
  ShoppingBag, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight, 
  BarChart, 
  Settings,
  Link2,
  FileText
} from 'lucide-react';
import { siteConfig } from '@/config/site';

interface StatCardProps {
  title: string;
  description: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  linkText?: string;
  linkUrl?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  description, 
  value, 
  icon, 
  trend, 
  linkText, 
  linkUrl 
}) => {
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <p className="text-4xl font-bold">{value}</p>
          {trend && (
            <div className={`flex items-center text-xs ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {trend.isPositive ? (
                <ArrowUpRight className="w-3 h-3 mr-1" />
              ) : (
                <ArrowDownRight className="w-3 h-3 mr-1" />
              )}
              <span>{trend.value}%</span>
            </div>
          )}
        </div>
      </CardContent>
      {linkText && linkUrl && (
        <CardFooter>
          <Button variant="ghost" asChild>
            <Link to={linkUrl}>{linkText}</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

const StatsSummary = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Áudios"
        description="Total de áudios no sistema"
        value={23}
        trend={{ value: 12, isPositive: true }}
        icon={<FileAudio className="w-6 h-6 text-blue-500" />}
        linkText="Gerenciar áudios"
        linkUrl={siteConfig.urls.admin.audioDatabase}
      />
      
      <StatCard
        title="Portfólio"
        description="Itens no portfólio"
        value={15}
        trend={{ value: 8, isPositive: true }}
        icon={<Music className="w-6 h-6 text-green-500" />}
        linkText="Gerenciar portfólio"
        linkUrl={siteConfig.urls.admin.portfolio}
      />
      
      <StatCard
        title="Pedidos"
        description="Pedidos ativos"
        value={8}
        trend={{ value: 5, isPositive: false }}
        icon={<ShoppingBag className="w-6 h-6 text-orange-500" />}
        linkText="Ver pedidos"
        linkUrl="/admin-j28s7d1k/orders"
      />
      
      <StatCard
        title="Clientes"
        description="Total de clientes"
        value={42}
        trend={{ value: 18, isPositive: true }}
        icon={<Users className="w-6 h-6 text-purple-500" />}
        linkText="Gerenciar clientes"
        linkUrl="/admin-j28s7d1k/customers"
      />

      <StatCard
        title="Prévias"
        description="Prévias de músicas"
        value={12}
        trend={{ value: 10, isPositive: true }}
        icon={<Music className="w-6 h-6 text-pink-500" />}
        linkText="Gerenciar prévias"
        linkUrl="/admin-j28s7d1k/previews"
      />

      <StatCard
        title="Integrações"
        description="Serviços conectados"
        value={4}
        trend={{ value: 25, isPositive: true }}
        icon={<Link2 className="w-6 h-6 text-indigo-500" />}
        linkText="Configurar integrações"
        linkUrl="/admin-j28s7d1k/integrations"
      />

      <StatCard
        title="Estatísticas"
        description="Análise de desempenho"
        value="Ver"
        icon={<BarChart className="w-6 h-6 text-teal-500" />}
        linkText="Ver estatísticas"
        linkUrl="/admin-j28s7d1k/statistics"
      />

      <StatCard
        title="Faturas"
        description="Faturas emitidas"
        value={18}
        trend={{ value: 15, isPositive: true }}
        icon={<FileText className="w-6 h-6 text-amber-500" />}
        linkText="Gerenciar faturas"
        linkUrl="/admin-j28s7d1k/invoices"
      />

      <StatCard
        title="Configurações"
        description="Configurações do sistema"
        value="Ver"
        icon={<Settings className="w-6 h-6 text-gray-500" />}
        linkText="Configurar sistema"
        linkUrl="/admin-j28s7d1k/settings"
      />
    </div>
  );
};

export default StatsSummary;
