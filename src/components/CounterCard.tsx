import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

type CounterCardProps = {
  title: string;
  count?: number;
  Icon: LucideIcon;
  iconColor?: string;
  iconTextColor?: string;
};

function CounterCard({
  title,
  count,
  Icon,
  iconColor = "bg-blue-100",
  iconTextColor = "text-blue-500",
}: CounterCardProps) {
  return (
    <Card className="p-4">
      <CardContent className="flex items-center justify-between">
        {/* Left: Title + Count */}
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          {count !== undefined && (
            <p className="text-3xl font-bold">{count}</p>
          )}
        </div>

        {/* Right: Icon */}
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-md ${iconColor}`}
        >
          <Icon className={`h-6 w-6 ${iconTextColor}`} />
        </div>
      </CardContent>
    </Card>
  );
}

export default CounterCard;
