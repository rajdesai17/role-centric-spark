import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField } from "@/components/ui/FormField";
import { validateName, validateEmail, validateAddress, validatePassword } from "@/utils/validation";
import { apiService } from "@/services/api";
import { useNotification } from "@/components/ui/notification";
import { UserPlus } from "lucide-react";

export const AddUserForm: React.FC = () => {
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const nameValidation = validateName(formData.name);
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

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors.join(', ');
    }

    if (!formData.role) {
      newErrors.role = "Please select a role";
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
      const response = await apiService.createUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        address: formData.address,
        role: formData.role as 'SYSTEM_ADMIN' | 'NORMAL_USER' | 'STORE_OWNER'
      });

      if (response.data) {
        showNotification('success', "User added successfully!");
        setFormData({ name: "", email: "", password: "", address: "", role: "" });
        setErrors({});
      } else {
        showNotification('error', response.error || "Failed to add user");
      }
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 409) {
        showNotification('error', "A user with this email already exists. Please use a different email address.");
      } else {
        showNotification('error', "Failed to add user. Please try again.");
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
          <UserPlus className="h-5 w-5" />
          Add New User
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-muted rounded-lg">
          <h4 className="text-sm font-medium mb-2">Requirements:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Name: 20-60 characters</li>
            <li>• Email: Valid email format</li>
            <li>• Address: Max 400 characters</li>
            <li>• Password: 8-16 characters, 1 uppercase, 1 special character</li>
            <li>• Role: Must be selected</li>
          </ul>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Full Name"
            id="name"
            value={formData.name}
            onChange={(value) => updateField('name', value)}
            placeholder="Enter full name (20-60 characters)"
            error={errors.name}
            required
            validateOnChange={true}
            validator={validateName}
          />
          
          <FormField
            label="Email"
            id="email"
            type="email"
            value={formData.email}
            onChange={(value) => updateField('email', value)}
            placeholder="Enter email address"
            error={errors.email}
            required
            validateOnChange={true}
            validator={validateEmail}
          />
          
          <FormField
            label="Password"
            id="password"
            type="password"
            value={formData.password}
            onChange={(value) => updateField('password', value)}
            placeholder="8-16 chars, 1 uppercase, 1 special char"
            error={errors.password}
            required
            validateOnChange={true}
            validator={validatePassword}
          />
          
          <FormField
            label="Address"
            id="address"
            value={formData.address}
            onChange={(value) => updateField('address', value)}
            placeholder="Enter address (max 400 characters)"
            error={errors.address}
            multiline
            required
            validateOnChange={true}
            validator={validateAddress}
          />
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Role <span className="text-destructive">*</span>
            </label>
            <Select value={formData.role} onValueChange={(value) => updateField('role', value)}>
              <SelectTrigger className={errors.role ? "border-destructive" : ""}>
                <SelectValue placeholder="Select user role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NORMAL_USER">Normal User</SelectItem>
                <SelectItem value="STORE_OWNER">Store Owner</SelectItem>
                <SelectItem value="SYSTEM_ADMIN">Administrator</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-destructive">{errors.role}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Adding User..." : "Add User"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};