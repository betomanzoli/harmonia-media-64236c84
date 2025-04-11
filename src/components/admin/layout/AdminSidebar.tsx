
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  CreditCard, 
  Database, 
  LayoutDashboard, 
  Music, 
  File, 
  FileQuestion, 
  RefreshCcw, 
  LineChart, 
  ExternalLink, 
  BookOpenText,
  Settings,
  Share2
} from 'lucide-react';

import { 
  Sidebar, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMain, 
  SidebarNav, 
  SidebarNavGroup,
  SidebarNavItem,
  SidebarToggleButton
} from '@/components/ui/sidebar';

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const activePath = location.pathname;
  
  const isActive = (path: string) => {
    return activePath === path;
  };
  
  return (
    <Sidebar>
      <SidebarHeader className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-harmonia-green flex items-center justify-center">
            <span className="text-white text-md font-bold">H</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-medium">harmonIA</span>
            <span className="text-gray-400 text-xs">Painel Administrativo</span>
          </div>
        </div>
        <SidebarToggleButton />
      </SidebarHeader>
      <SidebarMain>
        <SidebarNav>
          <SidebarNavGroup>
            <SidebarNavItem
              as={Link}
              to="/admin-j28s7d1k/dashboard"
              icon={<LayoutDashboard size={18} />}
              active={isActive('/admin-j28s7d1k/dashboard')}
            >
              Dashboard
            </SidebarNavItem>
            <SidebarNavItem
              as={Link}
              to="/admin-j28s7d1k/previews"
              icon={<Music size={18} />}
              active={isActive('/admin-j28s7d1k/previews')}
            >
              Prévias
            </SidebarNavItem>
            <SidebarNavItem
              as={Link}
              to="/admin-j28s7d1k/portfolio"
              icon={<RefreshCcw size={18} />}
              active={isActive('/admin-j28s7d1k/portfolio')}
            >
              Portfólio
            </SidebarNavItem>
            <SidebarNavItem
              as={Link}
              to="/admin-j28s7d1k/invoices"
              icon={<CreditCard size={18} />}
              active={isActive('/admin-j28s7d1k/invoices')}
            >
              Faturas
            </SidebarNavItem>
            <SidebarNavItem
              as={Link}
              to="/admin-j28s7d1k/briefings"
              icon={<FileQuestion size={18} />}
              active={isActive('/admin-j28s7d1k/briefings')}
            >
              Briefings
            </SidebarNavItem>
            <SidebarNavItem
              as={Link}
              to="/admin-j28s7d1k/projects"
              icon={<File size={18} />}
              active={isActive('/admin-j28s7d1k/projects')}
            >
              Projetos
            </SidebarNavItem>
            <SidebarNavItem
              as={Link}
              to="/admin-j28s7d1k/statistics"
              icon={<LineChart size={18} />}
              active={isActive('/admin-j28s7d1k/statistics')}
            >
              Estatísticas
            </SidebarNavItem>
            <SidebarNavItem
              as={Link}
              to="/admin-j28s7d1k/guides"
              icon={<BookOpenText size={18} />}
              active={isActive('/admin-j28s7d1k/guides')}
            >
              Guias
            </SidebarNavItem>
            <SidebarNavItem
              as={Link}
              to="/admin-j28s7d1k/storage"
              icon={<Database size={18} />}
              active={isActive('/admin-j28s7d1k/storage')}
            >
              Armazenamento
            </SidebarNavItem>
            <SidebarNavItem
              as={Link}
              to="/admin-j28s7d1k/integrations"
              icon={<Share2 size={18} />}
              active={isActive('/admin-j28s7d1k/integrations')}
            >
              Integrações
            </SidebarNavItem>
          </SidebarNavGroup>
        </SidebarNav>
      </SidebarMain>
      <SidebarFooter>
        <div className="px-6 py-3">
          <a 
            href="https://harmonia.media" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            <ExternalLink size={14} />
            <span>Site público</span>
          </a>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
