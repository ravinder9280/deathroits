"use client";

import { Card, CardContent } from "@monorepo/ui/components/card";
import { useCountdown } from "@/hooks/useCountdown";
import { Radio } from "lucide-react";
import { cn } from "@monorepo/utils/styles";

type Props = {
  startTime: Date | string;
  enabled?: boolean;
};

export default function CountdownCard({ startTime, enabled = true }: Props) {
  const { days, hours, minutes, seconds, isExpired, urgency } = useCountdown(
    startTime,
    enabled
  );

  // Tournament has started — show live indicator
  if (isExpired) {
    return (
      <Card className="border-green-500/30 bg-green-500/10">
        <CardContent className="flex items-center justify-center gap-3 p-4">
          <span className="relative flex size-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
            <span className="relative inline-flex size-3 rounded-full bg-green-500" />
          </span>
          <p className="font-semibold text-green-500">Tournament Live</p>
        </CardContent>
      </Card>
    );
  }

  const cardClassName = cn(
    "transition-colors duration-500",
    urgency === "normal" && "border-muted",
    urgency === "soon" && "border-amber-500/30 bg-amber-500/5",
    urgency === "urgent" && "border-red-500/30 bg-red-500/5"
  );

  const labelClassName = cn(
    "text-xs font-medium text-muted-foreground uppercase tracking-wider",
    urgency === "soon" && "text-amber-500",
    urgency === "urgent" && "text-red-500"
  );

  const titleClassName = cn(
    "text-sm font-medium mb-3",
    urgency === "soon" && "text-amber-500",
    urgency === "urgent" && "text-red-500"
  );

  const segments = [
    { value: days, label: "Days" },
    { value: hours, label: "Hours" },
    { value: minutes, label: "Min" },
    { value: seconds, label: "Sec" },
  ];

  // For > 24h, show simplified display
  if (days > 0) {
    return (
      <Card className={`${cardClassName} p-4`}>
        <CardContent className="flex flex-col items-center gap-2 p-0">
          <p className={titleClassName}>Tournament Starts In</p>
          <div className="grid grid-cols-4 gap-2 w-full max-w-xs">
            {segments.map((seg) => (
              <div
                key={seg.label}
                className="flex flex-col items-center rounded-lg bg-muted/50 p-2"
              >
                <span className="text-2xl font-bold font-mono tabular-nums">
                  {String(seg.value).padStart(2, "0")}
                </span>
                <span className={labelClassName}>{seg.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // < 24h — show all 4 segments with urgency styling
  return (
    <Card className={cardClassName}>
      <CardContent className="flex flex-col items-center gap-2 p-4">
        <p className={titleClassName}>
          {urgency === "urgent" ? "⚡ Starting Soon!" : "Tournament Starts In"}
        </p>
        <div className="grid grid-cols-4 gap-2 w-full max-w-xs">
          {segments.map((seg) => (
            <div
              key={seg.label}
              className={cn(
                "flex flex-col items-center rounded-lg bg-muted/50 p-2",
                urgency === "urgent" && "animate-pulse"
              )}
            >
              <span className="text-2xl font-bold font-mono tabular-nums">
                {String(seg.value).padStart(2, "0")}
              </span>
              <span className={labelClassName}>{seg.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
