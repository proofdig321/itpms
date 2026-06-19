import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getResources } from "@/lib/services/resources";

export default async function ResourcesPage() {
  const resources = await getResources();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-semibold text-2xl tracking-tight">Resources</h1>
        <p className="text-muted-foreground text-sm">Resource assignments and utilization across projects.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-normal text-muted-foreground text-sm">Resource Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Allocation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resources.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="whitespace-nowrap">{r.name}</TableCell>
                    <TableCell className="whitespace-nowrap">{r.role}</TableCell>
                    <TableCell className="whitespace-nowrap">{r.department}</TableCell>
                    <TableCell>{r.projectCode}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={r.allocation} className="h-2 w-16" />
                        <span className="text-muted-foreground text-sm">{r.allocation}%</span>
                      </div>
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
