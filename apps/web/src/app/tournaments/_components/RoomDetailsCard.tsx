"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@monorepo/ui/components/card";
import { Button } from "@monorepo/ui/components/button";
import { Badge } from "@monorepo/ui/components/badge";
import { Skeleton } from "@monorepo/ui/components/skeleton";
import { Separator } from "@monorepo/ui/components/separator";
import { useMatchRoom } from "@/hooks/useMatchRoom";
import { toast } from "sonner";
import { Copy, CheckCircle, Clock, Lock, Eye, EyeOff } from "lucide-react";

type Props = {
  matchId: string;
};

export default function RoomDetailsCard({ matchId }: Props): React.JSX.Element | null {
  const { data, isLoading, isError } = useMatchRoom(matchId);
  const [showPassword, setShowPassword] = useState(false);

  if (isLoading) {
    return <Skeleton className="h-[160px] w-full rounded-xl" />;
  }

  if (isError) {
    return null;
  }

  if (!data) return null;

  if (!data.roomPublished) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex items-center justify-center size-10 rounded-full bg-muted animate-pulse">
            <Clock className="size-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">Waiting for room details...</p>
            <p className="text-xs text-muted-foreground">
              The organizer will publish room credentials before the match
              starts.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  return (
    <Card className="border-green-500/30 bg-green-500/5">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Lock className="size-4" />
            Room Credentials
          </CardTitle>
          <Badge variant="default">
            <CheckCircle className="size-3 mr-1" />
            Published
          </Badge>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="pt-4">
        <div className="flex flex-col gap-3">
          {/* Room ID */}
          <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
            <div>
              <p className="text-xs text-muted-foreground">Room ID</p>
              <p className="font-mono font-semibold">{data.roomId}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(data.roomId!, "Room ID")}
            >
              <Copy data-icon="inline-start" />
              Copy
            </Button>
          </div>

          {/* Password */}
          <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
            <div>
              <p className="text-xs text-muted-foreground">Password</p>
              <p className="font-mono font-semibold">
                {showPassword ? data.roomPassword : "••••••"}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(data.roomPassword!, "Password")}
              >
                <Copy data-icon="inline-start" />
                Copy
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
