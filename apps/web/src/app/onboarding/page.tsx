"use client";
import { authClient } from "@/lib/auth-client";
import type { OnboardingUserFields } from "@/lib/auth-types";
import { useOnboarding } from "@/lib/hooks/useOnboarding";
import { Button } from "@monorepo/ui/components/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@monorepo/ui/components/card";
import { Input } from "@monorepo/ui/components/input";
import { Label } from "@monorepo/ui/components/label";
import { Spinner } from "@monorepo/ui/components/spinner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const { gameId, setGameId, error, loading, submit } = useOnboarding();
  const user = session?.user as OnboardingUserFields | undefined;

  useEffect(() => {
    if (isPending || !user?.onboarded) return;
    void fetch("/api/onboarding/set-cookie", {
      method: "POST",
      credentials: "include",
    }).then(() => router.replace("/"));
  }, [isPending, user?.onboarded, router]);

  // Block render until session is resolved
  if (isPending||user?.onboarded) {
    return
    <main className="bg-custom-dark min-h-screen flex items-center justify-center px-2">
      <Spinner/>

    </main>;
  }


  return (
    <main className="bg-custom-dark min-h-screen flex items-center justify-center px-2">
      <Card className="w-xl w-full max-w-xl">
        <CardHeader>
          <CardTitle>Enter your Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Game Name</Label>
            <Input
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              placeholder="Enter Your Game Name"
              minLength={3}
              maxLength={20}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Game ID</Label>
            <Input
              value={gameId} // ⚠️ fix: this should be a separate state if Game Name ≠ Game ID
              onChange={(e) => setGameId(e.target.value)}
              placeholder="Enter Your Game ID"
              minLength={3}
              maxLength={20}
              className="mt-1"
            />
          </div>
          {error && <p role="alert">{error}</p>}
        </CardContent>
        <CardFooter>
          <Button
            size="xl"
            onClick={submit}
            disabled={loading || gameId.trim().length < 3}
            
          >
            {loading && <Spinner/>}
            {loading ? "Saving…" : "Continue"}
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}