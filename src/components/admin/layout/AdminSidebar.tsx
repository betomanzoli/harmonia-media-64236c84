import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, FileText, Music, Settings, PlayCircle } from 'lucide-react';
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
    { href: "/admin-j28s7d1k/users", label: "Usuários", icon: <Users className="h-4 w-4" />, tooltip: "Gerenciamento de usuários do sistema" },
    { href: "/admin-j28s7d1k/settings", label: "Configurações", icon: <Settings className="h-4 w-4" />, tooltip: "Configurações gerais do sistema" },
  ];

  return (
    <div className="flex flex-col w-64 border-r bg-gray-50">
      <div className="h-16 flex items-center justify-center border-b">
        <span className="text-lg font-bold">harmonIA Admin</span>
      </div>
      <nav className="flex-1 py-4">
        <ul>
          {links.map((link) => (
            <TooltipProvider key={link.href}>
              <li className="mb-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      to={link.href}
                      className={`flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-200 ${
                        location.pathname === link.href ? 'bg-gray-200' : ''
                      }`}
                    >
                      {link.icon}
                      <span className="ml-3">{link.label}</span>
                    </Link>
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
