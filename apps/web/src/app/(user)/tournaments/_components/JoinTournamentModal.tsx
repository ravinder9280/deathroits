"use client";

import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@monorepo/ui/components/dialog";

import { Button } from "@monorepo/ui/components/button";
import { Input } from "@monorepo/ui/components/input";
import { Label } from "@monorepo/ui/components/label";
import { Spinner } from "@monorepo/ui/components/spinner";

import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export const joinTournamentSchema = z.object({
  ign: z
    .string()
    .min(3, "IGN must be at least 3 characters"),

  gameUid: z
    .string()
    .min(3, "Game UID is required"),

  upiId: z
    .string()
    .min(3, "UPI ID is required"),
});

export type JoinTournamentInput =
  z.infer<typeof joinTournamentSchema>;

type Props = {
  children: React.ReactNode;
  tournamentId: string;
};

export default function JoinTournamentModal({
  children,
  tournamentId,
}: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<JoinTournamentInput>({
    resolver: zodResolver(joinTournamentSchema),
    defaultValues: {
      ign: "",
      gameUid: "",
      upiId: "",
    },
  });

  const joinMutation = useMutation({
    mutationFn: async (values: JoinTournamentInput) => {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/tournament/${tournamentId}/join`,
        values,
        {
          withCredentials: true,
        }
      );

      return data;
    },

    onSuccess: () => {
      toast.success("Tournament joined successfully");

      queryClient.invalidateQueries({
        queryKey: ["tournaments", tournamentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["tournament-entry", tournamentId],
      });

      reset();
      setOpen(false);
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ??
          "Failed to join tournament"
      );
    },
  });
  const onSubmit = async (
    values: JoinTournamentInput
  ) => {
    try {
      const session = await authClient.getSession();
  
      if (!session.data?.user) {
       
  
        router.push("/sign-in");
        return;
      }
  
      joinMutation.mutate(values);
    } catch (error) {
      toast.error("Authentication check failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">
            Join Tournament
          </DialogTitle>

          <DialogDescription className="text-center">
            Enter your tournament details
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div>
            <Label>IGN*</Label>

            <Input
              {...register("ign")}
              placeholder="Enter Your In Game Name"
            />

            {errors.ign && (
              <p className="text-red-500 text-xs mt-1">
                {errors.ign.message}
              </p>
            )}
          </div>

          <div>
            <Label>Game UID*</Label>

            <Input
              {...register("gameUid")}
              placeholder="Enter Your Game UID"
            />

            {errors.gameUid && (
              <p className="text-red-500 text-xs mt-1">
                {errors.gameUid.message}
              </p>
            )}
          </div>

          <div>
            <Label>UPI ID*</Label>

            <Input
              {...register("upiId")}
              placeholder="Enter Your UPI ID"
            />

            {errors.upiId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.upiId.message}
              </p>
            )}
          </div>

          {joinMutation.isError && (
            <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-500">
              Failed to join tournament.
            </div>
          )}

          <DialogFooter>
            <Button
              type="submit"
              size="xl"
              className="w-full"
              disabled={
                joinMutation.isPending ||
                isSubmitting
              }
            >
              {joinMutation.isPending ? (
                <>
                  <Spinner />
                  Joining...
                </>
              ) : (
                "Join Tournament"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}