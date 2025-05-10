
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import CitizenDashboard from "./pages/CitizenDashboard";
import MLADashboard from "./pages/MLADashboard";
import MLAPendingDemands from "./pages/MLAPendingDemands";
import OfficerDashboard from "./pages/OfficerDashboard";
import OfficerPendingDemands from "./pages/OfficerPendingDemands";
import OfficerPolicies from "./pages/OfficerPolicies";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminDemands from "./pages/AdminDemands";
import AdminSettings from "./pages/AdminSettings";
import SubmitDemand from "./pages/SubmitDemand";
import DemandDetails from "./pages/DemandDetails";
import NotFound from "./pages/NotFound";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

// Create a singleton QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
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
                    <Route path="/pending" element={<MLAPendingDemands />} />
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
                    <Route path="/pending" element={<OfficerPendingDemands />} />
                    <Route path="/policies" element={<OfficerPolicies />} />
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
                    <Route path="/users" element={<AdminUsers />} />
                    <Route path="/demands" element={<AdminDemands />} />
                    <Route path="/settings" element={<AdminSettings />} />
                  </Routes>
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
