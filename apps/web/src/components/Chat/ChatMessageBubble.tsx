"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@monorepo/ui/components/avatar";
import { Skeleton } from "@monorepo/ui/components/skeleton";
import { cn } from "@monorepo/utils/styles";
import { RefreshCwIcon } from "lucide-react";

import type { ChatMessageWithState } from "@/hooks/useGlobalChat";
import { formatDistanceToNow, formatDistanceToNowStrict } from "date-fns";

interface Props {
  msg: ChatMessageWithState;
  isOwn: boolean;
  onRetry: (msg: ChatMessageWithState) => void;
}



function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ChatMessageBubble({ msg, isOwn, onRetry }: Props) {
  const senderName =
    msg.user?.username ??
    msg.user?.name ??
    msg.guestName ??
    "Guest";
  const time = formatDistanceToNowStrict(new Date(msg.createdAt), {
    addSuffix: false,
  })
    .replace(" seconds", "s")
    .replace(" second", "s")
    .replace(" minutes", "m")
    .replace(" minute", "m")
    .replace(" hours", "h")
    .replace(" hour", "h")
    .replace(" days", "d")
    .replace(" day", "d")
    .replace(" months", "mo")
    .replace(" month", "mo")
    .replace(" years", "yr")
    .replace(" year", "yr");

  const avatarSrc = msg.user?.image ?? undefined;

  return (
    <div
      className={cn(
        "group relative flex items-start gap-2.5 sm:gap-3 py-2.5 sm:py-3 lg:py-3.5 px-3 sm:px-4 lg:px-5  transition hover:bg-paper-soft/20",
      )}
    >
      {/* Avatar */}
      <Avatar className="size-10 shrink-0 mt-0.5">
        {avatarSrc && <AvatarImage src={avatarSrc} alt={senderName} />}
        <AvatarFallback className="text-xs bg-primary/40 text-white text-xl">
          {getInitials(senderName)}
        </AvatarFallback>
      </Avatar>

      {/* Bubble */}
      <div
        className={cn(
          "flex flex-1 min-w-0 flex-col gap-0.5 max-w-[90%]",
        )}
      >
        {/* Name + Time */}
        <div
          className={cn(
            "flex items-center gap-1.5 w-full justify-between ",
          )}
        >

          <div className="flex  gap-4">

            <span className={cn("text-[0.82rem] sm:text-[0.9rem] lg:text-sm font-bold line-clamp-1")}>@{senderName}</span>


            {isOwn &&

              <span className="text-[10px] text-slate-400/60  font-medium font-inter">
                YOU
              </span>
            }
          </div>




          <span className="text-muted-foreground text-xs">
            {time}

          </span>
        </div>

        {/* Message text */}
        {msg.pending ? (
          <Skeleton className="h-8 w-40 " />
        ) : (
          <div className=" max-w-lg rounded-2xl">

          <p
            className={cn(
              "text-[0.88rem] sm:text-[0.95rem] lg:text-base text-white/60 leading-snug mt-0.5 break-words whitespace-pre-wrap select-none",
              msg.failed && "opacity-60 ",
            )}
            >
            {msg.message}
          </p>
            </div>
        )}

        {/* Failed / Retry */}
        {msg.failed && (
          <button
            onClick={() => onRetry(msg)}
            className="flex items-center gap-1 text-[11px] text-destructive cursor-pointer hover:underline mt-0.5"
          >
            <RefreshCwIcon className="size-3" />
            Failed — tap to retry
          </button>
        )}
      </div>
    </div>
  );
}
