
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";
import { Database, Music, Users, FileAudio, BarChart, Settings, LogOut, Home, Link2 } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { useToast } from '@/hooks/use-toast';

const AdminSidebar: React.FC = () => {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Desconectado",
      description: "Você saiu da área administrativa."
    });
    navigate('/admin-login');
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
              <SidebarMenuButton asChild>
                <Link to="/admin-j28s7d1k/dashboard">
                  <Home className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to={siteConfig.urls.admin.audioDatabase}>
                  <FileAudio className="w-4 h-4" />
                  <span>Banco de Áudios</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to={siteConfig.urls.admin.portfolio}>
                  <Music className="w-4 h-4" />
                  <span>Portfólio</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/admin-j28s7d1k/integrations">
                  <Link2 className="w-4 h-4" />
                  <span>Integrações</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Gestão</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Em desenvolvimento">
                <Link to="#">
                  <Users className="w-4 h-4" />
                  <span>Clientes</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Em desenvolvimento">
                <Link to="#">
                  <Database className="w-4 h-4" />
                  <span>Pedidos</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Em desenvolvimento">
                <Link to="#">
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
            <SidebarMenuButton asChild tooltip="Em desenvolvimento">
              <Link to="#">
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
