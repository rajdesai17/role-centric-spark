import React, { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  title, 
  subtitle,
  icon: Icon 
}) => {
  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        <div className="p-6 lg:p-8">
          {/* Page Header */}
          {title && (
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-2">
                {Icon && (
                  <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
                  {subtitle && (
                    <p className="text-slate-600 mt-1">{subtitle}</p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Content */}
          <div className="space-y-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}; 