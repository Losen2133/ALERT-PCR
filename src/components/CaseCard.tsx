import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { Calendar, Clock, User } from "lucide-react";
import { Badge } from "./ui/badge";

type CaseCardProps = {
    caseId: string;
    priority: "High" | "Low";
    firstName: string;
    lastName: string;
    mi: string;
    date: string;
    dispatchTime: string;
    sex: string;
    age: number;
    Icon: LucideIcon;
    iconColor?: string;
    iconTextColor?: string;
}

function CaseCard({
    caseId,
    priority,
    firstName,
    lastName,
    mi,
    date,
    dispatchTime,
    sex,
    age,
    Icon,
    iconColor = "bg-blue-100",
    iconTextColor = "text-blue-500",
}: CaseCardProps) {
    const priorityVariants: Record<CaseCardProps["priority"], "default" | "secondary" | "destructive" | "outline"> = {
        High: "destructive",
        Low: "secondary",
    };

    return (
        <Card className="w-full">
            <CardContent className="flex items-center gap-4">
                <div
                className={`flex h-14 w-14 items-center justify-center rounded-md ${iconColor}`}
                >
                    <Icon className={`h-10 w-10 ${iconTextColor}`} />
                </div>
                <div className="flex flex-col">
                    <div className="flex gap-2 mt-1">
                        <Badge variant="default" className="text-xs">
                            {caseId}
                        </Badge>
                        <Badge variant={priorityVariants[priority]} className="text-xs">
                            {priority}
                        </Badge>
                    </div>
                    <p className="font-bold text-3xl">{lastName}, {firstName} {mi}</p>
                    <div className="flex gap-2 mt-1 text-sm text-gray-600 items-center">
                        <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {date}
                        </span>
                        <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {dispatchTime}
                        </span>
                        <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {sex}/{age}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
        
    )
}

export default CaseCard;