import { useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/ui/FormField";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, UserPlus, CheckCircle2 } from "lucide-react";
import { validateName, validateEmail, validateAddress, validatePassword } from "@/utils/validation";
import { toast } from "sonner";

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
      toast.error("Please fix the validation errors");
      return;
    }

    setIsLoading(true);

    try {
      const success = await signup(formData);
      if (success) {
        toast.success("Account created successfully!");
        navigate("/dashboard");
      } else {
        toast.error("Signup failed. Please try again.");
      }
    } catch (error) {
      toast.error("Signup failed. Please try again.");
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Landing Page */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>

        {/* Main Signup Card */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-md">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <UserPlus className="h-6 w-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Create Account</CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Join as a new user to explore stores and rate them
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Requirements Section */}
            {/* <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-2 text-blue-600" />
                Account Requirements
              </h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Name: 20-60 characters</li>
                <li>• Email: Valid email format</li>
                <li>• Address: Max 400 characters</li>
                <li>• Password: 8-16 characters, 1 uppercase, 1 special character</li>
              </ul>
            </div> */}
            
            <form onSubmit={handleSubmit} className="space-y-4">
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
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link 
                  to="/login" 
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Secure Registration</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Privacy Protected</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Free to Join</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};