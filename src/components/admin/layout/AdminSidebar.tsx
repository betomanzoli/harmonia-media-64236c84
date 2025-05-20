
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BarChart2,
  FileText,
  Home,
  Music,
  Settings,
  Users,
  Package,
  CreditCard,
  HardDrive,
  BookOpen,
  Link as LinkIcon,
  MessageSquare,
  Headphones
} from 'lucide-react';

const AdminSidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.includes(path);
  };

  const menuItems = [
    { 
      icon: <Home className="w-5 h-5" />, 
      label: 'Dashboard', 
      path: '/admin-j28s7d1k/dashboard'
    },
    { 
      icon: <Headphones className="w-5 h-5" />, 
      label: 'Prévias', 
      path: '/admin-j28s7d1k/previews'
    },
    { 
      icon: <FileText className="w-5 h-5" />, 
      label: 'Briefings', 
      path: '/admin-j28s7d1k/briefings'
    },
    { 
      icon: <Package className="w-5 h-5" />, 
      label: 'Projetos', 
      path: '/admin-j28s7d1k/projects'
    },
    { 
      icon: <Music className="w-5 h-5" />, 
      label: 'Portfólio', 
      path: '/admin-j28s7d1k/portfolio'
    },
    { 
      icon: <Users className="w-5 h-5" />, 
      label: 'Clientes', 
      path: '/admin-j28s7d1k/clients'
    },
    { 
      icon: <CreditCard className="w-5 h-5" />, 
      label: 'Faturas', 
      path: '/admin-j28s7d1k/invoices'
    },
    { 
      icon: <HardDrive className="w-5 h-5" />, 
      label: 'Armazenamento', 
      path: '/admin-j28s7d1k/storage'
    },
    { 
      icon: <BarChart2 className="w-5 h-5" />, 
      label: 'Estatísticas', 
      path: '/admin-j28s7d1k/statistics'
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      label: 'Marketing',
      path: '/admin-j28s7d1k/marketing'
    },
    { 
      icon: <LinkIcon className="w-5 h-5" />, 
      label: 'Integrações', 
      path: '/admin-j28s7d1k/integrations'
    },
    { 
      icon: <BookOpen className="w-5 h-5" />, 
      label: 'Documentação', 
      path: '/admin-j28s7d1k/guides'
    },
    { 
      icon: <Settings className="w-5 h-5" />, 
      label: 'Configurações', 
      path: '/admin-j28s7d1k/settings'
    }
  ];

  return (
    <div className="w-64 h-screen py-8 border-r bg-background fixed">
      <div className="h-full flex flex-col">
        <div className="px-8 mb-8">
          <h1 className="text-2xl font-bold">harmonIA</h1>
          <p className="text-sm text-muted-foreground">Painel Administrativo</p>
        </div>
        
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-1 px-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-md transition-colors ${
                    isActive(item.path) 
                      ? 'bg-primary/10 text-primary' 
                      : 'hover:bg-muted'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="px-6 py-4 mt-auto">
          <p className="text-xs text-muted-foreground">
            harmonIA Admin v1.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
