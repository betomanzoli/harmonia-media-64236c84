
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { 
  LayoutDashboard, 
  Users, 
  FolderOpen, 
  Settings,
  LogOut
} from 'lucide-react';

const NewAdminSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      title: 'Dashboard',
      url: '/admin',
      icon: LayoutDashboard,
    },
    {
      title: 'Clientes',
      url: '/admin/clients',
      icon: Users,
    },
    {
      title: 'Projetos',
      url: '/admin/projects',
      icon: FolderOpen,
    },
    {
      title: 'Configurações',
      url: '/admin/settings',
      icon: Settings,
    },
  ];

  const handleLogout = () => {
    // Clear any auth tokens
    localStorage.removeItem('admin-auth');
    navigate('/admin/login');
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location.pathname === item.url}
                  >
                    <button
                      onClick={() => navigate(item.url)}
                      className="w-full flex items-center gap-2"
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 text-red-600 hover:text-red-700"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sair</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default NewAdminSidebar;
