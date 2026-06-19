import { FileSpreadsheet, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const reports = [
  { title: "Portfolio Report", description: "Overview of all projects, status, and progress." },
  { title: "Project Status Report", description: "Detailed status for each active project." },
  { title: "Budget Report", description: "Budget allocation, expenditure, and variance." },
  { title: "Risk Report", description: "Active risks, probability, impact, and mitigation." },
  { title: "Procurement Report", description: "SCM stages, vendors, and delivery tracking." },
  { title: "Resource Utilization Report", description: "Staff allocation and availability." },
  { title: "WBS Report", description: "Work breakdown structure and completion status." },
  { title: "Milestone Report", description: "Milestone due dates and achievement status." },
  { title: "Critical Path Report", description: "Critical tasks, float, and project duration." },
  { title: "Baseline Comparison Report", description: "Current plan vs approved baseline." },
];

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-semibold text-2xl tracking-tight">Reports</h1>
        <p className="text-muted-foreground text-sm">
          Generate and export project reports. Exports are processed by the backend.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {reports.map((report) => (
          <Card key={report.title}>
            <CardHeader>
              <CardTitle className="text-sm">{report.title}</CardTitle>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  <FileText className="h-3.5 w-3.5" />
                  PDF
                </Button>
                <Button variant="outline" size="sm" disabled>
                  <FileSpreadsheet className="h-3.5 w-3.5" />
                  Excel
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
