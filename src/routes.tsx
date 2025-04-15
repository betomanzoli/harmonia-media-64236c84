
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
    element: <Home />, // Using Home as placeholder until Portfolio is fixed
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
    element: <Dashboard />,
  },
  {
    path: '/admin-j28s7d1k/projects',
    element: <AdminProjects />,
  },
  {
    path: '/admin-j28s7d1k/previews',
    element: <AdminPreviews />,
  },
  {
    path: '/admin-j28s7d1k/previews/:projectId',
    element: <PreviewProjectPage />,
  },
  {
    path: '/admin-j28s7d1k/portfolio',
    element: <AdminPortfolio />,
  },
  {
    path: '/admin-j28s7d1k/briefings',
    element: <AdminBriefings />,
  },
  {
    path: '/admin-j28s7d1k/orders',
    element: <NotFound />, // Temporary placeholder until AdminOrders is created
  },
  {
    path: '/admin-j28s7d1k/payments',
    element: <NotFound />, // Temporary placeholder until AdminPayments is created
  },
  {
    path: '/admin-j28s7d1k/integrations',
    element: <AdminIntegrations />,
  },
  {
    path: '/admin-j28s7d1k/chat',
    element: <NotFound />, // Temporary placeholder until AdminChat is created
  },
  {
    path: '/admin-j28s7d1k/settings',
    element: <NotFound />, // Temporary placeholder until AdminSettings is created
  },
  {
    path: '/admin-j28s7d1k/documentation',
    element: <AdminGuides />, // Using AdminGuides as temporary replacement
  },
  {
    path: '/admin-j28s7d1k/analytics',
    element: <AdminStatistics />, // Using AdminStatistics as temporary replacement
  },
  {
    path: '/admin-j28s7d1k/invoices',
    element: <AdminInvoices />,
  },
  {
    path: '/admin-j28s7d1k/storage',
    element: <AdminStorage />,
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
