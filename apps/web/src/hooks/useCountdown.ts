import { useState, useEffect, useRef } from "react";
import {
  differenceInSeconds,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
} from "date-fns";

export type CountdownUrgency = "normal" | "soon" | "urgent" | "live";

export type CountdownResult = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isExpired: boolean;
  urgency: CountdownUrgency;
};

function computeUrgency(totalSeconds: number): CountdownUrgency {
  if (totalSeconds <= 0) return "live";
  if (totalSeconds < 3600) return "urgent"; // < 1 hour
  if (totalSeconds < 86400) return "soon"; // < 24 hours
  return "normal";
}

function computeCountdown(targetDate: Date): CountdownResult {
  const now = new Date();
  const totalSeconds = differenceInSeconds(targetDate, now);

  if (totalSeconds <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      isExpired: true,
      urgency: "live",
    };
  }

  const days = differenceInDays(targetDate, now);
  const hours = differenceInHours(targetDate, now) % 24;
  const minutes = differenceInMinutes(targetDate, now) % 60;
  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    totalSeconds,
    isExpired: false,
    urgency: computeUrgency(totalSeconds),
  };
}

/**
 * Real-time countdown hook.
 * Updates every second until the target date is reached.
 *
 * @param targetDate - The date/time to count down to (ISO string or Date)
 * @param enabled - Whether the countdown should be active (default: true)
 */
export function useCountdown(
  targetDate: Date | string | null,
  enabled = true
): CountdownResult {
  const target = targetDate ? new Date(targetDate) : null;
  const [countdown, setCountdown] = useState<CountdownResult>(() =>
    target ? computeCountdown(target) : {
      days: 0, hours: 0, minutes: 0, seconds: 0,
      totalSeconds: 0, isExpired: true, urgency: "live" as const,
    }
  );

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!target || !enabled) return;

    // Compute immediately
    setCountdown(computeCountdown(target));

    intervalRef.current = setInterval(() => {
      const next = computeCountdown(target);
      setCountdown(next);

      // Stop ticking once expired
      if (next.isExpired && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [target?.getTime(), enabled]);

  return countdown;
}
