
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Home from '@/pages/Home';
import Portfolio from '@/pages/Portfolio';
import About from '@/pages/About';
import Pricing from '@/pages/Pricing';
import Contact from '@/pages/Contact';
import Briefing from '@/pages/Briefing';
import QualificationBriefing from '@/pages/QualificationBriefing';
import Payment from '@/pages/Payment';
import Success from '@/pages/Success';
import MusicPreviewPage from '@/pages/MusicPreviewPage';
import PreviewPage from '@/pages/PreviewPage';
import ClientPreviewProjectPage from '@/pages/PreviewProjectPage';
import AuthPage from '@/pages/AuthPage';

// Admin Pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminPreviews from '@/pages/admin/AdminPreviews';
import AdminProjects from '@/pages/admin/AdminProjects';
import AdminBriefings from '@/pages/admin/AdminBriefings';
import AdminClients from '@/pages/admin/AdminClients';
import AdminSettings from '@/pages/admin/AdminSettings';
import AdminPreviewProjectPage from '@/pages/admin/PreviewProjectPage';

// Client Dashboard
import ClientDashboard from '@/pages/client/ClientDashboard';
import ClientProjects from '@/pages/client/ClientProjects';
import ClientInvoices from '@/pages/client/ClientInvoices';
import ClientSettings from '@/pages/client/ClientSettings';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/precos" element={<Pricing />} />
        <Route path="/contato" element={<Contact />} />
        <Route path="/briefing" element={<Briefing />} />
        <Route path="/qualificacao" element={<QualificationBriefing />} />
        <Route path="/pagamento/:package" element={<Payment />} />
        <Route path="/sucesso" element={<Success />} />
        
        {/* Preview routes */}
        <Route path="/preview/:projectId" element={<PreviewPage />} />
        <Route path="/music-preview/:projectId" element={<MusicPreviewPage />} />
        <Route path="/project/:projectId" element={<ClientPreviewProjectPage />} />
        <Route path="/auth/preview/:projectId" element={<AuthPage />} />
        
        {/* Admin routes */}
        <Route path="/admin-j28s7d1k/dashboard" element={<AdminDashboard />} />
        <Route path="/admin-j28s7d1k/previews" element={<AdminPreviews />} />
        <Route path="/admin-j28s7d1k/previews/:projectId" element={<AdminPreviewProjectPage />} />
        <Route path="/admin-j28s7d1k/projects" element={<AdminProjects />} />
        <Route path="/admin-j28s7d1k/briefings" element={<AdminBriefings />} />
        <Route path="/admin-j28s7d1k/clients" element={<AdminClients />} />
        <Route path="/admin-j28s7d1k/settings" element={<AdminSettings />} />
        
        {/* Client dashboard routes */}
        <Route path="/cliente/dashboard" element={<ClientDashboard />} />
        <Route path="/cliente/projetos" element={<ClientProjects />} />
        <Route path="/cliente/faturas" element={<ClientInvoices />} />
        <Route path="/cliente/configuracoes" element={<ClientSettings />} />
      </Routes>
    </Router>
  );
}

export default App;
