"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSessionUser } from "@/lib/auth/auth-service";
import { getInitials } from "@/lib/utils";

export default function ProfilePage() {
  const user = getSessionUser();

  const displayName = user?.name ?? "Bheki Simelane";
  const displayEmail = user?.email ?? "info@unamifoundation.org";
  const displayRole = user?.roles?.join(", ") ?? "ict-admin";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-semibold text-2xl tracking-tight">Profile</h1>
        <p className="text-muted-foreground text-sm">Your account information from Microsoft Active Directory.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-normal text-muted-foreground text-sm">Account Details</CardTitle>
          <CardDescription>Managed by your organisation's Active Directory. Contact ICT to update.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-6">
            <Avatar className="h-16 w-16 rounded-lg">
              <AvatarFallback className="rounded-lg text-lg">{getInitials(displayName)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-muted-foreground text-xs">Full Name</p>
                <p className="font-medium">{displayName}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Email</p>
                <p className="font-medium">{displayEmail}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Role</p>
                <Badge variant="outline" className="capitalize">
                  {displayRole.replace("-", " ")}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-normal text-muted-foreground text-sm">Security</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            Authentication is managed through Microsoft Azure Active Directory. Password changes and multi-factor
            authentication settings are configured via your organisation's AD portal.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
