import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const calendars = [
  {
    id: "cal1",
    name: "Municipal Calendar",
    type: "Municipal",
    workingDays: "Mon–Fri",
    hours: "07:30–16:30",
    holidays: 12,
  },
  {
    id: "cal2",
    name: "ICT Department Calendar",
    type: "Department",
    workingDays: "Mon–Fri",
    hours: "08:00–17:00",
    holidays: 12,
  },
  {
    id: "cal3",
    name: "ITPMS-001 Project Calendar",
    type: "Project",
    workingDays: "Mon–Sat",
    hours: "07:00–18:00",
    holidays: 8,
  },
];

const shutdownPeriods = [
  { period: "December Shutdown", start: "2025-12-15", end: "2026-01-05" },
  { period: "Easter Break", start: "2025-04-18", end: "2025-04-21" },
];

const typeConfig: Record<string, string> = {
  Municipal: "border-green-300 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-950 dark:text-green-300",
  Department: "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-300",
  Project: "border-gray-300 bg-gray-50 text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300",
};

export default function CalendarsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-semibold text-2xl tracking-tight">Calendars</h1>
        <p className="text-muted-foreground text-sm">Project calendars, working days, and shutdown periods.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-normal text-muted-foreground text-sm">Active Calendars</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Calendar</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Working Days</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Public Holidays</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calendars.map((cal) => (
                  <TableRow key={cal.id}>
                    <TableCell className="whitespace-nowrap">{cal.name}</TableCell>
                    <TableCell>
                      <Badge className={typeConfig[cal.type]}>{cal.type}</Badge>
                    </TableCell>
                    <TableCell>{cal.workingDays}</TableCell>
                    <TableCell>{cal.hours}</TableCell>
                    <TableCell className="tabular-nums">{cal.holidays}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-normal text-muted-foreground text-sm">Shutdown Periods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead>Start</TableHead>
                  <TableHead>End</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shutdownPeriods.map((sp) => (
                  <TableRow key={sp.period}>
                    <TableCell>{sp.period}</TableCell>
                    <TableCell>
                      {new Date(sp.start).toLocaleDateString("en-ZA", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      {new Date(sp.end).toLocaleDateString("en-ZA", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
