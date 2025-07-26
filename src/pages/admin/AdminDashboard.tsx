import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { StatsCard } from "@/components/layout/StatsCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Store, Star, Plus, BarChart3 } from "lucide-react";
import { apiService } from "@/services/api";
import { toast } from "sonner";
import { UserManagement } from "./UserManagement";
import { StoreManagement } from "./StoreManagement";
import { AddUserForm } from "./AddUserForm";
import { AddStoreForm } from "./AddStoreForm";

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddStore, setShowAddStore] = useState(false);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                System Administration
              </h1>
              <p className="text-gray-600 mt-1">
                Manage users, stores, and monitor platform activity
              </p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="users"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300"
            >
              User Management
            </TabsTrigger>
            <TabsTrigger 
              value="stores"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300"
            >
              Store Management
            </TabsTrigger>
            <TabsTrigger 
              value="forms"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300"
            >
              Add New
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard
                title="Total Users"
                value={isLoading ? 0 : dashboardData.totalUsers}
                icon={Users}
                description="Active platform users"
              />
              <StatsCard
                title="Total Stores"
                value={isLoading ? 0 : dashboardData.totalStores}
                icon={Store}
                description="Registered stores"
              />
              <StatsCard
                title="Total Ratings"
                value={isLoading ? 0 : dashboardData.totalRatings}
                icon={Star}
                description="Customer reviews"
              />
            </div>
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="stores">
            <StoreManagement />
          </TabsContent>

          <TabsContent value="forms" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Add New User</h3>
                  <Button
                    onClick={() => setShowAddUser(!showAddUser)}
                    variant={showAddUser ? "secondary" : "default"}
                    className={showAddUser ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {showAddUser ? "Hide Form" : "Show Form"}
                  </Button>
                </div>
                {showAddUser && <AddUserForm />}
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Add New Store</h3>
                  <Button
                    onClick={() => setShowAddStore(!showAddStore)}
                    variant={showAddStore ? "secondary" : "default"}
                    className={showAddStore ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {showAddStore ? "Hide Form" : "Show Form"}
                  </Button>
                </div>
                {showAddStore && <AddStoreForm />}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};