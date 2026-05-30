import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "../lib/auth-client";

export function useOnboarding() {
  const router = useRouter();
  const [gameId, setGameId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    const trimmed = gameId.trim();
    if (trimmed.length < 3) {
      setError("Game ID must be at least 3 characters");
      return;
    }
    if (trimmed.length > 20) {
      setError("Game ID must be 20 characters or fewer");
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_ORIGIN}/api/onboarding/complete`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId: trimmed }),
      },
    );

    const data = (await res.json()) as { error?: string };

    if (!res.ok) {
      setError(data.error ?? "Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    await authClient.getSession();

    await fetch("/api/onboarding/set-cookie", {
      method: "POST",
      credentials: "include",
    });

    router.push("/");
  }

  return { gameId, setGameId, error, loading, submit };
}
