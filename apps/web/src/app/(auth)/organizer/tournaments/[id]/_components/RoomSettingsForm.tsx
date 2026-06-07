"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@monorepo/ui/components/button";
import { Input } from "@monorepo/ui/components/input";
import { Label } from "@monorepo/ui/components/label";
import { Spinner } from "@monorepo/ui/components/spinner";
import { useUpdateRoom } from "@/hooks/useOrganizerTournament";
import { Save } from "lucide-react";

const roomSchema = z.object({
  roomId: z.string().min(1, "Room ID is required").max(50),
  roomPassword: z.string().min(1, "Password is required").max(50),
});

type RoomFormValues = z.infer<typeof roomSchema>;

type Props = {
  matchId: string;
  initialRoomId: string;
  initialPassword: string;
  isPublished: boolean;
};

export default function RoomSettingsForm({
  matchId,
  initialRoomId,
  initialPassword,
  isPublished,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      roomId: initialRoomId,
      roomPassword: initialPassword,
    },
  });

  const updateRoom = useUpdateRoom(matchId);

  const onSubmit = (values: RoomFormValues) => {
    updateRoom.mutate(values, {
      onSuccess: () => {
        toast.success("Room details saved successfully");
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.error ?? "Failed to save room details",
        );
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <h3 className="font-semibold">Room Credentials</h3>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="roomId">Room ID</Label>
        <Input
          id="roomId"
          {...register("roomId")}
          placeholder="Enter custom room ID"
        />
        {errors.roomId && (
          <p className="text-destructive text-xs">{errors.roomId.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="roomPassword">Password</Label>
        <Input
          id="roomPassword"
          {...register("roomPassword")}
          placeholder="Enter room password"
        />
        {errors.roomPassword && (
          <p className="text-destructive text-xs">
            {errors.roomPassword.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={updateRoom.isPending}
        className="self-start"
      >
        {updateRoom.isPending ? (
          <>
            <Spinner />
            Saving...
          </>
        ) : (
          <>
            <Save data-icon="inline-start" />
            {isPublished ? "Update Room Details" : "Save Room Details"}
          </>
        )}
      </Button>

      {isPublished && (
        <p className="text-xs text-muted-foreground">
          Room is already published. Updating will immediately reflect for all
          participants.
        </p>
      )}
    </form>
  );
}
