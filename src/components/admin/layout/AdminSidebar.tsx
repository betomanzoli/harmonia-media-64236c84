
import React from 'react';
import { Link } from 'react-router-dom';
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";
import { Database, Music, Users, FileAudio, BarChart, Settings, LogOut, Home } from 'lucide-react';
import { siteConfig } from '@/config/site';

const AdminSidebar: React.FC = () => {
  return (
    <Sidebar>
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
            <SidebarMenuButton asChild>
              <Link to="/">
                <LogOut className="w-4 h-4" />
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
