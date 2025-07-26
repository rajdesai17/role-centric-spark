import { Navbar } from "@/components/layout/Navbar";
import { StoreExplorer } from "./StoreExplorer";
import { Store, Search, Star } from "lucide-react";

export const UserDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-purple-pink-gradient rounded-xl flex items-center justify-center">
              <Store className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-navy">Store Explorer</h1>
              <p className="text-gray-600">Discover stores and share your experiences through ratings</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Store className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600">Available Stores</div>
              <div className="text-lg font-bold text-navy">Explore & Rate</div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Search className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600">Your Reviews</div>
              <div className="text-lg font-bold text-navy">Share Feedback</div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center space-x-3">
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="h-4 w-4 text-yellow-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600">Rating System</div>
              <div className="text-lg font-bold text-navy">1-5 Stars</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <StoreExplorer />
        </div>
      </div>
    </div>
  );
};