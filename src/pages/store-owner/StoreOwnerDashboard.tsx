import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/layout/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Star, Users, TrendingUp, Store, Activity } from "lucide-react";
import { apiService } from "@/services/api";
import { useNotification } from "@/components/ui/notification";
import { useAuth } from "@/components/auth/AuthContext";

interface Rating {
  id: string;
  userId: string;
  storeId: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export const StoreOwnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [dashboardData, setDashboardData] = useState<{
    ratings: Rating[];
    avgRating: number;
  } | null>(null);
  const [ratingsData, setRatingsData] = useState<Rating[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'STORE_OWNER') {
      loadStoreOwnerData();
    }
  }, [user]);

  const loadStoreOwnerData = async () => {
    try {
      setIsLoading(true);
      const [dashboardResponse, ratingsResponse] = await Promise.all([
        apiService.getStoreOwnerDashboard(),
        apiService.getStoreOwnerRatings()
      ]);
      
      if (dashboardResponse.data) {
        setDashboardData(dashboardResponse.data);
      }
      
      if (ratingsResponse.data) {
        setRatingsData(ratingsResponse.data.ratings);
      }
    } catch (error) {
      showNotification('error', "Failed to load store owner data");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout
        title="Loading..."
        subtitle="Fetching your store data..."
        icon={Activity}
      >
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 bg-purple-pink-gradient rounded-xl flex items-center justify-center mb-4">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-navy mb-2">Loading...</h2>
            <p className="text-gray-600">Fetching your store data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!dashboardData) {
    return (
      <DashboardLayout
        title="No Store Found"
        subtitle="You don't have a store associated with your account."
        icon={Store}
      >
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
              <Store className="h-6 w-6 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-navy mb-2">No Store Found</h2>
            <p className="text-gray-600">You don't have a store associated with your account.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <DashboardLayout
      title="Store Owner Dashboard"
      subtitle="Store analytics and customer feedback overview"
      icon={Store}
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Average Rating"
          value={dashboardData.avgRating.toFixed(1)}
          icon={Star}
          description="Out of 5 stars"
        />
        <StatsCard
          title="Total Reviews"
          value={ratingsData.length}
          icon={Users}
          description="Customer ratings"
        />
        <StatsCard
          title="Rating Trend"
          value={dashboardData.avgRating >= 4 ? "Excellent" : dashboardData.avgRating >= 3 ? "Good" : "Needs Improvement"}
          icon={TrendingUp}
          description="Performance indicator"
        />
      </div>

      {/* Customer Ratings Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-navy flex items-center">
            <Star className="h-5 w-5 mr-2 text-purple-600" />
            Customer Ratings
          </h2>
        </div>
        <div className="p-6">
          {ratingsData.length > 0 ? (
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-navy">Customer</TableHead>
                    <TableHead className="font-semibold text-navy">Rating</TableHead>
                    <TableHead className="font-semibold text-navy">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ratingsData.map((rating) => (
                    <TableRow key={rating.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-navy">
                        {rating.user.name}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {renderStars(rating.rating)}
                          </div>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                            {rating.rating}/5
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-navy mb-2">
                No Ratings Yet
              </h3>
              <p className="text-gray-600">
                Your store hasn't received any customer ratings yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};