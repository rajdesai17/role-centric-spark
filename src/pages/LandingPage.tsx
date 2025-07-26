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
  Menu
} from "lucide-react";
import { useState } from "react";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Role-Based Access",
      description: "Granular permissions and user management for teams of any size."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Enterprise Security",
      description: "Bank-level security with advanced authentication and data protection."
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Lightning Fast",
      description: "Optimized performance with real-time updates and instant feedback."
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Smart Analytics",
      description: "Comprehensive insights and reporting to drive better decisions."
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation Header */}
      <nav className="sticky top-4 mx-4 mt-4 bg-white rounded-full shadow-card border border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-pink-gradient rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-xl font-bold text-navy">
                RoleApp
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <a href="#features" className="text-sm font-medium text-gray-600 hover:text-navy transition-colors rounded-full px-4 py-2">
                Features
              </a>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/login')}
                className="text-gray-600 hover:text-navy rounded-full"
              >
                Sign In
              </Button>
              <Button 
                size="sm" 
                onClick={() => navigate('/signup')}
                className="bg-purple-pink-gradient text-white font-bold rounded-full px-6 py-2 shadow-cta hover:opacity-90 transition"
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
                className="rounded-full"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-100">
              <div className="flex flex-col space-y-3 pt-4">
                <a href="#features" className="text-sm font-medium text-gray-600 hover:text-navy transition-colors px-4 py-2">
                  Features
                </a>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/login')}
                  className="text-gray-600 hover:text-navy justify-start"
                >
                  Sign In
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => navigate('/signup')}
                  className="bg-purple-pink-gradient text-white font-bold shadow-cta hover:opacity-90 transition justify-start"
                >
                  Get Started
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-8 px-4 py-2 text-sm font-normal bg-white/80 rounded-full border border-gray-200">
              ✨ Modern Role Management Platform
            </Badge>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-navy mb-8 leading-tight">
              Store Rating System
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-normal">
              Manage users, roles, and store ratings with a simple interface.
            </p>

            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-16">
              <Button 
                size="lg" 
                className="bg-purple-pink-gradient text-white font-bold rounded-full px-12 py-4 text-xl shadow-cta hover:opacity-90 transition"
                onClick={() => navigate('/signup')}
              >
                Get Started
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-12 py-4 text-xl font-bold border-2 border-navy text-navy hover:bg-navy hover:text-white rounded-full transition shadow-sm"
                onClick={() => navigate('/login')}
              >
                View Demo
              </Button>
            </div>

            {/*  */}
          </div>
        </div>

        {/* Stats Section */}
        {/* <div className="bg-white/80 backdrop-blur-sm border-t border-gray-100 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index} className="space-y-2">
                  <div className="text-4xl font-bold text-navy">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div> */}
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy mb-6">
              Everything you need to succeed
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-normal">
              Powerful features designed to streamline your workflow and boost productivity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="card hover:shadow-xl transition-all duration-300 p-8">
                <CardHeader className="text-center pb-6">
                  <div className="w-16 h-16 bg-purple-pink-gradient rounded-2xl flex items-center justify-center mx-auto mb-6">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-navy">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600 leading-relaxed text-base font-normal">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-purple-pink-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8">
            Ready to transform your team's workflow?
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-12 max-w-2xl mx-auto font-normal">
            Join thousands of organizations that trust RoleApp to manage their teams effectively.
          </p>
          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-navy font-bold rounded-full px-12 py-4 text-xl shadow-lg hover:bg-gray-50 transition"
              onClick={() => navigate('/signup')}
            >
              Start Free Trial
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-white text-white font-bold rounded-full px-12 py-4 text-xl hover:bg-white hover:text-navy transition shadow-sm"
              onClick={() => navigate('/login')}
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-pink-gradient rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">R</span>
                </div>
                <span className="text-xl font-bold text-white">RoleApp</span>
              </div>
              <p className="text-gray-300">
                Modern role management for modern teams.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-white mb-4">Product</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-white mb-4">Support</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              &copy; {new Date().getFullYear()} RoleApp. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 