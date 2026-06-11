"use client";

import { toast } from "sonner";
import { Button } from "@monorepo/ui/components/button";
import { Spinner } from "@monorepo/ui/components/spinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@monorepo/ui/components/alert-dialog";
import { usePublishRoom } from "@/hooks/useOrganizerTournament";
import { CheckCircle, Send } from "lucide-react";

type Props = {
  matchId: string;
  isPublished: boolean;
};

export default function PublishRoomButton({ matchId, isPublished }: Props) {
  const publishRoom = usePublishRoom(matchId);

  const handlePublish = () => {
    publishRoom.mutate(undefined, {
      onSuccess: () => {
        toast.success("Room credentials published! Players can now see them.");
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.error ?? "Failed to publish room",
        );
      },
    });
  };

  if (isPublished) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-500">
        <CheckCircle className="size-4" />
        Room is live — players can see the credentials.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted-foreground">
        Publishing will make room credentials visible to all joined players.
      </p>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="default" className="self-start">
            <Send data-icon="inline-start" />
            Publish Room
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publish Room Credentials?</AlertDialogTitle>
            <AlertDialogDescription>
              All participants who have joined this tournament will be able to
              see the room ID and password. Make sure the details are correct.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePublish}
              disabled={publishRoom.isPending}
            >
              {publishRoom.isPending ? (
                <>
                  <Spinner />
                  Publishing...
                </>
              ) : (
                "Yes, Publish"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
