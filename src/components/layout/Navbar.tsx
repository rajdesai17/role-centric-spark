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

  if (!user) return null;

  return (
    <nav className="border-b bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                RoleApp
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full">
              <User className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
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
              className="hidden md:flex text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
            <span className="hidden sm:block text-sm font-medium text-gray-700 px-3 py-1 bg-gray-50 rounded-full">
              {user.name}
            </span>
            {(user.role === 'NORMAL_USER' || user.role === 'STORE_OWNER') && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/update-password')}
                className="hidden md:flex border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-gray-200 hover:border-red-300 hover:bg-red-50 hover:text-red-700 transition-colors"
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