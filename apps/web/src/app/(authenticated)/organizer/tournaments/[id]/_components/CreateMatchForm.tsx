"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@monorepo/ui/components/button";
import { Input } from "@monorepo/ui/components/input";
import { Label } from "@monorepo/ui/components/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@monorepo/ui/components/card";
import { Spinner } from "@monorepo/ui/components/spinner";
import { useCreateMatch } from "@/hooks/useOrganizerTournament";
import { Plus } from "lucide-react";

type Props = {
  tournamentId: string;
};

export default function CreateMatchForm({ tournamentId }: Props) {
  const [scheduledAt, setScheduledAt] = useState("");
  const createMatch = useCreateMatch(tournamentId);

  const handleCreate = () => {
    if (!scheduledAt) {
      toast.error("Please select a scheduled time");
      return;
    }

    createMatch.mutate(
      {
        roundNumber: 1,
        scheduledAt: new Date(scheduledAt).toISOString(),
      },
      {
        onSuccess: () => {
          toast.success("Match created successfully");
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.error ?? "Failed to create match",
          );
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Match</CardTitle>
        <CardDescription>
          No match exists for this tournament yet. Create one to start managing
          room credentials.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="scheduledAt">Scheduled Time</Label>
            <Input
              id="scheduledAt"
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
          </div>

          <Button
            onClick={handleCreate}
            disabled={createMatch.isPending || !scheduledAt}
            className="self-start"
          >
            {createMatch.isPending ? (
              <>
                <Spinner />
                Creating...
              </>
            ) : (
              <>
                <Plus data-icon="inline-start" />
                Create Match
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
