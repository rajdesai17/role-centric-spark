import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/components/auth/AuthContext";
import { NotificationProvider } from "@/components/ui/notification";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Login } from "@/pages/Login";
import { Signup } from "@/pages/Signup";
import { UpdatePassword } from "@/pages/UpdatePassword";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { UserDashboard } from "@/pages/user/UserDashboard";
import { StoreOwnerDashboard } from "@/pages/store-owner/StoreOwnerDashboard";
import NotFound from "./pages/NotFound";
import LandingPage from "@/pages/LandingPage";

const queryClient = new QueryClient();

const DashboardRouter = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-purple-pink-gradient rounded-full animate-spin"></div>
          <span className="text-gray-600 font-medium">Loading...</span>
        </div>
      </div>
    );
  }
  
  if (!user) return <Navigate to="/login" replace />;
  
  switch (user.role) {
    case 'SYSTEM_ADMIN':
      return <AdminDashboard />;
    case 'STORE_OWNER':
      return <StoreOwnerDashboard />;
    case 'NORMAL_USER':
      return <UserDashboard />;
    default:
      return <Navigate to="/login" replace />;
  }
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <NotificationProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardRouter />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/update-password" 
                element={
                  <ProtectedRoute allowedRoles={['NORMAL_USER', 'STORE_OWNER']}>
                    <UpdatePassword />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </NotificationProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
