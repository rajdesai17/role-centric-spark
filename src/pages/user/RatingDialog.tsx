import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { apiService } from "@/services/api";
import { useAuth } from "@/components/auth/AuthContext";
import { useNotification } from "@/components/ui/notification";

interface RatingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  storeId: string | null;
  currentRating?: number;
  onRatingSubmitted?: () => void;
}

interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export const RatingDialog: React.FC<RatingDialogProps> = ({
  isOpen,
  onClose,
  storeId,
  currentRating,
  onRatingSubmitted
}) => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [rating, setRating] = useState(currentRating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [store, setStore] = useState<Store | null>(null);

  useEffect(() => {
    if (storeId && isOpen) {
      loadStoreDetails();
    }
  }, [storeId, isOpen]);

  const loadStoreDetails = async () => {
    if (!storeId) return;
    try {
      const response = await apiService.getUserStores();
      if (response.data) {
        const foundStore = response.data.stores.find(s => s.id === storeId);
        setStore(foundStore || null);
      }
    } catch (error) {
      console.error('Failed to load store details:', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setRating(currentRating || 0);
      setHoveredRating(0);
    }
  }, [isOpen, currentRating]);

  const handleSubmit = async () => {
    if (!storeId || !user || rating === 0) {
      showNotification('error', "Please select a rating");
      return;
    }

    setIsLoading(true);

    try {
      if (currentRating) {
        // This would be for updating an existing rating
        // For now, we'll create a new rating since the API doesn't have update endpoint
        const response = await apiService.createRating({
          storeId,
          rating
        });
        
        if (response.data) {
          showNotification('success', "Rating updated successfully!");
        } else {
          showNotification('error', response.error || "Failed to update rating");
        }
      } else {
        // Create new rating
        const response = await apiService.createRating({
          storeId,
          rating
        });
        
        if (response.data) {
          showNotification('success', "Rating submitted successfully!");
        } else {
          showNotification('error', response.error || "Failed to submit rating");
        }
      }

      onRatingSubmitted?.();
      onClose();
    } catch (error) {
      showNotification('error', "Failed to submit rating");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      const isActive = starValue <= (hoveredRating || rating);
      
      return (
        <button
          key={i}
          type="button"
          onClick={() => setRating(starValue)}
          onMouseEnter={() => setHoveredRating(starValue)}
          onMouseLeave={() => setHoveredRating(0)}
          className="p-1 transition-colors duration-200"
        >
          <Star
            className={`h-8 w-8 ${
              isActive ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-200'
            }`}
          />
        </button>
      );
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {currentRating ? "Update Rating" : "Rate Store"}
          </DialogTitle>
        </DialogHeader>
        
        {store && (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-lg">{store.name}</h3>
              <p className="text-sm text-muted-foreground">{store.address}</p>
            </div>

            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                How would you rate your experience?
              </p>
              
              <div className="flex justify-center gap-1">
                {renderStars()}
              </div>
              
              {(hoveredRating || rating) > 0 && (
                <p className="text-sm font-medium">
                  {hoveredRating || rating} out of 5 stars
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1"
                disabled={rating === 0 || isLoading}
              >
                {isLoading ? "Submitting..." : currentRating ? "Update" : "Submit"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};