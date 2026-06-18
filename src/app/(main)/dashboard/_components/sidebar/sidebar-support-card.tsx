import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SidebarSupportCard() {
  return (
    <Card size="sm" className="shadow-none group-data-[collapsible=icon]:hidden">
      <CardHeader className="px-4">
        <CardTitle className="text-sm">IT Project Management System</CardTitle>
        <CardDescription>Municipal ICT portfolio management.</CardDescription>
      </CardHeader>
    </Card>
  );
}
