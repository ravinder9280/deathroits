'use client';

import { useSession } from '@/lib/auth-client';
import { Button } from '@monorepo/ui/components/button';
import { Badge } from '@monorepo/ui/components/badge';
import { Separator } from '@monorepo/ui/components/separator';
import {
    Trophy,
    Users,
    BarChart3,
    Zap,
    Shield,
    Globe,
    ArrowRight,
    CheckCircle,
    Star,
    ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GamesMarquee } from '@/components/ui/GamesMarquee';
import Footer from '@/components/Home/Footer';

const features = [
    {
        icon: Trophy,
        title: 'Create & Manage Tournaments',
        description:
            'Build professional tournaments from scratch with our intuitive dashboard. Set brackets, rules, prize pools, and schedules in minutes.',
    },
    {
        icon: Users,
        title: 'Participant Management',
        description:
            'Effortlessly handle registrations, team assignments, check-ins, and communications — all from one central place.',
    },
    {
        icon: BarChart3,
        title: 'Real-time Analytics',
        description:
            'Track registrations, revenue, and engagement with live dashboards and detailed reports built for organizers.',
    },
    {
        icon: Zap,
        title: 'Instant Notifications',
        description:
            'Keep participants informed automatically — round results, schedule changes, and announcements pushed instantly.',
    },
    {
        icon: Shield,
        title: 'Anti-Cheat & Fair Play',
        description:
            'Built-in tools to report disputes, verify results, and maintain competitive integrity across every event.',
    },
    {
        icon: Globe,
        title: 'Global Reach',
        description:
            'Host local LAN events or international online competitions — our platform scales to any size and format.',
    },
];

const steps = [
    { number: '01', title: 'Apply', description: 'Submit your organizer application with a brief introduction.' },
    { number: '02', title: 'Get Approved', description: 'Our team reviews and activates your organizer account.' },
    { number: '03', title: 'Create', description: 'Launch your first tournament in under 10 minutes.' },
    { number: '04', title: 'Grow', description: 'Build your community and reputation with every event.' },
];

const testimonials = [
    {
        name: 'Arjun Mehta',
        game: 'BGMI Organizer',
        quote: "Dethroits made running a 512-player BGMI tournament completely painless. The registration flow alone saved us hours.",
        stars: 5,
    },
    {
        name: 'Priya Sharma',
        game: 'Valorant Series Host',
        quote: "The analytics dashboard is a game-changer. I can see exactly how my events perform and where to improve.",
        stars: 5,
    },
    {
        name: 'Rohan Das',
        game: 'Free Fire League',
        quote: "Customer support is phenomenal and the platform just works. Highly recommend to any serious esports organizer.",
        stars: 5,
    },
];

export default function OrganizerLandingPage() {
    const { data: session, isPending } = useSession();
    const router = useRouter();

    const isOrganizer =
        session?.user?.role === 'ORGANIZER' || session?.user?.role === 'ADMIN';

    const handleCTA = () => {
        if (!session) {
            router.push('/sign-in?redirect=/organizer/apply');
        } else if (isOrganizer) {
            router.push('/organizer/dashboard');
        } else {
            router.push('/organizer/apply');
        }
    };

    return (<>
        <div className="overflow-x-hidden">
            {/* ── Hero ── */}
            {/* <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10"
            >
                <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-primary/10 blur-[120px]" />
                <div className="absolute top-20 -left-40 w-[500px] h-[500px] rounded-full bg-violet-500/8 blur-[100px]" />
                <div className="absolute top-20 -right-40 w-[500px] h-[500px] rounded-full bg-cyan-500/8 blur-[100px]" />
            </div> */}

            <div className=' w-full'>

                <section className="relative  bg-linear-to-b  from-bg-primary/10 via-violet-500/8 to-cyan-500/8   overflow-hidden">
                    {/* Background glow blobs */}

                    <div className='pt-24 md:pt-34 pb-10 md:pb-20 px-3 sm:px-6 lg:px-8 container mx-auto '>


                        <div className='grid grid-cols-1 md:grid-cols-2  gap-8 mb-16'>
                            <div className='flex  items-center '>


                                <div className="max-w-[642px]   " >
                                    {/* <Badge
                        variant="secondary"
                        className="mb-6 px-4 py-1.5 text-sm font-medium rounded-full"
                    >
                        🏆 Now accepting organizer applications
                    </Badge> */}

                                    <h1 className=" text-5xl  font-bold mb-6 leading-[1.2]  ">
                                        Build Legendary Esports
                                        <br />
                                        Tournaments.
                                        We&apos;ll Handle the
                                        {' '}
                                        <span className="text-primary text-gradient">
                                            Platform.
                                        </span>
                                    </h1>

                                    <p className=" md:text-xl text-zinc-800 dark:text-zinc-300 font-medium leading-[1.6] ">
                                        Launch tournaments in minutes, engage players with real-time updates, manage participants effortlessly, and grow your competitive gaming brand.
                                    </p>

                                    <div className="flex  flex-col items-center md:flex-row   mt-8 gap-3 md:gap-6">
                                        <Button
                                            id="become-organizer-cta"
                                            size="xl"
                                            className="w-full md:w-auto font-semibold"
                                            onClick={handleCTA}
                                            disabled={isPending}
                                        >
                                            Start Organizing
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="xl"
                                            className="w-full md:w-auto font-semibold"
                                            asChild
                                        >
                                            <Link href="/contact">
                                                Contact Us
                                            </Link>
                                        </Button>
                                    </div>


                                </div>

                            </div>
                            <div className="flex items-center justify-end "  >
                                <div className='max-w-[642px] rounded-xl'>

                                    <img src="/dashboard.webp" alt="" className='rounded-xl' />
                                </div>
                            </div>


                        </div>


                        <GamesMarquee className="bg-transparent" />
                    </div>

                </section>

                {/* ── Features ── */}
                <section className="py-10 px-5 md:py-[100px] md:px-6  ">
                    <div className="container mx-auto w-full">
                        <div className="text-center mb-16 max-w-3xl mx-auto">
                            <h2 className="text-3xl lg:text-4xl font-bold mb-4 uppercase tracking-[-0.05em] leading-[0.95] ">
                                Everything you need to run world-class {" "}
                                <span className='text-primary'>

                                    tournaments
                                </span>
                            </h2>
                            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                                From registration to final results — built for serious esports organizers.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((f) => (
                                <div
                                    key={f.title}
                                    className="group rounded-xl border border-neutral-700/50 bg-neutral-800/50 p-8 flex flex-col gap-4 hover:border-primary/50 hover:shadow-md hover:shadow-primary/5 transition-all duration-200"
                                >
                                    <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6  transition-colors">
                                        <f.icon className="size-8 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold  mb-3">{f.title}</h3>
                                        <p className="text-white/60 text-sm md:text-base leading-relaxed">{f.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── How it works ── */}
                <section className="py-10 px-5 md:py-[100px] md:px-6 bg-neutral-800/50">
                    <div className="container mx-auto w-full">
                        <div className="text-center mb-14">
                            <h2 className="text-3xl lg:text-4xl font-bold mb-4 uppercase tracking-[-0.05em] leading-[0.95] ">
                                How it{" "}
                                <span className='text-primary'>
                                    works
                                </span>
                            </h2>
                            <p className="text-muted-foreground text-lg  mx-auto">
                                Get from application to live tournament in four simple steps.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
                            {steps.map((step, i) => (
                                <div key={step.number} className="flex flex-col gap-3 text-center items-center">
                                    <div className="relative flex items-center justify-center size-16 rounded-full border-2 border-primary/30 bg-primary/10 text-primary font-bold text-lg">
                                        {step.number}
                                    </div>
                                    {i < steps.length - 1 && (
                                        <ChevronRight className="hidden lg:block absolute top-5 text-muted-foreground/40 size-5"
                                            style={{ left: `calc(${(i + 1) * 25}% - 10px)` }}
                                        />
                                    )}
                                    <h3 className="font-semibold text-lg">{step.title}</h3>
                                    <p className="text-muted-foreground ">{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Testimonials ── */}
                <section className="py-10 px-5 md:py-[100px] md:px-6 ">
                    <div className="container mx-auto w-full">
                        <div className="text-center mb-14">
                            <h2 className="text-3xl lg:text-4xl font-bold mb-4 uppercase tracking-[-0.05em] leading-[0.95] ">
                                What our organizers{" "}
                                <span className='text-primary'>
                                    say
                                </span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {testimonials.map((t) => (
                                <div
                                    key={t.name}
                                    className="group rounded-xl border border-neutral-700/50 bg-neutral-800/50 p-8 flex flex-col gap-4 hover:border-primary/50 hover:shadow-md hover:shadow-primary/5 transition-all duration-200"
                                >
                                    <div className="flex gap-0.5">
                                        {Array.from({ length: t.stars }).map((_, i) => (
                                            <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                                        ))}
                                    </div>
                                    <p className=" text-white/80 leading-relaxed">
                                        &ldquo;{t.quote}&rdquo;
                                    </p>
                                    <Separator className='bg-neutral-700/50' />
                                    <div>
                                        <p className="font-semibold ">{t.name}</p>
                                        <p className="text-sm text-white/60">{t.game}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── CTA Banner ── */}
                <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 -z-10"
                    >
                        <div className="absolute inset-0 bg-primary" />
                    </div>

                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-black mb-4">
                            {isOrganizer
                                ? 'Welcome back, Organizer!'
                                : 'Ready to host your first tournament?'}
                        </h2>
                        <p className="text-black/80 text-lg mb-8 max-w-xl mx-auto">
                            {isOrganizer
                                ? 'Head to your dashboard to manage tournaments, check registrations, and grow your events.'
                                : 'Join hundreds of organizers already using Dethroits to run unforgettable gaming events.'}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button
                                id="become-organizer-cta-bottom"
                                size="xl"
                                className="font-semibold bg-black hover:bg-black/80 text-white hover:text-white/80  "
                                onClick={handleCTA}

                                disabled={isPending}
                            >
                                {isOrganizer ? 'Open Dashboard' : "Apply Now — It's Free"}
                                <ArrowRight data-icon="inline-end" />
                            </Button>
                        </div>

                        {/* <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
                            {[
                                'Free to apply',
                                'No credit card required',
                                'Approved within 24 hrs',
                            ].map((item) => (
                                <span key={item} className="flex items-center gap-1.5">
                                    <CheckCircle className="size-4 text-primary" />
                                    {item}
                                </span>
                            ))}
                        </div> */}
                    </div>
                </section>
            </div>
        </div>
        <Footer/>
    </>


    );
}
