
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
  bgColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  description, 
  value, 
  icon, 
  trend, 
  linkText, 
  linkUrl,
  color = "text-harmonia-green",
  bgColor = "from-gray-800/80 to-gray-900/80"
}) => {
  return (
    <Card className="shadow-md border-gray-700 overflow-hidden bg-gray-800/60 hover:shadow-lg transition-shadow">
      <CardHeader className={`pb-2 flex flex-row items-center justify-between bg-gradient-to-r ${bgColor}`}>
        <div>
          <CardTitle className={`text-xl ${color}`}>{title}</CardTitle>
          <CardDescription className="text-gray-400">{description}</CardDescription>
        </div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gray-900/50 ${color}`}>
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
            className={`${color} hover:bg-gray-700/30 -ml-2 px-2 py-1`}
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
    <div className="grid grid-cols-1 gap-5 mb-5">
      <StatCard
        title="Áudios"
        description="Total de áudios no sistema"
        value={23}
        trend={{ value: 12, isPositive: true }}
        icon={<FileAudio className="w-6 h-6" />}
        linkText="Gerenciar áudios"
        linkUrl="/admin-j28s7d1k/audio-database"
        color="text-blue-400"
        bgColor="from-blue-900/20 to-gray-900/80"
      />
      
      <StatCard
        title="Portfólio"
        description="Itens no portfólio"
        value={15}
        trend={{ value: 8, isPositive: true }}
        icon={<Music className="w-6 h-6" />}
        linkText="Gerenciar portfólio"
        linkUrl="/admin-j28s7d1k/portfolio"
        color="text-green-400"
        bgColor="from-green-900/20 to-gray-900/80"
      />
      
      <StatCard
        title="Pedidos"
        description="Pedidos ativos"
        value={8}
        trend={{ value: 5, isPositive: false }}
        icon={<ShoppingBag className="w-6 h-6" />}
        linkText="Ver pedidos"
        linkUrl="/admin-j28s7d1k/orders"
        color="text-orange-400"
        bgColor="from-orange-900/20 to-gray-900/80"
      />
      
      <StatCard
        title="Clientes"
        description="Total de clientes"
        value={42}
        trend={{ value: 18, isPositive: true }}
        icon={<Users className="w-6 h-6" />}
        linkText="Gerenciar clientes"
        linkUrl="/admin-j28s7d1k/customers"
        color="text-purple-400"
        bgColor="from-purple-900/20 to-gray-900/80"
      />
    </div>
  );
};

export default StatsSummary;
