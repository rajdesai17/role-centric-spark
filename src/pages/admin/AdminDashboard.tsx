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

interface RecentActivity {
  type: string;
  id: string;
  title: string;
  description: string;
  timestamp: string;
  data: Record<string, unknown>;
}

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
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
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
      const [dashboardResponse, activityResponse] = await Promise.all([
        apiService.getDashboard(),
        apiService.getRecentActivity()
      ]);
      
      if (dashboardResponse.data) {
        setDashboardData(dashboardResponse.data);
      } else {
        showNotification('error', "Failed to load dashboard data");
      }
      
      if (activityResponse.data) {
        setRecentActivity(activityResponse.data.activities);
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
                  {recentActivity.length > 0 ? (
                    recentActivity.slice(0, 5).map((activity) => {
                      const getIcon = () => {
                        switch (activity.type) {
                          case 'user_created':
                            return <Users className="h-4 w-4 text-green-600" />;
                          case 'store_created':
                            return <Store className="h-4 w-4 text-blue-600" />;
                          case 'rating_created':
                            return <Star className="h-4 w-4 text-yellow-600" />;
                          default:
                            return <Activity className="h-4 w-4 text-gray-600" />;
                        }
                      };

                      const getBgColor = () => {
                        switch (activity.type) {
                          case 'user_created':
                            return 'bg-green-100';
                          case 'store_created':
                            return 'bg-blue-100';
                          case 'rating_created':
                            return 'bg-yellow-100';
                          default:
                            return 'bg-gray-100';
                        }
                      };

                      const getTimeAgo = (timestamp: string) => {
                        const now = new Date();
                        const activityTime = new Date(timestamp);
                        const diffInMinutes = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60));
                        
                        if (diffInMinutes < 1) return 'Just now';
                        if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
                        
                        const diffInHours = Math.floor(diffInMinutes / 60);
                        if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
                        
                        const diffInDays = Math.floor(diffInHours / 24);
                        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
                      };

                      return (
                        <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className={`w-8 h-8 ${getBgColor()} rounded-full flex items-center justify-center`}>
                            {getIcon()}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-navy">{activity.title}</div>
                            <div className="text-xs text-gray-500">{activity.description}</div>
                          </div>
                          <div className="text-xs text-gray-400">{getTimeAgo(activity.timestamp)}</div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Activity className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">No recent activity</p>
                    </div>
                  )}
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
            <AddUserForm onSuccess={() => setShowAddUserModal(false)} />
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
            <AddStoreForm onSuccess={() => setShowAddStoreModal(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};