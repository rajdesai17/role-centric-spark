import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField } from "@/components/ui/FormField";
import { validateEmail, validateAddress, validateStoreName } from "@/utils/validation";
import { apiService } from "@/services/api";
import { useNotification } from "@/components/ui/notification";
import { Store } from "lucide-react";

interface StoreOwner {
  id: string;
  name: string;
  email: string;
}

interface AddStoreFormProps {
  onSuccess?: () => void;
}

export const AddStoreForm: React.FC<AddStoreFormProps> = ({ onSuccess }) => {
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [storeOwners, setStoreOwners] = useState<StoreOwner[]>([]);
  const [loadingOwners, setLoadingOwners] = useState(true);

  useEffect(() => {
    loadStoreOwners();
  }, []);

  const loadStoreOwners = async () => {
    try {
      const response = await apiService.getUsers(undefined, 'STORE_OWNER');
      if (response.data) {
        setStoreOwners(response.data.users);
      } else {
        showNotification('error', "Failed to load store owners");
      }
    } catch (error) {
      showNotification('error', "Failed to load store owners");
    } finally {
      setLoadingOwners(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const nameValidation = validateStoreName(formData.name);
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.errors.join(', ');
    }

    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.errors.join(', ');
    }

    const addressValidation = validateAddress(formData.address);
    if (!addressValidation.isValid) {
      newErrors.address = addressValidation.errors.join(', ');
    }

    if (!formData.ownerId) {
      newErrors.ownerId = "Please select a store owner";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showNotification('error', "Please fix the validation errors");
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiService.createStore({
        name: formData.name,
        email: formData.email,
        address: formData.address,
        ownerId: formData.ownerId
      });

      if (response.data) {
        showNotification('success', "Store added successfully!");
        setFormData({ name: "", email: "", address: "", ownerId: "" });
        setErrors({});
        // Call the onSuccess callback to close the modal
        onSuccess?.();
      } else {
        showNotification('error', response.error || "Failed to add store");
      }
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 409) {
        showNotification('error', "A store with this email already exists. Please use a different email address.");
      } else {
        showNotification('error', "Failed to add store. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
            <Store className="h-4 w-4 text-white" />
          </div>
          Add New Store
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-muted rounded-lg">
          <h4 className="text-sm font-medium mb-2">Requirements:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Store Name: 1-255 characters</li>
            <li>• Email: Valid email format</li>
            <li>• Address: Max 400 characters</li>
            <li>• Owner: Must select a store owner</li>
          </ul>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Store Name"
            id="storeName"
            value={formData.name}
            onChange={(value) => updateField('name', value)}
            placeholder="Enter store name"
            error={errors.name}
            required
            validateOnChange={true}
            validator={validateStoreName}
          />
          
          <FormField
            label="Email"
            id="storeEmail"
            type="email"
            value={formData.email}
            onChange={(value) => updateField('email', value)}
            placeholder="Enter store email address"
            error={errors.email}
            required
            validateOnChange={true}
            validator={validateEmail}
          />
          
          <FormField
            label="Address"
            id="storeAddress"
            value={formData.address}
            onChange={(value) => updateField('address', value)}
            placeholder="Enter store address (max 400 characters)"
            error={errors.address}
            multiline
            required
            validateOnChange={true}
            validator={validateAddress}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Store Owner <span className="text-destructive">*</span>
            </label>
            <Select 
              value={formData.ownerId} 
              onValueChange={(value) => updateField('ownerId', value)}
              disabled={loadingOwners}
            >
              <SelectTrigger className={errors.ownerId ? "border-destructive" : ""}>
                <SelectValue placeholder={loadingOwners ? "Loading owners..." : "Select store owner"} />
              </SelectTrigger>
              <SelectContent>
                {storeOwners.map((owner) => (
                  <SelectItem key={owner.id} value={owner.id}>
                    {owner.name} ({owner.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.ownerId && (
              <p className="text-sm text-destructive">{errors.ownerId}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || loadingOwners}
          >
            {isLoading ? "Adding Store..." : "Add Store"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};