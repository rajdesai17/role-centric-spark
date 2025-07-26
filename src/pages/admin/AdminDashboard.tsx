import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { StatsCard } from "@/components/layout/StatsCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users, Store, Star, Plus, BarChart3, Settings, Activity, Shield, X } from "lucide-react";
import { apiService } from "@/services/api";
import { toast } from "sonner";
import { UserManagement } from "./UserManagement";
import { StoreManagement } from "./StoreManagement";
import { AddUserForm } from "./AddUserForm";
import { AddStoreForm } from "./AddStoreForm";

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddStoreModal, setShowAddStoreModal] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0
  });
  const [isLoading, setIsLoading] = useState(true);

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
        toast.error("Failed to load dashboard data");
      }
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-purple-pink-gradient rounded-xl flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-navy">System Administration</h1>
              <p className="text-gray-600">Manage users, stores, and monitor platform activity</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-50 p-1 rounded-none border-b border-gray-200">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-white data-[state=active]:text-navy data-[state=active]:shadow-sm rounded-lg transition-all font-medium"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="users"
                className="data-[state=active]:bg-white data-[state=active]:text-navy data-[state=active]:shadow-sm rounded-lg transition-all font-medium"
              >
                Users
              </TabsTrigger>
              <TabsTrigger 
                value="stores"
                className="data-[state=active]:bg-white data-[state=active]:text-navy data-[state=active]:shadow-sm rounded-lg transition-all font-medium"
              >
                Stores
              </TabsTrigger>
              <TabsTrigger 
                value="forms"
                className="data-[state=active]:bg-white data-[state=active]:text-navy data-[state=active]:shadow-sm rounded-lg transition-all font-medium"
              >
                Forms
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

              {/* Recent Activity */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-navy mb-4 flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-purple-600" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-navy">New user registered</div>
                      <div className="text-xs text-gray-500">John Doe joined the platform</div>
                    </div>
                    <div className="text-xs text-gray-400">2 min ago</div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Store className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-navy">Store added</div>
                      <div className="text-xs text-gray-500">TechStore was registered</div>
                    </div>
                    <div className="text-xs text-gray-400">15 min ago</div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
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
              </div>
            </TabsContent>

            <TabsContent value="users" className="p-6">
              <UserManagement />
            </TabsContent>

            <TabsContent value="stores" className="p-6">
              <StoreManagement />
            </TabsContent>

            <TabsContent value="forms" className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-purple-pink-gradient rounded-lg flex items-center justify-center">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-navy">User Management</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Create and manage user accounts with role-based permissions.
                  </p>
                  <Button
                    onClick={() => setShowAddUserModal(true)}
                    className="bg-purple-pink-gradient text-white font-medium rounded-lg hover:opacity-90 transition"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New User
                  </Button>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-purple-pink-gradient rounded-lg flex items-center justify-center">
                      <Store className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-navy">Store Management</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Register and manage stores in the platform.
                  </p>
                  <Button
                    onClick={() => setShowAddStoreModal(true)}
                    className="bg-purple-pink-gradient text-white font-medium rounded-lg hover:opacity-90 transition"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Store
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        </div>
      </div>

      {/* Add User Modal */}
      <Dialog open={showAddUserModal} onOpenChange={setShowAddUserModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-purple-pink-gradient rounded-lg flex items-center justify-center">
                <Users className="h-3 w-3 text-white" />
              </div>
              <span>Add New User</span>
            </DialogTitle>
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
            <DialogTitle className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-purple-pink-gradient rounded-lg flex items-center justify-center">
                <Store className="h-3 w-3 text-white" />
              </div>
              <span>Add New Store</span>
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <AddStoreForm />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};