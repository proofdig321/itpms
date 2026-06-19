import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAuditEntries } from "@/lib/services/system";

export default async function AuditPage() {
  const entries = await getAuditEntries();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-semibold text-2xl tracking-tight">Audit History</h1>
        <p className="text-muted-foreground text-sm">Immutable audit trail — all changes logged by the backend.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-normal text-muted-foreground text-sm">Audit Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Change</TableHead>
                  <TableHead>Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="whitespace-nowrap text-xs">
                      {new Date(entry.timestamp).toLocaleDateString("en-ZA", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{entry.user}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{entry.action}</Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {entry.entity} ({entry.entityId})
                    </TableCell>
                    <TableCell className="text-xs">
                      {entry.previousValue && entry.newValue ? (
                        <span>
                          <s className="text-muted-foreground">{entry.previousValue}</s> → {entry.newValue}
                        </span>
                      ) : entry.newValue ? (
                        entry.newValue
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate text-xs">{entry.reason ?? "—"}</TableCell>
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
