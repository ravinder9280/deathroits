'use client';

import { useSession } from '@/lib/auth-client';
import { Button } from '@monorepo/ui/components/button';
import { Input } from '@monorepo/ui/components/input';
import { Textarea } from '@monorepo/ui/components/textarea';
import { Badge } from '@monorepo/ui/components/badge';
import { Separator } from '@monorepo/ui/components/separator';
import {
    Trophy,
    Users,
    Calendar,
    Globe,
    ArrowLeft,
    SendHorizonal,
    Clock,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const GAME_OPTIONS = [
    'BGMI / PUBG Mobile',
    'Valorant',
    'Free Fire',
    'COD Mobile',
    'Clash Royale',
    'eFootball / FIFA',
    'Other',
];

const EXPERIENCE_OPTIONS = [
    "I'm new — this will be my first event",
    '1–3 events',
    '4–10 events',
    '10+ events',
];

export default function OrganizerApplyPage() {
    const { data: session } = useSession();

    const [selectedGames, setSelectedGames] = useState<string[]>([]);
    const [experience, setExperience] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const toggleGame = (game: string) => {
        setSelectedGames((prev) =>
            prev.includes(game) ? prev.filter((g) => g !== game) : [...prev, game]
        );
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        // TODO: wire up to real API endpoint
        await new Promise((r) => setTimeout(r, 1200));
        setSubmitting(false);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 pt-16">
                <div className="max-w-md w-full text-center flex flex-col items-center gap-6">
                    {/* Success icon */}
                    <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/30">
                        <Trophy className="size-9 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold mb-2">Application Submitted!</h1>
                        <p className="text-muted-foreground">
                            Thanks, <span className="text-foreground font-medium">{session?.user?.name ?? 'there'}</span>!
                            We&apos;ll review your application and get back to you within{' '}
                            <span className="text-foreground font-medium">24 hours</span>.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                        <Button className="flex-1 rounded-full" asChild>
                            <Link href="/tournaments">Browse Tournaments</Link>
                        </Button>
                        <Button variant="outline" className="flex-1 rounded-full" asChild>
                            <Link href="/">Go Home</Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-56px)] pt-16 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background */}
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-primary/8 blur-[100px]" />
            </div>

            <div className="max-w-5xl mx-auto">
                {/* Back link */}
                <Button
                    variant="ghost"
                    size="sm"
                    className="mb-6 -ml-2 text-muted-foreground"
                    asChild
                >
                    <Link href="/organizer">
                        <ArrowLeft data-icon="inline-start" />
                        Back to Organizer Info
                    </Link>
                </Button>

                {/* Header */}
                <div className="mb-8">
                    <Badge variant="secondary" className="mb-3 rounded-full px-3 py-1 text-xs">
                        <Clock className="size-3 mr-1" />
                        Usually approved within 24 hrs
                    </Badge>
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
                        Organizer Application
                    </h1>
                    <p className="text-muted-foreground text-base">
                        Tell us a bit about yourself and what you plan to organize. All fields
                        marked <span className="text-destructive">*</span> are required.
                    </p>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                    {[
                        { icon: Users, label: '200+ Organizers', sub: 'Active today' },
                        { icon: Trophy, label: '1,200+ Events', sub: 'Hosted on platform' },
                        { icon: Calendar, label: '48 hrs', sub: 'Avg approval time' },
                    ].map((s) => (
                        <div
                            key={s.label}
                            className="rounded-xl border bg-card p-4 flex flex-col items-center text-center gap-1"
                        >
                            <s.icon className="size-5 text-primary mb-1" />
                            <p className="font-semibold text-sm">{s.label}</p>
                            <p className="text-muted-foreground text-xs">{s.sub}</p>
                        </div>
                    ))}
                </div>

                <Separator className="mb-8" />

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-7">
                    {/* Personal Info */}
                    <section className="flex flex-col gap-5">
                        <h2 className="text-lg font-semibold">Personal Information</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="apply-full-name" className="text-sm font-medium">
                                    Full Name <span className="text-destructive">*</span>
                                </label>
                                <Input
                                    id="apply-full-name"
                                    name="fullName"
                                    placeholder="Your full name"
                                    required
                                    defaultValue={session?.user?.name ?? ''}
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="apply-email" className="text-sm font-medium">
                                    Email Address <span className="text-destructive">*</span>
                                </label>
                                <Input
                                    id="apply-email"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    required
                                    defaultValue={session?.user?.email ?? ''}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="apply-discord" className="text-sm font-medium">
                                    Discord Username
                                </label>
                                <Input
                                    id="apply-discord"
                                    name="discord"
                                    placeholder="YourName#1234"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="apply-phone" className="text-sm font-medium">
                                    Phone / WhatsApp
                                </label>
                                <Input
                                    id="apply-phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="+91 XXXXX XXXXX"
                                />
                            </div>
                        </div>
                    </section>

                    <Separator />

                    {/* Tournament Intent */}
                    <section className="flex flex-col gap-5">
                        <h2 className="text-lg font-semibold">Tournament Details</h2>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="apply-org-name" className="text-sm font-medium">
                                Organization / Team Name <span className="text-destructive">*</span>
                            </label>
                            <Input
                                id="apply-org-name"
                                name="orgName"
                                placeholder="e.g. Nexus Esports"
                                required
                            />
                        </div>

                        {/* Game selection */}
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-medium">
                                Games you plan to organize{' '}
                                <span className="text-destructive">*</span>
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {GAME_OPTIONS.map((game) => (
                                    <button
                                        key={game}
                                        type="button"
                                        id={`game-${game.replace(/\s+/g, '-').toLowerCase()}`}
                                        onClick={() => toggleGame(game)}
                                        className={`px-3 py-1.5 rounded-full text-sm border font-medium transition-colors ${
                                            selectedGames.includes(game)
                                                ? 'bg-primary text-primary-foreground border-primary'
                                                : 'border-border hover:border-primary/60 hover:bg-primary/5'
                                        }`}
                                    >
                                        {game}
                                    </button>
                                ))}
                            </div>
                            {selectedGames.length === 0 && (
                                <p className="text-xs text-muted-foreground">
                                    Select at least one game.
                                </p>
                            )}
                        </div>

                        {/* Experience */}
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-medium">
                                Prior organizing experience{' '}
                                <span className="text-destructive">*</span>
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {EXPERIENCE_OPTIONS.map((opt) => (
                                    <button
                                        key={opt}
                                        type="button"
                                        id={`exp-${opt.replace(/\s+/g, '-').toLowerCase()}`}
                                        onClick={() => setExperience(opt)}
                                        className={`px-3 py-1.5 rounded-full text-sm border font-medium transition-colors ${
                                            experience === opt
                                                ? 'bg-primary text-primary-foreground border-primary'
                                                : 'border-border hover:border-primary/60 hover:bg-primary/5'
                                        }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="apply-social" className="text-sm font-medium">
                                Social / YouTube / Twitch (optional)
                            </label>
                            <Input
                                id="apply-social"
                                name="social"
                                placeholder="https://youtube.com/@yourchannel"
                                type="url"
                            />
                        </div>
                    </section>

                    <Separator />

                    {/* About */}
                    <section className="flex flex-col gap-5">
                        <h2 className="text-lg font-semibold">Tell us about your vision</h2>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="apply-bio" className="text-sm font-medium">
                                Brief Introduction <span className="text-destructive">*</span>
                            </label>
                            <Textarea
                                id="apply-bio"
                                name="bio"
                                placeholder="Who are you, what's your esports background, and why do you want to organize on Dethroits?"
                                className="min-h-28 resize-none"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="apply-plan" className="text-sm font-medium">
                                Your first event plan
                            </label>
                            <Textarea
                                id="apply-plan"
                                name="plan"
                                placeholder="Briefly describe the tournament you want to run (game, format, expected participants, prize pool, etc.)"
                                className="min-h-24 resize-none"
                            />
                        </div>

                        {/* Region */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="apply-region" className="text-sm font-medium">
                                Primary Region <span className="text-destructive">*</span>
                            </label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                                <Input
                                    id="apply-region"
                                    name="region"
                                    placeholder="e.g. India — South, Pan-India, Global"
                                    className="pl-9"
                                    required
                                />
                            </div>
                        </div>
                    </section>

                    {/* Submit */}
                    <div className="flex flex-col gap-3 pt-2">
                        <Button
                            id="apply-submit-btn"
                            type="submit"
                            size="lg"
                            className="w-full  font-semibold text-base"
                            disabled={submitting || selectedGames.length === 0 || !experience}
                        >
                            {submitting ? (
                                <>Submitting…</>
                            ) : (
                                <>
                                    Submit Application
                                    <SendHorizonal data-icon="inline-end" />
                                </>
                            )}
                        </Button>
                        <p className="text-center text-xs text-muted-foreground">
                            By submitting, you agree to our{' '}
                            <Link href="/contact" className="underline underline-offset-2 hover:text-foreground">
                                organizer terms
                            </Link>
                            .
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
