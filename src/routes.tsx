
import React from 'react';
import { RouteObject } from 'react-router-dom';
import Briefing from './pages/Briefing';
import Calculator from './pages/Calculator';
import MusicPreviews from './pages/MusicPreviews';
import PreviewPage from './pages/PreviewPage';
import PortfolioPage from './pages/Portfolio';
import QualificacaoPage from './pages/Qualificacao';
import Payment from './pages/Payment';
import PaymentReturn from './pages/PaymentReturn';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import Packages from './pages/Packages';
import OrderTracking from './pages/OrderTracking';
import FeedbackConfirmation from './pages/FeedbackConfirmation';
import AdminBriefings from './pages/admin/AdminBriefings';
import AdminProjects from './pages/admin/AdminProjects';
import AdminPortfolio from './pages/admin/AdminPortfolio';
import AdminClients from './pages/admin/AdminClients';
import AdminSettings from './pages/admin/AdminSettings';
import AdminInvoices from './pages/admin/AdminInvoices';
import AdminStorage from './pages/admin/AdminStorage';
import AdminIntegrations from './pages/admin/AdminIntegrations';
import AdminStatistics from './pages/admin/AdminStatistics';
import AdminGuides from './pages/admin/AdminGuides';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import PreviewProjectPage from './pages/admin/PreviewProjectPage';
import BriefingComplete from './pages/BriefingComplete';
import BriefingSuccess from './pages/BriefingSuccess';

// These routes are supplementary to the main routes defined in App.tsx
const additionalRoutes: RouteObject[] = [
  {
    path: '/briefing',
    element: <Briefing />,
  },
  {
    path: '/briefing-complete',
    element: <BriefingComplete />,
  },
  {
    path: '/briefing-success',
    element: <BriefingSuccess />,
  },
  {
    path: '/calculadora',
    element: <Calculator />,
  },
  {
    path: '/portfolio',
    element: <PortfolioPage />,
  },
  {
    path: '/qualificacao',
    element: <QualificacaoPage />,
  },
  {
    path: '/pagamento/:packageId',
    element: <Payment />,
  },
  {
    path: '/pagamento-retorno',
    element: <PaymentReturn />,
  },
  {
    path: '/acompanhar-pedido',
    element: <OrderTracking />,
  },
  {
    path: '/privacidade',
    element: <PrivacyPolicy />,
  },
  {
    path: '/termos',
    element: <Terms />,
  },
  {
    path: '/pacotes',
    element: <Packages />,
  },
  {
    path: '/preview/:projectId',
    element: <PreviewPage />,
  },
  {
    path: '/preview/:previewId',
    element: <MusicPreviews />,
  },
  {
    path: '/feedback-confirmacao',
    element: <FeedbackConfirmation />,
  },
  {
    path: '/servicos',
    element: <ServicesPage />,
  },
  {
    path: '/contato',
    element: <ContactPage />,
  },
  {
    path: '/como-funciona',
    element: <ServicesPage />,
  },
  
  {
    path: '/admin-j28s7d1k/briefings',
    element: <AdminBriefings />,
  },
  {
    path: '/admin-j28s7d1k/projects',
    element: <AdminProjects />,
  },
  {
    path: '/admin-j28s7d1k/portfolio',
    element: <AdminPortfolio />,
  },
  {
    path: '/admin-j28s7d1k/previews/:projectId',
    element: <PreviewProjectPage />,
  },
  {
    path: '/admin-j28s7d1k/clients',
    element: <AdminClients />,
  },
  {
    path: '/admin-j28s7d1k/settings',
    element: <AdminSettings />,
  },
  {
    path: '/admin-j28s7d1k/orders',
    element: <AdminProjects />,
  },
  {
    path: '/admin-j28s7d1k/payments',
    element: <AdminInvoices />,
  },
  {
    path: '/admin-j28s7d1k/analytics',
    element: <AdminStatistics />,
  },
  {
    path: '/admin-j28s7d1k/statistics',
    element: <AdminStatistics />,
  },
  {
    path: '/admin-j28s7d1k/guides',
    element: <AdminGuides />,
  },
  {
    path: '/admin-j28s7d1k/documentation',
    element: <AdminGuides />,
  },
  {
    path: '/admin-j28s7d1k/integrations',
    element: <AdminIntegrations />,
  },
  {
    path: '/admin-j28s7d1k/invoices',
    element: <AdminInvoices />,
  },
  {
    path: '/admin-j28s7d1k/storage',
    element: <AdminStorage />,
  },
];

export default additionalRoutes;
