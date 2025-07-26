import { useAuth } from "@/components/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User, Settings, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Always render navbar structure to prevent layout shifts
  if (!user) {
    return (
      <nav className="fixed top-4 left-4 right-4 z-50 bg-white rounded-full shadow-card border border-gray-100 opacity-0 pointer-events-none">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="h-10" />
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-4 left-4 right-4 z-50 bg-white rounded-full shadow-card border border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-pink-gradient rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-xl font-bold text-navy">
                Store Rating App
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-full">
              <User className="h-4 w-4 text-blue" />
              <span className="text-sm font-medium text-navy">
                {user.role === 'SYSTEM_ADMIN' ? 'System Administrator' : 
                 user.role === 'STORE_OWNER' ? 'Store Owner' : 'User'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="hidden md:flex text-gray-600 hover:text-navy hover:bg-gray-50 rounded-full transition-colors"
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
            <span className="hidden sm:block text-sm font-medium text-navy px-4 py-2 bg-gray-50 rounded-full">
              {user.name}
            </span>
            {(user.role === 'NORMAL_USER' || user.role === 'STORE_OWNER') && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/update-password')}
                className="hidden md:flex border-gray-200 hover:border-blue hover:bg-blue/5 rounded-full transition-colors"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-gray-200 hover:border-red-300 hover:bg-red-50 hover:text-red-700 rounded-full transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};