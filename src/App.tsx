
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
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
import AdminInvoices from "./pages/admin/AdminInvoices";
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
            <Route path={siteConfig.urls.calculator} element={<Calculator />} />
            <Route path={siteConfig.urls.briefing} element={<Briefing />} />
            <Route path={siteConfig.urls.portfolio} element={<Portfolio />} />
            <Route path={siteConfig.urls.packages} element={<Packages />} />
            <Route path="/privacidade" element={<PrivacyPolicy />} />
            <Route path="/termos" element={<Terms />} />
            <Route path={siteConfig.urls.orderTracking} element={<OrderTracking />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            
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
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="/pagamento" element={<Payment />} />
            <Route path="/pagamento/:packageId" element={<Payment />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AdminAuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
