"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import Link from "next/link";

import { useSession } from "@/lib/auth-client";
import { cn, GAME_KEYS, GAME_LABELS } from "@monorepo/utils";

import { Button } from "@monorepo/ui/components/button";
import { Input } from "@monorepo/ui/components/input";
import { Label } from "@monorepo/ui/components/label";
import { Textarea } from "@monorepo/ui/components/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@monorepo/ui/components/select";

import {
  ArrowLeft,
  Trophy,
  Calendar,
  Users,
  DollarSign,
  ImageIcon,
  FileText,
  Settings2,
  Loader2,
  Upload,
  X,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";

// ─── Zod Schema (mirrors server) ─────────────────────────────────────────────
const coerceNum = (schema: z.ZodNumber) =>
  z.preprocess((v) => (v === "" || v == null ? undefined : Number(v)), schema);

const createTournamentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().max(2000).optional(),
  game: z.enum(GAME_KEYS, { message: "Please select a game" }),
  entryFee: coerceNum(z.number({ message: "Must be a number" }).min(0, "Cannot be negative")),
  prizePool: coerceNum(z.number({ message: "Must be a number" }).min(0, "Cannot be negative")),
  maxPlayers: coerceNum(z.number({ message: "Must be a number" }).int().min(2, "At least 2 players required").max(10000)),
  roomSize: coerceNum(z.number({ message: "Must be a number" }).int().min(1).max(200)).default(12),
  startTime: z
    .string()
    .min(1, "Start time is required")
    .refine((v) => !isNaN(Date.parse(v)), "Invalid date/time"),
  rules: z.string().max(5000).optional(),
  status: z.enum(["DRAFT", "REGISTRATION_OPEN"]).default("DRAFT"),
});

// z.output gives us the parsed/coerced type (numbers as numbers, not unknown)
type CreateTournamentForm = z.output<typeof createTournamentSchema>;

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({
  icon: Icon,
  className,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("rounded-xl border border-white/8 bg-card/50 backdrop-blur p-6 space-y-5", className || "")}>
      <div className="flex items-center gap-2.5">
        <span className="flex items-center justify-center size-8 rounded-lg bg-primary/15 text-primary">
          <Icon className="size-4" />
        </span>
        <h2 className="font-semibold text-base">{title}</h2>
      </div>
      {children}
    </div>
  );
}

// ─── Field wrapper ────────────────────────────────────────────────────────────
function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-foreground/80">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
      {error && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function NewTournamentPage(): React.JSX.Element {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerError, setBannerError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateTournamentForm>({
    // Cast needed: z.preprocess makes input types `unknown`, but output is correctly typed.
    // z.output<> + this cast is the standard Zod v4 + hookform/resolvers workaround.
    resolver: zodResolver(createTournamentSchema) as import("react-hook-form").Resolver<CreateTournamentForm>,
    defaultValues: {
      roomSize: 12,
      status: "DRAFT",
      entryFee: 0,
    },
  });

  // ── Loading state ───────────────────────────────────────────────────────────
  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // ── Role guard ──────────────────────────────────────────────────────────────
  const role = session?.user?.role;
  if (!session || (role !== "ORGANIZER" && role !== "ADMIN")) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center px-4">
        <span className="flex items-center justify-center size-16 rounded-full bg-destructive/10">
          <ShieldAlert className="size-8 text-destructive" />
        </span>
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground max-w-sm">
          You need an <strong>Organizer</strong> account to create tournaments.
          Contact an admin to upgrade your role.
        </p>
        <Button variant="outline" asChild>
          <Link href="/organizer">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  // ── Banner image helpers ────────────────────────────────────────────────────
  function handleBannerChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setBannerPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function clearBanner() {
    setBannerFile(null);
    setBannerPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  async function onSubmit(values: CreateTournamentForm) {
    setSubmitError(null);
    setBannerError(null);

    if (!bannerFile) {
      setBannerError("Banner image is required.");
      return;
    }

    try {
      // Convert local datetime string to ISO 8601 so the server gets a valid datetime
      const startTimeISO = new Date(values.startTime).toISOString();

      const formData = new FormData();
      formData.append("title", values.title);
      if (values.description) formData.append("description", values.description);
      formData.append("game", values.game);
      formData.append("entryFee", String(values.entryFee));
      formData.append("prizePool", String(values.prizePool));
      formData.append("maxPlayers", String(values.maxPlayers));
      formData.append("roomSize", String(values.roomSize));
      formData.append("startTime", startTimeISO);
      if (values.rules) formData.append("rules", values.rules);
      formData.append("status", values.status);
      if (bannerFile) formData.append("image", bannerFile);

      const res=await axios.post(`${API}/tournament`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(res.data &&"Tournament created successfully");

      router.push("/organizer/tournaments");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setSubmitError(
          err.response?.data?.error ?? err.message ?? "Something went wrong"
        );
      } else {
        setSubmitError("Something went wrong. Please try again.");
      }
    }
  }

  const watchedStatus = watch("status");
  const watchedEntryFee = watch("entryFee");

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="  space-y-6 pb-12  ">
      {/* Header */}
      <header className=" sticky top-0 z-10 w-full bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 flex items-center gap-4  border-b p-3 md:p-6">
        
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Tournament</h1>
          <p className="text-muted-foreground text-sm">
            Fill in the details below to create a new tournament.
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-4 px-3 md:px-6 overflow-y-auto">
            {/* ── Banner Image ─────────────────────────────────────────────────── */}
        <Section  icon={ImageIcon} className="md:col-span-2" title="Banner Image">
          <div className="space-y-3">
            {bannerPreview ? (
              <div className="relative rounded-lg overflow-hidden border border-white/10 aspect-[3/1]">
                {/* plain img works for blob: URLs without domain allowlist */}
                <img
                  src={bannerPreview}
                  alt="Banner preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={clearBanner}
                  className="absolute top-2 right-2 size-7 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-destructive/80 transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`w-full rounded-lg border-2 border-dashed ${
                  bannerError ? "border-destructive/60" : "border-white/15 hover:border-primary/50"
                } bg-background/30 hover:bg-primary/5 transition-colors flex flex-col items-center justify-center py-10 gap-3 group`}
              >
                <Upload className={`size-8 transition-colors ${
                  bannerError ? "text-destructive" : "text-muted-foreground group-hover:text-primary"
                }`} />
                <div className="text-center">
                  <p className={`text-sm font-medium transition-colors ${
                    bannerError ? "text-destructive" : "group-hover:text-primary"
                  }`}>
                    Click to upload banner
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    PNG, JPG, WebP or GIF · Max 15 MB
                  </p>
                </div>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={handleBannerChange}
            />
            {bannerError && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <span>⚠</span> {bannerError}
              </p>
            )}
            {bannerFile && (
              <p className="text-xs text-muted-foreground truncate">
                📎 {bannerFile.name} ({(bannerFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>
        </Section>
        {/* ── Basic Info ──────────────────────────────────────────────────── */}
        <Section icon={Trophy} title="Basic Info">
          <Field label="Tournament Title" error={errors.title?.message} required>
            <Input
              id="tournament-title"
              placeholder="e.g. Weekend Warriors Cup"
              {...register("title")}
              className="bg-background/60"
            />
          </Field>

          <Field label="Description" error={errors.description?.message}>
            <Textarea
              id="tournament-description"
              placeholder="Describe your tournament — format, rules summary, prizes, etc."
              rows={3}
              {...register("description")}
              className="bg-background/60 resize-none"
            />
          </Field>

          <Field label="Game" error={errors.game?.message} required>
            <Controller
              control={control}
              name="game"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="tournament-game" className="bg-background/60">
                    <SelectValue placeholder="Select a game" />
                  </SelectTrigger>
                  <SelectContent>
                    {GAME_KEYS.map((g) => (
                      <SelectItem key={g} value={g}>
                        {GAME_LABELS[g]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
        </Section>

        {/* ── Schedule ────────────────────────────────────────────────────── */}
        <Section icon={Calendar} title="Schedule">
          <Field label="Start Date & Time" error={errors.startTime?.message} required>
            <Input
              id="tournament-start-time"
              type="datetime-local"
              {...register("startTime")}
              className="bg-background/60"
              min={new Date().toISOString().slice(0, 16)}
            />
          </Field>
        </Section>

        {/* ── Players ─────────────────────────────────────────────────────── */}
        <Section icon={Users} title="Players & Rooms">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Max Players"
              error={errors.maxPlayers?.message}
              required
            >
              <Input
                id="tournament-max-players"
                type="number"
                min={2}
                placeholder="e.g. 100"
                {...register("maxPlayers")}
                className="bg-background/60"
              />
            </Field>

            <Field label="Room Size" error={errors.roomSize?.message} required>
              <Input
                id="tournament-room-size"
                type="number"
                min={1}
                max={200}
                placeholder="e.g. 12"
                {...register("roomSize")}
                className="bg-background/60"
              />
            </Field>
          </div>
        </Section>

        {/* ── Financials ──────────────────────────────────────────────────── */}
        <Section icon={DollarSign} title="Financials">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Entry Fee (₹)"
              error={errors.entryFee?.message}
              required
            >
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  ₹
                </span>
                <Input
                  id="tournament-entry-fee"
                  type="number"
                  min={0}
                  step={0.01}
                  placeholder="0"
                  {...register("entryFee")}
                  className="bg-background/60 pl-7"
                />
              </div>
              {Number(watchedEntryFee) === 0 && (
                <p className="text-xs text-emerald-400 mt-1">✓ Free tournament</p>
              )}
            </Field>

            <Field
              label="Prize Pool (₹)"
              error={errors.prizePool?.message}
              required
            >
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  ₹
                </span>
                <Input
                  id="tournament-prize-pool"
                  type="number"
                  min={0}
                  step={0.01}
                  placeholder="0"
                  {...register("prizePool")}
                  className="bg-background/60 pl-7"
                />
              </div>
            </Field>
          </div>
        </Section>

    

        {/* ── Rules ───────────────────────────────────────────────────────── */}
        <Section icon={FileText} title="Rules">
          <Field label="Tournament Rules" error={errors.rules?.message}>
            <Textarea
              id="tournament-rules"
              placeholder="Enter tournament rules, code of conduct, scoring system, etc."
              rows={5}
              {...register("rules")}
              className="bg-background/60 resize-none font-mono text-sm"
            />
          </Field>
        </Section>

        {/* ── Status ──────────────────────────────────────────────────────── */}
        <Section icon={Settings2} title="Publication">
          <Field label="Initial Status" error={errors.status?.message}>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="tournament-status" className="bg-background/60">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">
                      Draft — hidden from players
                    </SelectItem>
                    <SelectItem value="REGISTRATION_OPEN">
                      Registration Open — visible & joinable
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          {watchedStatus === "REGISTRATION_OPEN" && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm">
              <span className="shrink-0 mt-0.5">⚡</span>
              <p>
                This tournament will be <strong>immediately visible</strong> to
                all players once created.
              </p>
            </div>
          )}
        </Section>

        {/* ── Submit error ─────────────────────────────────────────────────── */}
        {submitError && (
          <div className="flex items-start gap-2 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            <span className="shrink-0 mt-0.5">✕</span>
            <p>{submitError}</p>
          </div>
        )}

        {/* ── Actions ─────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-end gap-3 pt-2 col-span-2">
          <Button type="button" variant="outline" asChild disabled={isSubmitting}>
            <Link href="/organizer/tournaments">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting} className="min-w-32">
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                Creating…
              </>
            ) : (
              "Create Tournament"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}