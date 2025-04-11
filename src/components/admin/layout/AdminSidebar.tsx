
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, FileText, Music, Settings, PlayCircle, Calculator, FileCheck, CheckSquare } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface NavLink {
  href: string;
  label: string;
  icon: React.ReactNode;
  tooltip?: string;
  external?: boolean;
}

const AdminSidebar: React.FC = () => {
  const location = useLocation();

  const links: NavLink[] = [
    { href: "/admin-j28s7d1k/dashboard", label: "Dashboard", icon: <Home className="h-4 w-4" /> },
    { 
      href: "/admin-j28s7d1k/previews", 
      label: "Prévias Musicais", 
      icon: <PlayCircle className="h-4 w-4" />,
      tooltip: "Gerenciamento de prévias musicais para clientes"
    },
    { href: "/admin-j28s7d1k/audio-database", label: "Banco de Áudio", icon: <Music className="h-4 w-4" />, tooltip: "Gerenciamento do banco de dados de áudio" },
    { href: "/admin-j28s7d1k/portfolio", label: "Portfólio", icon: <FileText className="h-4 w-4" />, tooltip: "Gerenciamento de projetos do portfólio" },
    { href: "/admin-j28s7d1k/orders", label: "Pedidos", icon: <CheckSquare className="h-4 w-4" />, tooltip: "Gerenciamento de pedidos e entregas" },
    { href: "/admin-j28s7d1k/users", label: "Usuários", icon: <Users className="h-4 w-4" />, tooltip: "Gerenciamento de usuários do sistema" },
    { href: "/admin-j28s7d1k/settings", label: "Configurações", icon: <Settings className="h-4 w-4" />, tooltip: "Configurações gerais do sistema" },
    { 
      href: "/calculadora", 
      label: "Calculadora", 
      icon: <Calculator className="h-4 w-4" />, 
      tooltip: "Acessar calculadora de preços (site público)",
      external: true 
    },
    { 
      href: "/qualificacao", 
      label: "Qualificação", 
      icon: <FileCheck className="h-4 w-4" />, 
      tooltip: "Acessar formulário de qualificação (site público)",
      external: true 
    },
  ];

  return (
    <div className="flex flex-col w-64 border-r border-gray-700 bg-gray-900">
      <div className="h-16 flex items-center justify-center border-b border-gray-700">
        <span className="text-lg font-bold text-harmonia-green">harmonIA Admin</span>
      </div>
      <nav className="flex-1 py-4">
        <ul>
          {links.map((link) => (
            <TooltipProvider key={link.href}>
              <li className="mb-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    {link.external ? (
                      <a 
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-800 text-gray-300`}
                      >
                        {link.icon}
                        <span className="ml-3">{link.label}</span>
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className={`flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-800 text-gray-300 ${
                          location.pathname === link.href ? 'bg-gray-800 text-harmonia-green' : ''
                        }`}
                      >
                        {link.icon}
                        <span className="ml-3">{link.label}</span>
                      </Link>
                    )}
                  </TooltipTrigger>
                  {link.tooltip && (
                    <TooltipContent side="right" align="start">
                      <p>{link.tooltip}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </li>
            </TooltipProvider>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
