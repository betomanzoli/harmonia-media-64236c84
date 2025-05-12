
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard,
  Music,
  FileText,
  Users,
  Settings,
  CreditCard,
  FileBox,
  LineChart,
  Link2,
  HelpCircle
} from 'lucide-react';
import { cn } from "@/lib/utils";

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon: Icon, label }) => {
  return (
    <NavLink 
      to={href}
      className={({ isActive }) => cn(
        "flex items-center px-4 py-3 text-sm font-medium rounded-lg",
        isActive 
          ? "bg-gray-800 text-white" 
          : "text-gray-400 hover:text-white hover:bg-gray-700"
      )}
    >
      <Icon className="mr-3 w-5 h-5" />
      <span>{label}</span>
    </NavLink>
  );
};

const AdminSidebar: React.FC = () => {
  return (
    <div className="hidden md:flex flex-col bg-gray-900 w-64 px-4 py-8 overflow-y-auto">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-white">harmonIA</h1>
        <p className="text-gray-400 text-sm">Painel Administrativo</p>
      </div>
      
      <div className="flex flex-col flex-1 space-y-1">
        <NavItem href="/admin-j28s7d1k/dashboard" icon={LayoutDashboard} label="Dashboard" />
        <NavItem href="/admin-j28s7d1k/previews" icon={Music} label="Prévias" />
        <NavItem href="/admin-j28s7d1k/briefings" icon={FileText} label="Briefings" />
        <NavItem href="/admin-j28s7d1k/projects" icon={Music} label="Projetos" />
        <NavItem href="/admin-j28s7d1k/clients" icon={Users} label="Clientes" />
        <NavItem href="/admin-j28s7d1k/payments" icon={CreditCard} label="Pagamentos" />
        <NavItem href="/admin-j28s7d1k/storage" icon={FileBox} label="Arquivos" />
        <NavItem href="/admin-j28s7d1k/statistics" icon={LineChart} label="Estatísticas" />
        <NavItem href="/admin-j28s7d1k/integrations" icon={Link2} label="Integrações" />
        <NavItem href="/admin-j28s7d1k/guides" icon={HelpCircle} label="Guias" />
      </div>
      
      <div className="mt-auto">
        <NavItem href="/admin-j28s7d1k/settings" icon={Settings} label="Configurações" />
      </div>
    </div>
  );
};

export default AdminSidebar;
