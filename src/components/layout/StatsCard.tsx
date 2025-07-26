import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  description
}) => {
  return (
    <Card className="card hover:shadow-xl transition-all duration-300 p-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-base font-bold text-gray-600">
          {title}
        </CardTitle>
        <div className="w-12 h-12 bg-purple-pink-gradient rounded-xl flex items-center justify-center">
          <Icon className="h-6 w-6 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold bg-purple-pink-gradient bg-clip-text text-transparent">
          {value}
        </div>
        {description && (
          <p className="text-base text-gray-600 mt-3 font-medium">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};