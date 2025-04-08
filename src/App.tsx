import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminAuthProvider from "@/components/admin/auth/AdminAuthProvider";
import ProtectedRoute from "@/components/admin/auth/ProtectedRoute";
import Index from "./pages/Index";
import Calculator from "./pages/Calculator";
import Briefing from "./pages/Briefing";
import NotFound from "./pages/NotFound";
import AudioDatabase from "./pages/AudioDatabase";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminPortfolio from "./pages/admin/AdminPortfolio";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminPreviews from "./pages/admin/AdminPreviews";
import AdminIntegrations from "./pages/admin/AdminIntegrations";
import Packages from "./pages/Packages";
import Portfolio from "./pages/Portfolio";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import OrderTracking from "./pages/OrderTracking";
import MusicPreviews from "./pages/MusicPreviews";
import MusicPreviewSystem from "./components/previews/MusicPreviewSystem";
import FeedbackConfirmation from "./pages/FeedbackConfirmation";
import ApprovalConfirmation from "./pages/ApprovalConfirmation";
import Qualification from "./pages/Qualification";
import ThankYou from "./pages/ThankYou";
import Payment from "./pages/Payment";
import PaymentReturn from "./pages/PaymentReturn";
import AdminInvoices from "./pages/admin/AdminInvoices";
import PaymentProcessing from "./pages/PaymentProcessing";
import { siteConfig } from "./config/site";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AdminAuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/calculadora" element={<Calculator />} />
            <Route path={siteConfig.urls.briefing} element={<Briefing />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/pacotes" element={<Packages />} />
            <Route path="/privacidade" element={<PrivacyPolicy />} />
            <Route path="/termos" element={<Terms />} />
            <Route path="/acompanhar-pedido" element={<OrderTracking />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin-reset-password" element={<AdminLogin />} />
            
            {/* Rotas administrativas protegidas */}
            <Route path="/admin-j28s7d1k/dashboard" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin-j28s7d1k/previews" element={
              <ProtectedRoute>
                <AdminPreviews />
              </ProtectedRoute>
            } />
            <Route path="/admin-j28s7d1k/integrations" element={
              <ProtectedRoute>
                <AdminIntegrations />
              </ProtectedRoute>
            } />
            <Route path={siteConfig.urls.admin.audioDatabase} element={
              <ProtectedRoute>
                <AudioDatabase />
              </ProtectedRoute>
            } />
            <Route path={siteConfig.urls.admin.portfolio} element={
              <ProtectedRoute>
                <AdminPortfolio />
              </ProtectedRoute>
            } />
            <Route path="/admin-j28s7d1k/invoices" element={
              <ProtectedRoute>
                <AdminInvoices />
              </ProtectedRoute>
            } />
            
            {/* Sistema de prévias musicais */}
            <Route path="/previews/:previewId" element={<MusicPreviews />} />
            <Route path="/cliente/previews/:projectId" element={<MusicPreviewSystem />} />
            <Route path="/feedback-confirmacao" element={<FeedbackConfirmation />} />
            <Route path="/aprovacao-confirmacao" element={<ApprovalConfirmation />} />
            
            {/* Qualificação e agradecimento */}
            <Route path="/qualificacao" element={<Qualification />} />
            <Route path="/agradecimento" element={<ThankYou />} />
            
            {/* Pagamento */}
            <Route path="/pagamento" element={<Payment />} />
            <Route path="/pagamento/:packageId" element={<Payment />} />
            <Route path="/pagamento-processando" element={<PaymentProcessing />} />
            <Route path="/pagamento-retorno" element={<PaymentReturn />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AdminAuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
