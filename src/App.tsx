
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import CitizenDashboard from "./pages/CitizenDashboard";
import MLADashboard from "./pages/MLADashboard";
import OfficerDashboard from "./pages/OfficerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SubmitDemand from "./pages/SubmitDemand";
import DemandDetails from "./pages/DemandDetails";
import NotFound from "./pages/NotFound";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Citizen Routes */}
            <Route 
              path="/citizen/*" 
              element={
                <ProtectedRoute allowedRoles={["Common Citizen"]}>
                  <Routes>
                    <Route path="/" element={<CitizenDashboard />} />
                    <Route path="/submit-demand" element={<SubmitDemand />} />
                    <Route path="/demand/:id" element={<DemandDetails />} />
                  </Routes>
                </ProtectedRoute>
              } 
            />
            
            {/* MLA Routes */}
            <Route 
              path="/mla/*" 
              element={
                <ProtectedRoute allowedRoles={["MLA"]}>
                  <Routes>
                    <Route path="/" element={<MLADashboard />} />
                    <Route path="/demand/:id" element={<DemandDetails />} />
                  </Routes>
                </ProtectedRoute>
              } 
            />
            
            {/* Officer Routes */}
            <Route 
              path="/officer/*" 
              element={
                <ProtectedRoute allowedRoles={["Higher Public Officer"]}>
                  <Routes>
                    <Route path="/" element={<OfficerDashboard />} />
                    <Route path="/demand/:id" element={<DemandDetails />} />
                  </Routes>
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute allowedRoles={["Admin"]}>
                  <Routes>
                    <Route path="/" element={<AdminDashboard />} />
                  </Routes>
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
