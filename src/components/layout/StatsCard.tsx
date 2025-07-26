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
    <Card className="card hover:shadow-xl transition-all duration-300 p-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-base font-bold text-slate-600">
          {title}
        </CardTitle>
        <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
          <Icon className="h-6 w-6 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-slate-900">
          {value}
        </div>
        {description && (
          <p className="text-base text-slate-600 mt-3 font-medium">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};