
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";
import { Database, Music, Users, FileAudio, BarChart, Settings, LogOut, Home, Link2, ShoppingBag, FileText } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { useToast } from '@/hooks/use-toast';

const AdminSidebar: React.FC = () => {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Desconectado",
      description: "Você saiu da área administrativa."
    });
    navigate('/admin-login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Sidebar className="border-r border-gray-200 bg-white">
      <SidebarHeader className="flex items-center justify-center py-4">
        <h2 className="text-xl font-bold text-harmonia-green">harmonIA Admin</h2>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive('/admin-j28s7d1k/dashboard')}>
                <Link to="/admin-j28s7d1k/dashboard">
                  <Home className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive(siteConfig.urls.admin.audioDatabase)}>
                <Link to={siteConfig.urls.admin.audioDatabase}>
                  <FileAudio className="w-4 h-4" />
                  <span>Banco de Áudios</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive(siteConfig.urls.admin.portfolio)}>
                <Link to={siteConfig.urls.admin.portfolio}>
                  <Music className="w-4 h-4" />
                  <span>Portfólio</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive('/admin-j28s7d1k/integrations')}>
                <Link to="/admin-j28s7d1k/integrations">
                  <Link2 className="w-4 h-4" />
                  <span>Integrações</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive('/admin-j28s7d1k/previews')}>
                <Link to="/admin-j28s7d1k/previews">
                  <Music className="w-4 h-4" />
                  <span>Prévias</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Gestão</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive('/admin-j28s7d1k/customers')}>
                <Link to="/admin-j28s7d1k/customers">
                  <Users className="w-4 h-4" />
                  <span>Clientes</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive('/admin-j28s7d1k/orders')}>
                <Link to="/admin-j28s7d1k/orders">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Pedidos</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive('/admin-j28s7d1k/invoices')}>
                <Link to="/admin-j28s7d1k/invoices">
                  <FileText className="w-4 h-4" />
                  <span>Faturas</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive('/admin-j28s7d1k/statistics')}>
                <Link to="/admin-j28s7d1k/statistics">
                  <BarChart className="w-4 h-4" />
                  <span>Estatísticas</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive('/admin-j28s7d1k/settings')}>
              <Link to="/admin-j28s7d1k/settings">
                <Settings className="w-4 h-4" />
                <span>Configurações</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/">
                <Home className="w-4 h-4" />
                <span>Voltar ao Site</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
