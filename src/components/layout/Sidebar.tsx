import React, { useState } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Users, 
  Store, 
  Settings, 
  Search, 
  Star, 
  User,
  Menu,
  X,
  Home,
  LogOut
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  onClick?: () => void;
}

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getSidebarItems = (): SidebarItem[] => {
    if (!user) return [];

    switch (user.role) {
      case 'SYSTEM_ADMIN':
        return [
          {
            id: 'dashboard',
            label: 'Dashboard',
            icon: BarChart3,
            href: '/dashboard'
          },
          {
            id: 'users',
            label: 'User Management',
            icon: Users,
            href: '/dashboard?tab=users'
          },
          {
            id: 'stores',
            label: 'Store Management',
            icon: Store,
            href: '/dashboard?tab=stores'
          },
          {
            id: 'settings',
            label: 'Settings',
            icon: Settings,
            onClick: () => navigate('/update-password')
          }
        ];

      case 'NORMAL_USER':
        return [
          {
            id: 'explorer',
            label: 'Store Explorer',
            icon: Search,
            href: '/dashboard'
          },
          {
            id: 'reviews',
            label: 'My Reviews',
            icon: Star,
            href: '/dashboard?tab=reviews'
          },
          {
            id: 'profile',
            label: 'Profile',
            icon: User,
            onClick: () => navigate('/update-password')
          }
        ];

      case 'STORE_OWNER':
        return [
          {
            id: 'overview',
            label: 'Store Overview',
            icon: BarChart3,
            href: '/dashboard'
          },
          {
            id: 'ratings',
            label: 'Customer Ratings',
            icon: Star,
            href: '/dashboard?tab=ratings'
          },
          {
            id: 'settings',
            label: 'Store Settings',
            icon: Settings,
            onClick: () => navigate('/update-password')
          }
        ];

      default:
        return [];
    }
  };

  const sidebarItems = getSidebarItems();
  const currentPath = location.pathname + location.search;

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full bg-white border-r border-slate-200 z-50 transition-all duration-300 flex flex-col shadow-lg
        ${isCollapsed ? 'w-16' : 'w-64'} 
        lg:relative lg:translate-x-0
        ${!isCollapsed ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 flex-shrink-0 bg-white">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
                             <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                 <span className="text-white font-bold text-sm">R</span>
               </div>
              <span className="text-lg font-bold text-navy">RoleApp</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="lg:hidden"
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-slate-200 flex-shrink-0 bg-white">
          {!isCollapsed ? (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-navy truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role === 'SYSTEM_ADMIN' ? 'Administrator' : 
                   user?.role === 'STORE_OWNER' ? 'Store Owner' : 'User'}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
          )}
        </div>

        {/* Navigation - Takes up remaining space */}
        <nav className="flex-1 p-4 space-y-3 overflow-y-auto">
          <div className="mb-2">
            <h3 className={`text-xs font-semibold text-slate-500 uppercase tracking-wider ${isCollapsed ? 'sr-only' : ''}`}>
              Navigation
            </h3>
          </div>
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.href ? currentPath === item.href : false;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`
                  w-full justify-start h-12 px-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'bg-slate-900 text-white shadow-lg' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }
                  ${isCollapsed ? 'justify-center px-2' : ''}
                `}
                onClick={item.onClick || (() => item.href && navigate(item.href))}
              >
                <Icon className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} />
                {!isCollapsed && item.label}
              </Button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 flex-shrink-0 bg-white">
          <Button
            variant="ghost"
            className={`
              w-full justify-start h-12 px-3 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50
              ${isCollapsed ? 'justify-center px-2' : ''}
            `}
            onClick={handleLogout}
          >
            <LogOut className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} />
            {!isCollapsed && 'Logout'}
          </Button>
        </div>
      </div>

      {/* Mobile Toggle Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsCollapsed(false)}
        className="fixed top-4 left-4 z-50 lg:hidden"
      >
        <Menu className="h-4 w-4" />
      </Button>
    </>
  );
}; 