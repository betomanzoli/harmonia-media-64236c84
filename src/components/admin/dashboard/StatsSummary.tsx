
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
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  description, 
  value, 
  icon, 
  trend, 
  linkText, 
  linkUrl,
  color = "text-harmonia-green"
}) => {
  return (
    <Card className="shadow-md border-harmonia-green/20 overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className={`pb-2 flex flex-row items-center justify-between bg-gradient-to-r from-harmonia-light-green to-harmonia-green/5`}>
        <div>
          <CardTitle className={`text-xl ${color}`}>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-white/90 ${color}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-center space-x-2">
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
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
        <CardFooter className="pt-0">
          <Button 
            variant="ghost" 
            asChild
            className="text-harmonia-green hover:bg-harmonia-green/10 -ml-2 px-2 py-1"
          >
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
        icon={<FileAudio className="w-6 h-6" />}
        linkText="Gerenciar áudios"
        linkUrl={siteConfig.urls.admin.audioDatabase}
        color="text-blue-500"
      />
      
      <StatCard
        title="Portfólio"
        description="Itens no portfólio"
        value={15}
        trend={{ value: 8, isPositive: true }}
        icon={<Music className="w-6 h-6" />}
        linkText="Gerenciar portfólio"
        linkUrl={siteConfig.urls.admin.portfolio}
        color="text-green-500"
      />
      
      <StatCard
        title="Pedidos"
        description="Pedidos ativos"
        value={8}
        trend={{ value: 5, isPositive: false }}
        icon={<ShoppingBag className="w-6 h-6" />}
        linkText="Ver pedidos"
        linkUrl="/admin-j28s7d1k/orders"
        color="text-orange-500"
      />
      
      <StatCard
        title="Clientes"
        description="Total de clientes"
        value={42}
        trend={{ value: 18, isPositive: true }}
        icon={<Users className="w-6 h-6" />}
        linkText="Gerenciar clientes"
        linkUrl="/admin-j28s7d1k/customers"
        color="text-purple-500"
      />

      <StatCard
        title="Prévias"
        description="Prévias de músicas"
        value={12}
        trend={{ value: 10, isPositive: true }}
        icon={<Music className="w-6 h-6" />}
        linkText="Gerenciar prévias"
        linkUrl="/admin-j28s7d1k/previews"
        color="text-pink-500"
      />

      <StatCard
        title="Integrações"
        description="Serviços conectados"
        value={4}
        trend={{ value: 25, isPositive: true }}
        icon={<Link2 className="w-6 h-6" />}
        linkText="Configurar integrações"
        linkUrl="/admin-j28s7d1k/integrations"
        color="text-indigo-500"
      />

      <StatCard
        title="Estatísticas"
        description="Análise de desempenho"
        value="Ver"
        icon={<BarChart className="w-6 h-6" />}
        linkText="Ver estatísticas"
        linkUrl="/admin-j28s7d1k/statistics"
        color="text-teal-500"
      />

      <StatCard
        title="Faturas"
        description="Faturas emitidas"
        value={18}
        trend={{ value: 15, isPositive: true }}
        icon={<FileText className="w-6 h-6" />}
        linkText="Gerenciar faturas"
        linkUrl="/admin-j28s7d1k/invoices"
        color="text-amber-500"
      />

      <StatCard
        title="Configurações"
        description="Configurações do sistema"
        value="Ver"
        icon={<Settings className="w-6 h-6" />}
        linkText="Configurar sistema"
        linkUrl="/admin-j28s7d1k/settings"
        color="text-gray-500"
      />
    </div>
  );
};

export default StatsSummary;
