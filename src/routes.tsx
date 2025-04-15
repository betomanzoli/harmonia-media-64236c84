
import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Calculator from './pages/Calculator';
import Contact from './pages/Contact';
import Qualificacao from './pages/Qualificacao';
import Briefing from './pages/Briefing';
import NotFound from './pages/NotFound';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProjects from './pages/admin/AdminProjects';
import AdminPreviews from './pages/admin/AdminPreviews';
import AdminPortfolio from './pages/admin/AdminPortfolio';
import AdminBriefings from './pages/admin/AdminBriefings';
import AdminOrders from './pages/admin/AdminOrders';
import AdminPayments from './pages/admin/AdminPayments';
import AdminIntegrations from './pages/admin/AdminIntegrations';
import AdminChat from './pages/admin/AdminChat';
import AdminSettings from './pages/admin/AdminSettings';
import AdminDocumentation from './pages/admin/AdminDocumentation';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import PreviewProjectPage from './pages/admin/PreviewProjectPage';
import MusicPreviews from './pages/MusicPreviews';

// Este é o componente que vai renderizar a prévia musical para clientes
import PreviewPage from './pages/PreviewPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/sobre',
    element: <About />,
  },
  {
    path: '/servicos',
    element: <Services />,
  },
  {
    path: '/portfolio',
    element: <Portfolio />,
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
    element: <Qualificacao />,
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
    element: <AdminDashboard />,
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
    element: <AdminOrders />,
  },
  {
    path: '/admin-j28s7d1k/payments',
    element: <AdminPayments />,
  },
  {
    path: '/admin-j28s7d1k/integrations',
    element: <AdminIntegrations />,
  },
  {
    path: '/admin-j28s7d1k/chat',
    element: <AdminChat />,
  },
  {
    path: '/admin-j28s7d1k/settings',
    element: <AdminSettings />,
  },
  {
    path: '/admin-j28s7d1k/documentation',
    element: <AdminDocumentation />,
  },
  {
    path: '/admin-j28s7d1k/analytics',
    element: <AdminAnalytics />,
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
