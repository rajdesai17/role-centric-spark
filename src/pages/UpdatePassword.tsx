import { useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/ui/FormField";
import { validatePassword } from "@/utils/validation";
import { useNotification } from "@/components/ui/notification";
import { Navbar } from "@/components/layout/Navbar";

export const UpdatePassword: React.FC = () => {
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { user, updatePassword } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (passwords.current !== user?.password) {
      newErrors.current = "Current password is incorrect";
    }

    const passwordValidation = validatePassword(passwords.new);
    if (!passwordValidation.isValid) {
      newErrors.new = passwordValidation.errors[0];
    }

    if (passwords.new !== passwords.confirm) {
      newErrors.confirm = "Passwords do not match";
    }

    if (passwords.new === passwords.current) {
      newErrors.new = "New password must be different from current password";
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
      const success = await updatePassword(passwords.new);
      if (success) {
        showNotification('success', "Password updated successfully!");
        navigate("/dashboard");
      } else {
        showNotification('error', "Failed to update password");
      }
    } catch (error) {
      showNotification('error', "Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: keyof typeof passwords, value: string) => {
    setPasswords(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navbar />
      <div className="flex items-center justify-center p-4 pt-8">
        <Card className="w-full max-w-md shadow-elegant">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Update Password</CardTitle>
            <CardDescription>
              Change your account password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField
                label="Current Password"
                id="current"
                type="password"
                value={passwords.current}
                onChange={(value) => updateField('current', value)}
                placeholder="Enter your current password"
                error={errors.current}
                required
              />
              
              <FormField
                label="New Password"
                id="new"
                type="password"
                value={passwords.new}
                onChange={(value) => updateField('new', value)}
                placeholder="8-16 chars, 1 uppercase, 1 special char"
                error={errors.new}
                required
              />
              
              <FormField
                label="Confirm New Password"
                id="confirm"
                type="password"
                value={passwords.confirm}
                onChange={(value) => updateField('confirm', value)}
                placeholder="Confirm your new password"
                error={errors.confirm}
                required
              />

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate("/dashboard")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};