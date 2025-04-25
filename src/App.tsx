
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Contact from './pages/Contact';
import About from './pages/About';
import Services from './pages/Services';
import PortfolioPage from './pages/Portfolio';
import Calculator from './pages/Calculator';
import MusicPreviews from './pages/MusicPreviews';
import PreviewPage from './pages/PreviewPage';
import MusicPreviewPage from './pages/MusicPreviewPage';
import FeedbackConfirmation from './pages/FeedbackConfirmation';
// Import admin pages from correct paths
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import AdminBriefings from './pages/admin/AdminBriefings';
import AdminPreviews from './pages/admin/AdminPreviews';
import AdminBriefingPage from './pages/admin/AdminBriefingPage';
import PreviewProjectPage from './pages/admin/PreviewProjectPage';
import Briefing from './pages/Briefing';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contato" element={<Contact />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/servicos" element={<Services />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/calculadora" element={<Calculator />} />
        <Route path="/briefing" element={<Briefing />} />
        <Route path="/previa/:previewId" element={<MusicPreviews />} />
        <Route path="/preview/:projectId" element={<PreviewPage />} />
        <Route path="/music-preview/:projectId" element={<MusicPreviewPage />} />
        <Route path="/feedback-confirmacao" element={<FeedbackConfirmation />} />
        
        {/* Admin Routes */}
        <Route path="/admin-j28s7d1k/login" element={<AdminLogin />} />
        <Route path="/admin-j28s7d1k/dashboard" element={<Dashboard />} />
        <Route path="/admin-j28s7d1k/briefings" element={<AdminBriefings />} />
        <Route path="/admin-j28s7d1k/briefing/:briefingId" element={<AdminBriefingPage />} />
        <Route path="/admin-j28s7d1k/previews" element={<AdminPreviews />} />
        <Route path="/admin-j28s7d1k/preview/:projectId" element={<PreviewProjectPage />} />
      </Routes>
    </Router>
  );
}

export default App;
