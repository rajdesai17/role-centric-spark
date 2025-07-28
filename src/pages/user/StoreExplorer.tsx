import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Star } from "lucide-react";
import { apiService } from "@/services/api";
import { useNotification } from "@/components/ui/notification";
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
  userRatingId?: string;
}

interface UserRating {
  id: string;
  rating: number;
  createdAt: string;
}

export const StoreExplorer: React.FC = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
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
        // Sort stores: unrated stores first, then rated stores
        const sortedStores = response.data.stores.sort((a, b) => {
          const aHasRating = a.userRating !== undefined;
          const bHasRating = b.userRating !== undefined;
          
          // If one has rating and the other doesn't, unrated comes first
          if (aHasRating !== bHasRating) {
            return aHasRating ? 1 : -1;
          }
          
          // If both have ratings or both don't have ratings, sort by name
          return a.name.localeCompare(b.name);
        });
        
        setStores(sortedStores);
      } else {
        showNotification('error', "Failed to load stores");
      }
    } catch (error) {
      showNotification('error', "Failed to load stores");
    } finally {
      setIsLoading(false);
    }
  };

  const getUserRating = (storeId: string): UserRating | undefined => {
    const store = stores.find(s => s.id === storeId);
    if (store?.userRating && store?.userRatingId) {
      return {
        id: store.userRatingId,
        rating: store.userRating,
        createdAt: store.createdAt // Using store creation date as fallback
      };
    }
    return undefined;
  };

  const handleRatingSubmitted = () => {
    // Reload stores to get updated data and re-sort
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
        <>
          {!isLoading && stores.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-navy mb-2">Available Stores</h2>
                  <p className="text-gray-600">
                    Unrated stores appear first. Click "Rate Store" to share your experience!
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {/* <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-200 rounded-full"></div>
                    <span>Unrated</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-200 rounded-full"></div>
                    <span>Rated</span>
                  </div> */}
                </div>
              </div>
            </div>
          )}

          {!isLoading && stores.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stores.map((store) => {
                const userRating = getUserRating(store.id);
                
                return (
                  <Card key={store.id} className={`shadow-soft hover:shadow-elegant transition-shadow duration-300 ${userRating ? 'border-green-200' : 'border-blue-200'}`}>
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
            ratingId={selectedStore ? getUserRating(selectedStore)?.id : undefined}
            onRatingSubmitted={handleRatingSubmitted}
          />
        </>
      )}
    </div>
  );
};