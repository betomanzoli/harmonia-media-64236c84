
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Calculator from "./pages/Calculator";
import Briefing from "./pages/Briefing";
import NotFound from "./pages/NotFound";
import AudioDatabase from "./pages/AudioDatabase";
import AdminPortfolio from "./pages/admin/AdminPortfolio";
import AdminDashboard from "./pages/admin/Dashboard";
import Packages from "./pages/Packages";
import Portfolio from "./pages/Portfolio";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import OrderTracking from "./pages/OrderTracking";
import { siteConfig } from "./config/site";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path={siteConfig.urls.calculator} element={<Calculator />} />
          <Route path={siteConfig.urls.briefing} element={<Briefing />} />
          <Route path={siteConfig.urls.portfolio} element={<Portfolio />} />
          <Route path={siteConfig.urls.packages} element={<Packages />} />
          <Route path="/privacidade" element={<PrivacyPolicy />} />
          <Route path="/termos" element={<Terms />} />
          <Route path={siteConfig.urls.orderTracking} element={<OrderTracking />} />
          <Route path="/admin-j28s7d1k/dashboard" element={<AdminDashboard />} />
          <Route path={siteConfig.urls.admin.audioDatabase} element={<AudioDatabase />} />
          <Route path={siteConfig.urls.admin.portfolio} element={<AdminPortfolio />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
