
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
import Packages from "./pages/Packages";
import Portfolio from "./pages/Portfolio";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import OrderTracking from "./pages/OrderTracking";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/calculadora" element={<Calculator />} />
          <Route path="/briefing" element={<Briefing />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/pacotes" element={<Packages />} />
          <Route path="/privacidade" element={<PrivacyPolicy />} />
          <Route path="/termos" element={<Terms />} />
          <Route path="/acompanhar-pedido" element={<OrderTracking />} />
          <Route path="/admin-j28s7d1k/audio-database" element={<AudioDatabase />} />
          <Route path="/admin-j28s7d1k/portfolio" element={<AdminPortfolio />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
