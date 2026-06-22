"use client";

import { useCallback, useState } from "react";

import { useRouter } from "next/navigation";

import { PublicClientApplication } from "@azure/msal-browser";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { exchangeAzureToken, setSession } from "@/lib/auth/auth-service";
import { loginRequest, msalConfig } from "@/lib/auth/msal-config";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const msalInstance = new PublicClientApplication(msalConfig);
      await msalInstance.initialize();

      const response = await msalInstance.loginPopup(loginRequest);

      if (!response.accessToken) {
        throw new Error("No access token received from Microsoft");
      }

      // Exchange Azure token with Laravel backend
      const authResponse = await exchangeAzureToken(response.accessToken);

      // Store session
      setSession(authResponse.token, authResponse.user);

      // Redirect to dashboard
      router.push("/dashboard/monitoring");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Authentication failed. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">ITPMS</CardTitle>
          <CardDescription>IT Project Management System</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button onClick={handleLogin} disabled={isLoading} className="w-full">
            {isLoading ? "Signing in..." : "Login with Microsoft"}
          </Button>
          {error && <p className="text-center text-destructive text-sm">{error}</p>}
          <p className="text-center text-muted-foreground text-xs">
            Sign in with your municipal Active Directory account.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
