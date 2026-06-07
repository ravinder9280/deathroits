"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@monorepo/ui/components/table";
import { Avatar, AvatarFallback, AvatarImage } from "@monorepo/ui/components/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@monorepo/ui/components/card";
import { Skeleton } from "@monorepo/ui/components/skeleton";
import { useParticipants } from "@/hooks/useOrganizerTournament";
import { format } from "date-fns";
import { Users } from "lucide-react";

type Props = {
  tournamentId: string;
};

export default function ParticipantsTable({ tournamentId }: Props) {
  const { data, isLoading, isError } = useParticipants(tournamentId);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-destructive">
          Failed to load participants.
        </CardContent>
      </Card>
    );
  }

  const participants = data?.participants ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users data-icon="inline-start" />
          Participants ({data?.total ?? 0})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {participants.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No participants yet.
          </p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead>IGN</TableHead>
                  <TableHead>Game UID</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participants.map(
                  (
                    p: {
                      entryId: string;
                      userId: string;
                      name: string;
                      image: string | null;
                      ign: string;
                      gameUid: string;
                      joinedAt: string;
                    },
                    index: number,
                  ) => (
                    <TableRow key={p.entryId}>
                      <TableCell className="font-mono text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="size-7">
                            <AvatarImage src={p.image ?? undefined} />
                            <AvatarFallback>
                              {p.name?.charAt(0)?.toUpperCase() ?? "?"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="truncate max-w-[120px]">
                            {p.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">{p.ign}</TableCell>
                      <TableCell className="font-mono">{p.gameUid}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {format(new Date(p.joinedAt), "dd MMM, hh:mm a")}
                      </TableCell>
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
