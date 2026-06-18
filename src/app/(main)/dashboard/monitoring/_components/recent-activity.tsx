import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RecentActivity } from "@/types/monitoring";

interface RecentActivityFeedProps {
  data: RecentActivity[];
}

export function RecentActivityFeed({ data }: RecentActivityFeedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-normal text-muted-foreground text-sm">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {data.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {activity.projectCode}
                  </Badge>
                  <span className="text-muted-foreground text-xs">
                    {new Date(activity.timestamp).toLocaleDateString("en-ZA", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-sm">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
