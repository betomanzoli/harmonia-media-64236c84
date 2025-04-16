
import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Calculator from './pages/Calculator';
import Contact from './pages/Contact';
import Briefing from './pages/Briefing';
import NotFound from './pages/NotFound';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import PreviewProjectPage from './pages/admin/PreviewProjectPage';
import MusicPreviews from './pages/MusicPreviews';
import PreviewPage from './pages/PreviewPage';
import AdminPreviews from './pages/admin/AdminPreviews';
import AdminPortfolio from './pages/admin/AdminPortfolio';
import AdminBriefings from './pages/admin/AdminBriefings';
import AdminProjects from './pages/admin/AdminProjects';
import AdminInvoices from './pages/admin/AdminInvoices';
import AdminStorage from './pages/admin/AdminStorage';
import AdminIntegrations from './pages/admin/AdminIntegrations';
import AdminStatistics from './pages/admin/AdminStatistics';
import AdminGuides from './pages/admin/AdminGuides';
import PortfolioPage from './pages/Portfolio';
import AboutPage from './pages/About';
import ServicesPage from './pages/Services';
import QualificacaoPage from './pages/Qualificacao';
import Payment from './pages/Payment';
import PaymentReturn from './pages/PaymentReturn';
import AdminClients from './pages/admin/AdminClients';
import AdminSettings from './pages/admin/AdminSettings';
import { ProtectedRoute } from './components/admin/auth/ProtectedRoute';
import PublicLayout from './layouts/PublicLayout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout><Home /></PublicLayout>,
  },
  {
    path: '/sobre',
    element: <PublicLayout><AboutPage /></PublicLayout>,
  },
  {
    path: '/servicos',
    element: <PublicLayout><ServicesPage /></PublicLayout>,
  },
  {
    path: '/portfolio',
    element: <PublicLayout><PortfolioPage /></PublicLayout>,
  },
  {
    path: '/calculadora',
    element: <PublicLayout><Calculator /></PublicLayout>,
  },
  {
    path: '/contato',
    element: <PublicLayout><Contact /></PublicLayout>,
  },
  {
    path: '/qualificacao',
    element: <PublicLayout><QualificacaoPage /></PublicLayout>,
  },
  {
    path: '/briefing',
    element: <PublicLayout><Briefing /></PublicLayout>,
  },
  {
    path: '/pagamento/:packageId',
    element: <PublicLayout><Payment /></PublicLayout>,
  },
  {
    path: '/pagamento-retorno',
    element: <PublicLayout><PaymentReturn /></PublicLayout>,
  },
  {
    path: '/preview/:previewId',
    element: <PublicLayout><MusicPreviews /></PublicLayout>,
  },
  {
    path: '/admin-j28s7d1k/login',
    element: <AdminLogin />,
  },
  {
    path: '/admin-j28s7d1k/dashboard',
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
  },
  {
    path: '/admin-j28s7d1k/projects',
    element: <ProtectedRoute><AdminProjects /></ProtectedRoute>,
  },
  {
    path: '/admin-j28s7d1k/previews',
    element: <ProtectedRoute><AdminPreviews /></ProtectedRoute>,
  },
  {
    path: '/admin-j28s7d1k/previews/:projectId',
    element: <ProtectedRoute><PreviewProjectPage /></ProtectedRoute>,
  },
  {
    path: '/admin-j28s7d1k/portfolio',
    element: <ProtectedRoute><AdminPortfolio /></ProtectedRoute>,
  },
  {
    path: '/admin-j28s7d1k/briefings',
    element: <ProtectedRoute><AdminBriefings /></ProtectedRoute>,
  },
  {
    path: '/admin-j28s7d1k/clients',
    element: <ProtectedRoute><AdminClients /></ProtectedRoute>,
  },
  {
    path: '/admin-j28s7d1k/settings',
    element: <ProtectedRoute><AdminSettings /></ProtectedRoute>,
  },
  {
    path: '/admin-j28s7d1k/orders',
    element: <ProtectedRoute><AdminProjects /></ProtectedRoute>,
  },
  {
    path: '/admin-j28s7d1k/payments',
    element: <ProtectedRoute><AdminInvoices /></ProtectedRoute>,
  },
  {
    path: '/admin-j28s7d1k/integrations',
    element: <ProtectedRoute><AdminIntegrations /></ProtectedRoute>,
  },
  {
    path: '/admin-j28s7d1k/documentation',
    element: <ProtectedRoute><AdminGuides /></ProtectedRoute>,
  },
  {
    path: '/admin-j28s7d1k/analytics',
    element: <ProtectedRoute><AdminStatistics /></ProtectedRoute>,
  },
  {
    path: '/admin-j28s7d1k/invoices',
    element: <ProtectedRoute><AdminInvoices /></ProtectedRoute>,
  },
  {
    path: '/admin-j28s7d1k/storage',
    element: <ProtectedRoute><AdminStorage /></ProtectedRoute>,
  },
  {
    // Public preview route accessible to anyone with the link
    path: '/preview/:projectId',
    element: <PublicLayout><PreviewPage /></PublicLayout>,
  },
  {
    path: '*',
    element: <PublicLayout><NotFound /></PublicLayout>,
  },
]);

export default router;
