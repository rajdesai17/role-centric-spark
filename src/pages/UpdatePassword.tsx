import { useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/ui/FormField";
import { validatePassword } from "@/utils/validation";
import { useNotification } from "@/components/ui/notification";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Lock } from "lucide-react";

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
    <DashboardLayout
      title="Update Password"
      subtitle="Change your account password"
      icon={Lock}
    >
      <div className="max-w-md mx-auto">
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl">
              <h4 className="text-sm font-medium text-purple-800 mb-2">Password Requirements:</h4>
              <ul className="text-xs text-purple-700 space-y-1">
                <li>• 8-16 characters long</li>
                <li>• At least 1 uppercase letter</li>
                <li>• At least 1 special character</li>
                <li>• Must be different from current password</li>
              </ul>
            </div>
            
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
                placeholder="Enter your new password"
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

              <div className="flex gap-3 pt-4">
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
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};