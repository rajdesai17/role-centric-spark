import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Star } from "lucide-react";
import { apiService } from "@/services/api";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthContext";
import { RatingDialog } from "./RatingDialog";

interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  averageRating: number;
  totalRatings: number;
  userRating?: number;
}

interface UserRating {
  id: string;
  rating: number;
  createdAt: string;
}

export const StoreExplorer: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStores();
  }, [searchTerm]);

  const loadStores = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getUserStores(searchTerm || undefined);
      if (response.data) {
        setStores(response.data.stores);
      } else {
        toast.error("Failed to load stores");
      }
    } catch (error) {
      toast.error("Failed to load stores");
    } finally {
      setIsLoading(false);
    }
  };

  const getUserRating = (storeId: string): UserRating | undefined => {
    const store = stores.find(s => s.id === storeId);
    if (store?.userRating) {
      return {
        id: storeId, // Using storeId as fallback since we don't have rating ID
        rating: store.userRating,
        createdAt: store.createdAt // Using store creation date as fallback
      };
    }
    return undefined;
  };

  const handleRatingSubmitted = () => {
    // Reload stores to get updated data
    loadStores();
  };

  const handleRateStore = (storeId: string) => {
    setSelectedStore(storeId);
    setShowRatingDialog(true);
  };

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
    <div className="space-y-6">
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Stores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by store name or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <Card className="shadow-soft">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-medium text-foreground mb-2">Loading stores...</h3>
            <p className="text-muted-foreground">Please wait while we fetch the stores.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => {
            const userRating = getUserRating(store.id);
            
            return (
              <Card key={store.id} className="shadow-soft hover:shadow-elegant transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-lg">{store.name}</CardTitle>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{store.address}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Overall Rating:</span>
                        {store.averageRating > 0 ? (
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-medium">{store.averageRating.toFixed(1)}</span>
                            <div className="flex">
                              {renderStars(Math.round(store.averageRating))}
                            </div>
                            <span className="text-xs text-muted-foreground">({store.totalRatings} reviews)</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">No ratings yet</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {userRating && (
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">Your Rating:</span>
                        <Badge variant="secondary">
                          {userRating.rating} ⭐
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Rated on {new Date(userRating.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={() => handleRateStore(store.id)}
                    variant={userRating ? "outline" : "default"}
                    className="w-full"
                  >
                    <Star className="h-4 w-4 mr-2" />
                    {userRating ? "Update Rating" : "Rate Store"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {!isLoading && stores.length === 0 && (
        <Card className="shadow-soft">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No stores found</h3>
            <p className="text-muted-foreground text-center">
              Try adjusting your search terms to find the stores you're looking for.
            </p>
          </CardContent>
        </Card>
      )}

      <RatingDialog
        isOpen={showRatingDialog}
        onClose={() => {
          setShowRatingDialog(false);
          setSelectedStore(null);
        }}
        storeId={selectedStore}
        currentRating={selectedStore ? getUserRating(selectedStore)?.rating : undefined}
        onRatingSubmitted={handleRatingSubmitted}
      />
    </div>
  );
};