import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { StatsCard } from "@/components/layout/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Star, Users, TrendingUp } from "lucide-react";
import { apiService } from "@/services/api";
import { toast } from "sonner";
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
      toast.error("Failed to load store owner data");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="shadow-elegant">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">Loading...</h2>
              <p className="text-muted-foreground">
                Fetching your store data...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="shadow-elegant">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">No Store Found</h2>
              <p className="text-muted-foreground">
                You don't have a store associated with your account.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Store Owner Dashboard
          </h1>
          <p className="text-muted-foreground">
            Store analytics and customer feedback overview
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Customer Ratings</CardTitle>
          </CardHeader>
          <CardContent>
            {ratingsData.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ratingsData.map((rating) => (
                      <TableRow key={rating.id}>
                        <TableCell className="font-medium">
                          {rating.user.name}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              {renderStars(rating.rating)}
                            </div>
                            <Badge variant="secondary">
                              {rating.rating}/5
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(rating.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No Ratings Yet
                </h3>
                <p className="text-muted-foreground">
                  Your store hasn't received any customer ratings yet.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};