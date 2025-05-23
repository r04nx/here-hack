
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/index"; // Fixed case sensitivity issue
import VendorDashboard from "./pages/vendor";
import AnalystDashboard from "./pages/analyst";
import EditorDashboard from "./pages/editor";
import ViewerDashboard from "./pages/viewer";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/vendor" element={<VendorDashboard />} />
          <Route path="/analyst" element={<AnalystDashboard />} />
          <Route path="/editor" element={<EditorDashboard />} />
          <Route path="/viewer" element={<ViewerDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
