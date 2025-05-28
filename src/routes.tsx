
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Index from './pages/Index';
import PreviewPage from './pages/PreviewPage';
import OrderTracking from './pages/OrderTracking';
import MusicPreviews from './pages/MusicPreviews';
import MusicPreviewAuth from './pages/MusicPreviewAuth';
import MusicPreviewPage from './pages/MusicPreviewPage';
import Briefing from './pages/Briefing';
import ClientDashboard from './pages/ClientDashboard';
import FinalDeliveryPage from './pages/FinalDeliveryPage';
import AudioDatabase from './pages/AudioDatabase';
import ClientPreview from './pages/ClientPreview';
import AuthCallback from './pages/AuthCallback';

// Admin pages
import NewAdminLogin from './pages/admin/NewAdminLogin';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import AdminPreviews from './pages/admin/AdminPreviews';
import AdminBriefings from './pages/admin/AdminBriefings';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/preview/:projectId",
    element: <PreviewPage />,
  },
  {
    path: "/acompanhar-pedido",
    element: <OrderTracking />,
  },
  {
    path: "/music-previews/:previewId",
    element: <MusicPreviews />,
  },
  {
    path: "/music-preview-auth",
    element: <MusicPreviewAuth />,
  },
  {
    path: "/music-preview/:previewCode",
    element: <MusicPreviewPage />,
  },
  {
    path: "/briefing",
    element: <Briefing />,
  },
  {
    path: "/client-dashboard/:orderId",
    element: <ClientDashboard />,
  },
  {
    path: "/delivery/:id",
    element: <FinalDeliveryPage />,
  },
  {
    path: "/audio-database",
    element: <AudioDatabase />,
  },
  {
    path: "/client-preview/:previewCode",
    element: <ClientPreview />,
  },
  {
    path: "/auth/callback",
    element: <AuthCallback />,
  },

  // Admin routes
  {
    path: "/admin",
    element: <NewAdminLogin />,
  },
  {
    path: "/admin-j28s7d1k/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin-j28s7d1k/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/admin-j28s7d1k/previews",
    element: <AdminPreviews />,
  },
  {
    path: "/admin-j28s7d1k/briefings",
    element: <AdminBriefings />,
  },
]);
