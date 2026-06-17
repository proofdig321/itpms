"use client";

import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ErrorBoundary({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border py-16 text-center">
      <AlertCircle className="mb-3 h-10 w-10 text-destructive" />
      <h3 className="font-medium text-sm">Something went wrong</h3>
      <p className="mt-1 text-muted-foreground text-sm">Unable to load milestones. Please try again.</p>
      <Button variant="outline" size="sm" className="mt-4" onClick={reset}>
        Retry
      </Button>
    </div>
  );
}
