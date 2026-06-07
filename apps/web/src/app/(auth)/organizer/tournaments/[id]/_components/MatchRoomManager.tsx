"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@monorepo/ui/components/card";
import { Badge } from "@monorepo/ui/components/badge";
import { Separator } from "@monorepo/ui/components/separator";
import RoomSettingsForm from "./RoomSettingsForm";
import PublishRoomButton from "./PublishRoomButton";
import { format } from "date-fns";
import { Clock, Radio } from "lucide-react";

type MatchData = {
  id: string;
  roundNumber: number;
  scheduledAt: string;
  status: string;
  roomId: string | null;
  roomPassword: string | null;
  credentialsVisibleAt: string | null;
};

type Props = {
  match: MatchData;
};

function getRoomStatus(match: MatchData) {
  if (match.credentialsVisibleAt) return "published";
  if (match.roomId && match.roomPassword) return "saved";
  return "draft";
}

const statusConfig = {
  draft: { label: "Draft", variant: "outline" as const },
  saved: { label: "Saved", variant: "secondary" as const },
  published: { label: "Published", variant: "default" as const },
};

export default function MatchRoomManager({ match }: Props) {
  const roomStatus = getRoomStatus(match);
  const config = statusConfig[roomStatus];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Radio data-icon="inline-start" />
            Round {match.roundNumber}
          </CardTitle>
          <Badge variant={config.variant}>
            Room: {config.label}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="size-4" />
          Scheduled: {format(new Date(match.scheduledAt), "dd MMM yyyy, hh:mm a")}
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="pt-6">
        <div className="flex flex-col gap-6">
          <RoomSettingsForm
            matchId={match.id}
            initialRoomId={match.roomId ?? ""}
            initialPassword={match.roomPassword ?? ""}
            isPublished={roomStatus === "published"}
          />

          {roomStatus !== "draft" && (
            <>
              <Separator />
              <PublishRoomButton
                matchId={match.id}
                isPublished={roomStatus === "published"}
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
