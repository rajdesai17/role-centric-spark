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
  CheckCircle2,
  Star,
  TrendingUp,
  Menu,
  Store,
  Star as StarIcon,
  ChevronRight,
  Play,
  Globe,
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
      title: "Enterprise Security",
      description: "Bank-level security with advanced authentication, encryption, and data protection.",
      color: "bg-slate-900"
    }
  ];

  const benefits = [
    "Real-time analytics and insights",
    "Multi-role user management",
    "Secure authentication system",
    "Responsive design for all devices",
    "24/7 customer support",
    "Easy integration and setup"
  ];

  const stats = [
    { number: "10K+", label: "Active Users", icon: <Users className="h-4 w-4" /> },
    { number: "99.9%", label: "Uptime", icon: <TrendingUp className="h-4 w-4" /> },
    { number: "24/7", label: "Support", icon: <Globe className="h-4 w-4" /> }
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
                  <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                    RoleApp
                  </span>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-6">
                  <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                    Features
                  </a>
                  <a href="#benefits" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                    Benefits
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
                    Get Started
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
                    <a href="#benefits" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-4 py-2">
                      Benefits
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
                      Get Started
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
            <Badge className="mb-8 px-4 py-2 text-sm font-medium bg-white/80 backdrop-blur-sm rounded-full border border-slate-200 shadow-sm">
              <Sparkles className="h-4 w-4 mr-2" />
              Modern Role Management Platform
            </Badge>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-8 leading-tight">
              Store Rating
              <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                System
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed font-normal">
              Streamline your business operations with our comprehensive role-based management platform. 
              Manage users, stores, and customer ratings with enterprise-grade security.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Button 
                size="lg" 
                className="bg-slate-900 text-white font-semibold rounded-2xl px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                onClick={() => navigate('/signup')}
              >
                Start Free Trial
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-4 text-lg font-semibold border-2 border-slate-300 text-slate-700 hover:bg-slate-50 rounded-2xl transition-all duration-300 shadow-sm"
                onClick={() => navigate('/login')}
              >
                <Play className="mr-3 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                  <div className="flex items-center justify-center mb-3">
                    <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-1">{stat.number}</div>
                  <div className="text-slate-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-6 px-4 py-2 text-sm font-medium bg-slate-100 text-slate-700 rounded-full">
              Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Everything you need to
              <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                scale your business
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Powerful tools designed to streamline your operations and enhance customer experience.
            </p>
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

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-6 px-4 py-2 text-sm font-medium bg-white/80 text-slate-700 rounded-full">
              Why Choose Us
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Built for modern
              <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                businesses
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Experience the difference with our cutting-edge platform designed for today's dynamic business environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-4 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle2 className="h-4 w-4 text-white" />
                </div>
                <p className="text-slate-700 font-medium">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Ready to transform your
            <span className="block">business workflow?</span>
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Join thousands of organizations that trust RoleApp to manage their teams and stores effectively.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-slate-900 font-semibold rounded-2xl px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              onClick={() => navigate('/signup')}
            >
              Start Free Trial
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-white text-white font-semibold rounded-2xl px-8 py-4 text-lg hover:bg-white hover:text-slate-900 transition-all duration-300 shadow-sm"
              onClick={() => navigate('/login')}
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-slate-900 font-bold text-lg">R</span>
                </div>
                <span className="text-2xl font-bold text-white">RoleApp</span>
              </div>
              <p className="text-slate-400 text-lg">
                Modern role management for modern teams.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-white mb-6 text-lg">Product</h3>
              <ul className="space-y-4 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-white mb-6 text-lg">Company</h3>
              <ul className="space-y-4 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-white mb-6 text-lg">Support</h3>
              <ul className="space-y-4 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              &copy; {new Date().getFullYear()} RoleApp. All rights reserved.
            </p>
            <div className="flex space-x-8 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 