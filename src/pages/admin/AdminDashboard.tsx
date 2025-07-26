import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/layout/StatsCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users, Store, Star, Plus, BarChart3, Activity } from "lucide-react";
import { apiService } from "@/services/api";
import { useNotification } from "@/components/ui/notification";
import { UserManagement } from "./UserManagement";
import { StoreManagement } from "./StoreManagement";
import { AddUserForm } from "./AddUserForm";
import { AddStoreForm } from "./AddStoreForm";

export const AdminDashboard: React.FC = () => {
  const { showNotification } = useNotification();
  const location = useLocation();
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddStoreModal, setShowAddStoreModal] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Get current tab from URL parameters
  const urlParams = new URLSearchParams(location.search);
  const currentTab = urlParams.get('tab') || 'overview';

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getDashboard();
      if (response.data) {
        setDashboardData(response.data);
      } else {
        showNotification('error', "Failed to load dashboard data");
      }
    } catch (error) {
      showNotification('error', "Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  // Render content based on current tab
  const renderContent = () => {
    switch (currentTab) {
      case 'users':
        return <UserManagement />;
      case 'stores':
        return <StoreManagement />;
      case 'overview':
      default:
        return (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard
                title="Total Users"
                value={isLoading ? "..." : dashboardData.totalUsers}
                icon={Users}
                description="Active platform users"
              />
              <StatsCard
                title="Total Stores"
                value={isLoading ? "..." : dashboardData.totalStores}
                icon={Store}
                description="Registered stores"
              />
              <StatsCard
                title="Total Ratings"
                value={isLoading ? "..." : dashboardData.totalRatings}
                icon={Star}
                description="Customer reviews"
              />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                    <span>User Management</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">
                    Create and manage user accounts with role-based permissions.
                  </p>
                  <Button
                    onClick={() => setShowAddUserModal(true)}
                    className="bg-slate-900 text-white font-medium rounded-lg hover:opacity-90 transition"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New User
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                      <Store className="h-4 w-4 text-white" />
                    </div>
                    <span>Store Management</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">
                    Register and manage stores in the platform.
                  </p>
                  <Button
                    onClick={() => setShowAddStoreModal(true)}
                    className="bg-slate-900 text-white font-medium rounded-lg hover:opacity-90 transition"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Store
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-purple-600" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-navy">New user registered</div>
                      <div className="text-xs text-gray-500">John Doe joined the platform</div>
                    </div>
                    <div className="text-xs text-gray-400">2 min ago</div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Store className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-navy">Store added</div>
                      <div className="text-xs text-gray-500">TechStore was registered</div>
                    </div>
                    <div className="text-xs text-gray-400">15 min ago</div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Star className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-navy">New rating submitted</div>
                      <div className="text-xs text-gray-500">5-star review for CoffeeShop</div>
                    </div>
                    <div className="text-xs text-gray-400">1 hour ago</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        );
    }
  };

  return (
    <DashboardLayout
      title={
        currentTab === 'users' ? 'User Management' :
        currentTab === 'stores' ? 'Store Management' :
        'System Administration'
      }
      subtitle={
        currentTab === 'users' ? 'Manage user accounts and permissions' :
        currentTab === 'stores' ? 'Register and manage stores' :
        'Manage users, stores, and monitor platform activity'
      }
      icon={
        currentTab === 'users' ? Users :
        currentTab === 'stores' ? Store :
        BarChart3
      }
    >
      {renderContent()}

      {/* Add User Modal */}
      <Dialog open={showAddUserModal} onOpenChange={setShowAddUserModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            {/* <DialogTitle className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-purple-pink-gradient rounded-lg flex items-center justify-center">
                <Users className="h-3 w-3 text-white" />
              </div>
              <span>Add New User</span>
            </DialogTitle> */}
          </DialogHeader>
          <div className="mt-4">
            <AddUserForm />
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Store Modal */}
      <Dialog open={showAddStoreModal} onOpenChange={setShowAddStoreModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            {/* <DialogTitle className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-purple-pink-gradient rounded-lg flex items-center justify-center">
                <Store className="h-3 w-3 text-white" />
              </div>
              <span>Add New Store</span>
            </DialogTitle> */}
          </DialogHeader>
          <div className="mt-4">
            <AddStoreForm />
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};