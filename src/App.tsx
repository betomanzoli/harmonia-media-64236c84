
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import ProtectedRoute from './components/admin/auth/ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';

// Public Pages
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Briefing from './pages/Briefing';
import Calculator from './pages/Calculator';
import Payment from './pages/Payment';
import PaymentReturn from './pages/PaymentReturn';
import ThankYou from './pages/ThankYou';
import OrderTracking from './pages/OrderTracking';
import MusicPreviewPage from './pages/MusicPreviewPage';
import MusicPreviews from './pages/MusicPreviews';
import CreditRefundRequest from './pages/CreditRefundRequest';
import FeedbackConfirmation from './pages/FeedbackConfirmation';
import ApprovalConfirmation from './pages/ApprovalConfirmation';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/Dashboard';
import AdminPreviews from './pages/admin/AdminPreviews';
import AdminPortfolio from './pages/admin/AdminPortfolio';
import AdminInvoices from './pages/admin/AdminInvoices';
import AdminBriefings from './pages/admin/AdminBriefings';
import AdminProjects from './pages/admin/AdminProjects';
import AdminStatistics from './pages/admin/AdminStatistics';
import AdminGuides from './pages/admin/AdminGuides';
import AdminStorage from './pages/admin/AdminStorage';
import AdminIntegrations from './pages/admin/AdminIntegrations';
import PreviewProjectPage from './pages/admin/PreviewProjectPage';

// Layout component to include Header and Footer for public pages
const PublicLayout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.includes('admin-j28s7d1k') || location.pathname.includes('admin-login');
  
  if (isAdminRoute) {
    return <>{children}</>;
  }
  
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

const App: React.FC = () => {
  const { authStatus, checkAuthStatus } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Custom hook to scroll to top on route change
  const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);

    return null;
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="harmonia-theme">
      <Router>
        <ScrollToTop />
        
        <Routes>
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/briefing" element={<PublicLayout><Briefing /></PublicLayout>} />
          <Route path="/calculadora" element={<PublicLayout><Calculator /></PublicLayout>} />
          
          {/* Admin routes */}
          <Route path="/admin-j28s7d1k" element={<Navigate to="/admin-j28s7d1k/dashboard" />} />
          <Route path="/admin-j28s7d1k/login" element={<AdminLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-j28s7d1k/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin-j28s7d1k/previews" element={<ProtectedRoute><AdminPreviews /></ProtectedRoute>} />
          <Route path="/admin-j28s7d1k/previews/:projectId" element={<ProtectedRoute><PreviewProjectPage /></ProtectedRoute>} />
          <Route path="/admin-j28s7d1k/portfolio" element={<ProtectedRoute><AdminPortfolio /></ProtectedRoute>} />
          <Route path="/admin-j28s7d1k/invoices" element={<ProtectedRoute><AdminInvoices /></ProtectedRoute>} />
          <Route path="/admin-j28s7d1k/briefings" element={<ProtectedRoute><AdminBriefings /></ProtectedRoute>} />
          <Route path="/admin-j28s7d1k/projects" element={<ProtectedRoute><AdminProjects /></ProtectedRoute>} />
          <Route path="/admin-j28s7d1k/statistics" element={<ProtectedRoute><AdminStatistics /></ProtectedRoute>} />
          <Route path="/admin-j28s7d1k/guides" element={<ProtectedRoute><AdminGuides /></ProtectedRoute>} />
          <Route path="/admin-j28s7d1k/storage" element={<ProtectedRoute><AdminStorage /></ProtectedRoute>} />
          <Route path="/admin-j28s7d1k/integrations" element={<ProtectedRoute><AdminIntegrations /></ProtectedRoute>} />
          <Route path="/admin-j28s7d1k/settings" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          
          {/* Payment routes */}
          <Route path="/pagamento/:packageId" element={<PublicLayout><Payment /></PublicLayout>} />
          <Route path="/pagamento-retorno" element={<PublicLayout><PaymentReturn /></PublicLayout>} />
          <Route path="/obrigado" element={<PublicLayout><ThankYou /></PublicLayout>} />

          {/* Order tracking */}
          <Route path="/consultar-pedido" element={<PublicLayout><OrderTracking /></PublicLayout>} />
          
          {/* Preview system */}
          <Route path="/previa/:previewId" element={<PublicLayout><MusicPreviewPage /></PublicLayout>} />
          <Route path="/preview/:previewId" element={<PublicLayout><MusicPreviewPage /></PublicLayout>} />
          <Route path="/previews" element={<PublicLayout><MusicPreviews /></PublicLayout>} />
          
          {/* Legal & Support pages */}
          <Route path="/support/credit-refund" element={<PublicLayout><CreditRefundRequest /></PublicLayout>} />
          <Route path="/feedback-confirmation" element={<PublicLayout><FeedbackConfirmation /></PublicLayout>} />
          <Route path="/approval-confirmation" element={<PublicLayout><ApprovalConfirmation /></PublicLayout>} />
          
          {/* 404 page */}
          <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  );
};

export default App;
