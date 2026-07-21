"use client";

import { Badge } from "@monorepo/ui/components/badge";
import { TournamentStatus } from "@monorepo/types";
import {
  PenLine,
  UserPlus,
  Lock,
  Radio,
  Trophy,
  XCircle,
} from "lucide-react";
import type { ReactNode } from "react";

type StatusConfig = {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
  icon: ReactNode;
  className?: string;
};

export const statusConfig: Record<string, StatusConfig> = {
  [TournamentStatus.DRAFT]: {
    label: "Draft",
    variant: "outline",
    icon: <PenLine className="size-3" />,
  },
  [TournamentStatus.REGISTRATION_OPEN]: {
    label: "Registration Open",
    variant: "default",
    icon: <UserPlus className="size-3" />,
    className: "bg-green-600 hover:bg-green-700 text-white",
  },
  [TournamentStatus.REGISTRATION_CLOSED]: {
    label: "Registration Closed",
    variant: "secondary",
    icon: <Lock className="size-3" />,
    className: "bg-red-600 text-white border-red-500/30",
  },
  [TournamentStatus.ONGOING]: {
    label: "Live",
    variant: "default",
    icon: <Radio className="size-3 animate-pulse" />,
    className: "bg-blue-600 hover:bg-blue-700 text-white",
  },
  [TournamentStatus.COMPLETED]: {
    label: "Completed",
    variant: "secondary",
    icon: <Trophy className="size-3" />,
  },
  [TournamentStatus.CANCELLED]: {
    label: "Cancelled",
    variant: "destructive",
    icon: <XCircle className="size-3" />,
  },
};

type Props = {
  status: string;
};

export default function StatusBadge({ status }: Props) {
  const config = statusConfig[status as TournamentStatus] ?? {
    label: (status || "").replace(/_/g, " "),
    variant: "outline" as const,
    icon: null,
  };

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.icon}
      <span className="ml-1 font-semibold">{config.label}</span>
    </Badge>
  );
}
