"use client";

import type { TournamentUserState } from "@monorepo/types";
import { Button } from "@monorepo/ui/components/button";
import { Card, CardContent } from "@monorepo/ui/components/card";
import {
  ArrowRight,
  Lock,
  LogIn,
  Users,
  XCircle,
  Trophy,
  Radio,
  CheckCircle,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import JoinTournamentModal from "./JoinTournamentModal";
import RoomDetailsCard from "./RoomDetailsCard";

type CardConfig = {
  layout: "centered" | "row";
  cardClass: string;
  iconContainerClass: string;
  iconClass: string;
  icon: LucideIcon;
  title: string;
  titleClass: string;
  description: string;
};

const STATUS_CARDS = {
  CANCELLED: {
    layout: "centered",
    cardClass: "border-red-500/30 bg-red-500/5",
    iconContainerClass: "bg-red-500/15 size-12",
    iconClass: "size-6 text-red-500",
    icon: XCircle,
    title: "Tournament Cancelled",
    titleClass: "text-red-500 text-lg",
    description: "This tournament has been cancelled by the organizer. If you were registered, any applicable refunds will be processed.",
  },
  COMPLETED: {
    layout: "centered",
    cardClass: "border-muted",
    iconContainerClass: "bg-muted size-12",
    iconClass: "size-6 text-muted-foreground",
    icon: Trophy,
    title: "Tournament Completed",
    titleClass: "text-lg",
    description: "This tournament has ended. Results will be available soon.",
  },
  ONGOING: {
    layout: "row",
    cardClass: "border-blue-500/30 bg-blue-500/5",
    iconContainerClass: "bg-blue-500/15 size-10",
    iconClass: "size-5 text-blue-500 animate-pulse",
    icon: Radio,
    title: "Tournament In Progress",
    titleClass: "text-blue-500",
    description: "This tournament is currently underway",
  },
  REGISTRATION_OPEN_REGISTERED: {
    layout: "row",
    cardClass: "border-green-500/30 bg-green-500/5",
    iconContainerClass: "bg-green-500/15 size-10",
    iconClass: "size-5 text-green-500",
    icon: CheckCircle,
    title: "✓ Registered",
    titleClass: "text-green-500",
    description: "You are registered for this tournament room id and password will be available 15 min before the tournament starts",
  },
  REGISTRATION_OPEN_FULL: {
    layout: "row",
    cardClass: "border-muted",
    iconContainerClass: "bg-muted size-10",
    iconClass: "size-5 text-muted-foreground",
    icon: Users,
    title: "Tournament Full",
    titleClass: "",
    description: "All slots have been filled",
  },
  REGISTRATION_CLOSED_REGISTERED: {
    layout: "row",
    cardClass: "border-amber-500/30 bg-amber-500/5",
    iconContainerClass: "bg-amber-500/15 size-10",
    iconClass: "size-5 text-amber-500",
    icon: Lock,
    title: "✓ Registered",
    titleClass: "text-amber-500",
    description: "You are registered for this tournament room id and password will be available 15 min before the tournament starts",
  }
} satisfies Record<string, CardConfig>;

function StatusCard({ config }: { config: CardConfig }) {
  const Icon = config.icon;
  const isCentered = config.layout === "centered";

  return (
    <Card className={`${config.cardClass} p-2`} >
      <CardContent
        className={
          isCentered
            ? "flex flex-col items-center gap-3  text-center p-4"
            : "flex items-center gap-3 p-4"
        }
      >
        <div className={`flex items-center justify-center rounded-full ${config.iconContainerClass}`}>
          <Icon className={config.iconClass} />
        </div>
        <div className="flex-1">
          <p className={`font-semibold ${config.titleClass}`}>{config.title}</p>
          <p
            className={
              isCentered
                ? "text-sm text-muted-foreground"
                : "text-xs text-muted-foreground"
            }
          >
            {config.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

type Props = {
  tournamentId: string;
  status: string;
  entryFee: number;
  activeMatchId: string | null;
  userState: TournamentUserState | null;
};

export default function ActionPanel({
  tournamentId,
  status,
  entryFee,
  activeMatchId,
  userState,
}: Props) {
  // ─── DRAFT ─────────────────────────────────────────────────────
  if (status === "DRAFT") {
    return null;
  }

  // ─── CANCELLED ─────────────────────────────────────────────────
  if (status === "CANCELLED") {
    return <StatusCard config={STATUS_CARDS.CANCELLED} />;
  }

  // ─── COMPLETED ─────────────────────────────────────────────────
  if (status === "COMPLETED") {
    return <StatusCard config={STATUS_CARDS.COMPLETED} />;
  }

  // ─── ONGOING ───────────────────────────────────────────────────
  if (status === "ONGOING") {
    if (userState?.isRegistered && activeMatchId) {
      return <RoomDetailsCard matchId={activeMatchId} />;
    }
  }

  // ─── REGISTRATION_OPEN ────────────────────────────────────────
  if (status === "REGISTRATION_OPEN") {
    // Not logged in
    if (!userState || !userState.isAuthenticated) {
      return (
        <div className="fixed bottom-0 left-0 right-0 z-30 flex justify-center">
          <div className="w-full max-w-xl">
            <Button
              className="rounded-none w-full font-semibold"
              size="xl"
              asChild
            >
              <Link href={`/sign-in?redirect=${encodeURIComponent(`/tournaments/${tournamentId}`)}`}>
                <LogIn className="size-4" />
                Sign In To Join
              </Link>
            </Button>
          </div>
        </div>
      );
    }

    if (userState.isRegistered) {
      return <StatusCard config={STATUS_CARDS.REGISTRATION_OPEN_REGISTERED} />;
    }

    // Can join
    if (userState.canJoin) {
      return (
        <div className="fixed bottom-0 left-0 right-0 z-30 flex justify-center">
          <div className="w-full max-w-xl">
            <JoinTournamentModal tournamentId={tournamentId}>
              <Button
                className="rounded-none w-full font-semibold"
                size="xl"
              >
                {entryFee > 0 ? "Join Now" : "Join for Free"}
                <ArrowRight />
              </Button>
            </JoinTournamentModal>
          </div>
        </div>
      );
    }

    return <StatusCard config={STATUS_CARDS.REGISTRATION_OPEN_FULL} />;
  }

  if (status === "REGISTRATION_CLOSED") {
    if (userState?.isRegistered) {
      return (
        <div className="space-y-3">
          <StatusCard config={STATUS_CARDS.REGISTRATION_CLOSED_REGISTERED} />
          <Button
            className="rounded-none w-full font-semibold"
            size="xl"
            asChild
          >
            <Link href={`/my-tournaments`}>
              View Registrations
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      );
    }

  }

  return null;
}

