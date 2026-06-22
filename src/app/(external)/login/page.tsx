"use client";

import { useCallback, useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { PublicClientApplication } from "@azure/msal-browser";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { exchangeAzureToken, setSession } from "@/lib/auth/auth-service";
import { loginRequest, msalConfig } from "@/lib/auth/msal-config";

const msalInstance = new PublicClientApplication(msalConfig);

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle redirect response when returning from Microsoft
  useEffect(() => {
    const handleRedirectResponse = async () => {
      try {
        await msalInstance.initialize();
        const response = await msalInstance.handleRedirectPromise();

        if (response?.accessToken) {
          setIsLoading(true);
          const authResponse = await exchangeAzureToken(response.accessToken);
          setSession(authResponse.token, authResponse.user);
          router.push("/dashboard/monitoring");
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Authentication failed. Please try again.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    void handleRedirectResponse();
  }, [router]);

  const handleLogin = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await msalInstance.initialize();
      await msalInstance.loginRedirect(loginRequest);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Authentication failed. Please try again.";
      setError(message);
      setIsLoading(false);
    }
  }, []);

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
