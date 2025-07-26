import { useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/ui/FormField";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, UserPlus, CheckCircle2 } from "lucide-react";
import { validateName, validateEmail, validateAddress, validatePassword } from "@/utils/validation";
import { useNotification } from "@/components/ui/notification";

export const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    password: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

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
      const success = await signup(formData);
      if (success) {
        showNotification('success', "Account created successfully!");
        navigate("/dashboard");
      } else {
        showNotification('error', "Signup failed. Please try again.");
      }
    } catch (error) {
      showNotification('error', "Signup failed. Please try again.");
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Back to Landing Page */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-slate-600 hover:text-slate-900 transition-colors rounded-full"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>

        {/* Main Signup Card */}
        <Card className="card p-4">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center mb-3">
              <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center shadow-lg">
                <UserPlus className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-xl font-bold text-slate-900">Create Account</CardTitle>
            <CardDescription className="text-slate-600 mt-1 text-sm">
              Join as a new user to explore stores and rate them
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <FormField
                label="Full Name"
                id="name"
                value={formData.name}
                onChange={(value) => updateField('name', value)}
                placeholder="Enter your full name (20-60 characters)"
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
                placeholder="Enter your email address"
                error={errors.email}
                required
                validateOnChange={true}
                validator={validateEmail}
              />
              
              <FormField
                label="Address"
                id="address"
                value={formData.address}
                onChange={(value) => updateField('address', value)}
                placeholder="Enter your address (max 400 characters)"
                error={errors.address}
                multiline
                required
                validateOnChange={true}
                validator={validateAddress}
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

              <Button
                type="submit"
                className="w-full bg-slate-900 text-white font-semibold rounded-2xl py-2 text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="text-center pt-2">
              <p className="text-slate-600 text-xs">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-purple-600 font-bold hover:underline transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-8 text-sm text-slate-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Secure Registration</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
              <span>Privacy Protected</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-slate-700 rounded-full"></div>
              <span>Free to Join</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};