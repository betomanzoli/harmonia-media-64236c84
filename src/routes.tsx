
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
import { ProtectedRoute } from './components/admin/auth/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/sobre',
    element: <Home />, // Temporary redirect until About page is created
  },
  {
    path: '/servicos',
    element: <Home />, // Temporary redirect until Services page is created
  },
  {
    path: '/portfolio',
    element: <PortfolioPage />,
  },
  {
    path: '/calculadora',
    element: <Calculator />,
  },
  {
    path: '/contato',
    element: <Contact />,
  },
  {
    path: '/qualificacao',
    element: <Home />, // Temporary redirect until Qualificacao page is created
  },
  {
    path: '/briefing',
    element: <Briefing />,
  },
  {
    path: '/preview/:previewId',
    element: <MusicPreviews />,
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
    path: '/admin-j28s7d1k/orders',
    element: <ProtectedRoute><AdminProjects /></ProtectedRoute>, // Now redirecting to Projects page
  },
  {
    path: '/admin-j28s7d1k/payments',
    element: <ProtectedRoute><AdminInvoices /></ProtectedRoute>, // Now redirecting to Invoices page
  },
  {
    path: '/admin-j28s7d1k/integrations',
    element: <ProtectedRoute><AdminIntegrations /></ProtectedRoute>,
  },
  {
    path: '/admin-j28s7d1k/chat',
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>, // Temporary redirect to Dashboard
  },
  {
    path: '/admin-j28s7d1k/settings',
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>, // Temporary redirect to Dashboard
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
    // Rota pública para visualização de prévias (acessível por qualquer pessoa com o link)
    path: '/preview/:projectId',
    element: <PreviewPage />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
