import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Shield, 
  Zap, 
  BarChart3, 
  ArrowRight, 
  Star,
  Menu,
  Store,
  Star as StarIcon,
  ChevronRight,
  Lock,
  Sparkles
} from "lucide-react";
import { useState, useEffect } from "react";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Override body background when component mounts
  useEffect(() => {
    document.body.style.background = 'white';
    document.body.style.backgroundImage = 'none';
    
    // Cleanup function to restore original background when component unmounts
    return () => {
      document.body.style.background = '';
      document.body.style.backgroundImage = '';
    };
  }, []);

  const features = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Role-Based Access Control",
      description: "Granular permissions and user management for teams of any size with intuitive role assignment.",
      color: "bg-slate-900"
    },
    {
      icon: <Store className="h-6 w-6" />,
      title: "Store Management",
      description: "Comprehensive store registration and management with detailed analytics and insights.",
      color: "bg-slate-900"
    },
    {
      icon: <StarIcon className="h-6 w-6" />,
      title: "Rating System",
      description: "Advanced customer rating and review system with real-time feedback and analytics.",
      color: "bg-slate-900"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure Authentication",
      description: "Simple and secure user authentication with role-based access control.",
      color: "bg-slate-900"
    }
  ];





  return (
    <div className="min-h-screen bg-white landing-page-override">
      {/* Navigation Header */}
      <nav className="sticky top-4 mx-4 mt-4 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20">
            <div className="px-6 py-4">
              <div className="flex justify-between items-center">
                {/* Logo */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">R</span>
                  </div>
                  <span className="text-2xl font-bold text-purple-700">
                    RoleApp
                  </span>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-6">
                  <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                    Features
                  </a>

                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => navigate('/login')}
                    className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  >
                    Sign In
                  </Button>
                                <Button
                size="sm"
                onClick={() => navigate('/signup')}
                className="bg-slate-900 text-white font-semibold rounded-xl px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Sign Up
              </Button>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="rounded-xl"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Mobile Menu */}
              {isMobileMenuOpen && (
                <div className="md:hidden mt-4 pt-4 border-t border-slate-200">
                  <div className="flex flex-col space-y-3">
                    <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-4 py-2">
                      Features
                    </a>

                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => navigate('/login')}
                      className="text-slate-600 hover:text-slate-900 justify-start"
                    >
                      Sign In
                    </Button>
                                        <Button
                      size="sm"
                      onClick={() => navigate('/signup')}
                      className="bg-slate-900 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 justify-start"
                    >
                      Sign Up
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
                    <Badge className="mb-8 px-4 py-2 text-sm font-medium bg-purple-700 text-white rounded-full shadow-sm">
          <Sparkles className="h-4 w-4 mr-2" />
          Modern Role Management Platform
        </Badge>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-8 leading-tight">
              Store Rating System
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed font-normal">
              A comprehensive platform for managing users, stores, and customer ratings with role-based access control.
            </p>

            <div className="flex justify-center items-center mb-16">
              <Button 
                size="lg" 
                className="bg-slate-900 text-white font-semibold rounded-2xl px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                onClick={() => navigate('/signup')}
              >
                Get Started
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </div>


          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-purple-700 mb-6">
              Features
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-6">
                  <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-slate-900 mb-4">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center pb-8">
                  <CardDescription className="text-slate-600 leading-relaxed text-lg">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>





      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-slate-900 font-bold text-lg">R</span>
              </div>
              <span className="text-2xl font-bold text-white">RoleApp</span>
            </div>
            <p className="text-slate-400 text-lg mb-6">
              Modern role management for modern teams.
            </p>
            <div className="border-t border-slate-800 pt-6">
              <p className="text-slate-400 text-sm">
                &copy; {new Date().getFullYear()} RoleApp. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 