import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/index";
import { LoginCard } from "@/components/Login/LoginCard";
import SignInPage from "./pages/signin";
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
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginCard />} />
          <Route path="/signin/:type" element={<SignInPage />} />
          <Route path="/vendor" element={<VendorDashboard />} />
          <Route path="/analyst" element={<AnalystDashboard />} />
          <Route path="/editor" element={<EditorDashboard />} />
          <Route path="/viewer" element={<ViewerDashboard />} />
          {/* ADD RFL CUSTOM ROUTES ABOVE THE CATCH-RFL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
