
import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Calculator from './pages/Calculator';
import Contact from './pages/Contact';
import Briefing from './pages/Briefing';
import NotFound from './pages/NotFound';
import AdminLogin from './pages/admin/AdminLogin';
import PreviewProjectPage from './pages/admin/PreviewProjectPage';
import MusicPreviews from './pages/MusicPreviews';
import PreviewPage from './pages/PreviewPage';

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
    element: <NotFound />, // Temporary placeholder until AdminDashboard is created
  },
  {
    path: '/admin-j28s7d1k/projects',
    element: <NotFound />, // Temporary placeholder until AdminProjects is created
  },
  {
    path: '/admin-j28s7d1k/previews',
    element: <NotFound />, // Temporary placeholder until AdminPreviews is created
  },
  {
    path: '/admin-j28s7d1k/previews/:projectId',
    element: <PreviewProjectPage />,
  },
  {
    path: '/admin-j28s7d1k/portfolio',
    element: <NotFound />, // Temporary placeholder until AdminPortfolio is created
  },
  {
    path: '/admin-j28s7d1k/briefings',
    element: <NotFound />, // Temporary placeholder until AdminBriefings is created
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
    element: <NotFound />, // Temporary placeholder until AdminIntegrations is created
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
    element: <NotFound />, // Temporary placeholder until AdminDocumentation is created
  },
  {
    path: '/admin-j28s7d1k/analytics',
    element: <NotFound />, // Temporary placeholder until AdminAnalytics is created
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
