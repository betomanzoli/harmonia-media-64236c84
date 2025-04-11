
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
  SidebarContent, 
  SidebarMenu, 
  SidebarGroup,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger
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
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarGroup>
            <SidebarMenuItem>
              <Link to="/admin-j28s7d1k/dashboard">
                <SidebarMenuButton 
                  isActive={isActive('/admin-j28s7d1k/dashboard')}
                >
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link to="/admin-j28s7d1k/previews">
                <SidebarMenuButton 
                  isActive={isActive('/admin-j28s7d1k/previews')}
                >
                  <Music size={18} />
                  <span>Prévias</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link to="/admin-j28s7d1k/portfolio">
                <SidebarMenuButton 
                  isActive={isActive('/admin-j28s7d1k/portfolio')}
                >
                  <RefreshCcw size={18} />
                  <span>Portfólio</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link to="/admin-j28s7d1k/invoices">
                <SidebarMenuButton 
                  isActive={isActive('/admin-j28s7d1k/invoices')}
                >
                  <CreditCard size={18} />
                  <span>Faturas</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link to="/admin-j28s7d1k/briefings">
                <SidebarMenuButton 
                  isActive={isActive('/admin-j28s7d1k/briefings')}
                >
                  <FileQuestion size={18} />
                  <span>Briefings</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link to="/admin-j28s7d1k/projects">
                <SidebarMenuButton 
                  isActive={isActive('/admin-j28s7d1k/projects')}
                >
                  <File size={18} />
                  <span>Projetos</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link to="/admin-j28s7d1k/statistics">
                <SidebarMenuButton 
                  isActive={isActive('/admin-j28s7d1k/statistics')}
                >
                  <LineChart size={18} />
                  <span>Estatísticas</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link to="/admin-j28s7d1k/guides">
                <SidebarMenuButton 
                  isActive={isActive('/admin-j28s7d1k/guides')}
                >
                  <BookOpenText size={18} />
                  <span>Guias</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link to="/admin-j28s7d1k/storage">
                <SidebarMenuButton 
                  isActive={isActive('/admin-j28s7d1k/storage')}
                >
                  <Database size={18} />
                  <span>Armazenamento</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link to="/admin-j28s7d1k/integrations">
                <SidebarMenuButton 
                  isActive={isActive('/admin-j28s7d1k/integrations')}
                >
                  <Share2 size={18} />
                  <span>Integrações</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarGroup>
        </SidebarMenu>
      </SidebarContent>
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
