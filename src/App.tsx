
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from "@/components/ui/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"

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

const App: React.FC = () => {
  const { toast } = useToast();

  // Mock authentication for demo purposes
  const authStatus = 'authenticated'; // or 'unauthenticated' or 'loading'
  const checkAuthStatus = () => console.log('Checking auth status');

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

  const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    if (authStatus === 'loading') {
      return <div>Carregando...</div>;
    }

    if (authStatus === 'unauthenticated') {
      toast({
        title: "Acesso negado",
        description: "Você precisa estar logado para acessar esta página.",
      })
      return <Navigate to="/admin-j28s7d1k/login" />;
    }

    return <>{children}</>;
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="harmonia-theme">
      <Router>
        <ScrollToTop />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/briefing" element={<Briefing />} />
          <Route path="/calculadora" element={<Calculator />} />
          
          {/* Admin routes */}
          <Route path="/admin-j28s7d1k" element={<Navigate to="/admin-j28s7d1k/dashboard" />} />
          <Route path="/admin-j28s7d1k/login" element={<AdminLogin />} />
          <Route path="/admin-j28s7d1k/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin-j28s7d1k/previews" element={<AdminRoute><AdminPreviews /></AdminRoute>} />
          <Route path="/admin-j28s7d1k/portfolio" element={<AdminRoute><AdminPortfolio /></AdminRoute>} />
          <Route path="/admin-j28s7d1k/invoices" element={<AdminRoute><AdminInvoices /></AdminRoute>} />
          <Route path="/admin-j28s7d1k/briefings" element={<AdminRoute><AdminBriefings /></AdminRoute>} />
          <Route path="/admin-j28s7d1k/projects" element={<AdminRoute><AdminProjects /></AdminRoute>} />
          <Route path="/admin-j28s7d1k/statistics" element={<AdminRoute><AdminStatistics /></AdminRoute>} />
          <Route path="/admin-j28s7d1k/guides" element={<AdminRoute><AdminGuides /></AdminRoute>} />
          
          {/* Payment routes */}
          <Route path="/pagamento/:packageId" element={<Payment />} />
          <Route path="/pagamento-retorno" element={<PaymentReturn />} />
          <Route path="/obrigado" element={<ThankYou />} />

          {/* Order tracking */}
          <Route path="/consultar-pedido" element={<OrderTracking />} />
          
          {/* Preview system */}
          <Route path="/previa/:previewId" element={<MusicPreviewPage />} />
          <Route path="/previews" element={<MusicPreviews />} />
          
          {/* Legal & Support pages */}
          <Route path="/support/credit-refund" element={<CreditRefundRequest />} />
          <Route path="/feedback-confirmation" element={<FeedbackConfirmation />} />
          <Route path="/approval-confirmation" element={<ApprovalConfirmation />} />
          
          {/* 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  );
};

export default App;
