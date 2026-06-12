'use client'

import { authClient, useSession } from '@/lib/auth-client';
import { Avatar, AvatarFallback, AvatarImage } from '@monorepo/ui/components/avatar';
import { Button } from '@monorepo/ui/components/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@monorepo/ui/components/dialog';
import { Input } from '@monorepo/ui/components/input';
import { Label } from '@monorepo/ui/components/label';
import { Spinner } from '@monorepo/ui/components/spinner';
import { ArrowRight, Award, CreditCard, Crown, Dumbbell, PencilIcon, Save, Trophy, Users } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import type { MyTournament } from '@/components/Tournaments/MyTournamentsCard';
import { useMyTournaments } from '@/hooks/useMyTournaments';
import MyTournamentsCard from '@/components/Tournaments/MyTournamentsCard';
import { Skeleton } from '@monorepo/ui/components/skeleton';
import Link from 'next/link';

const updateProfileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    gameId: z.string().min(3, "Game ID must be at least 3 characters").optional().or(z.literal("")),
});

type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

const MyProfile = () => {
    const {
        data: session,
        error: sessionError,
        isPending,
        refetch,
    } = useSession();
    const {
        data: tournaments,
        isLoading,
        isError,
    } = useMyTournaments('upcoming');

    const {
        data: Mytournaments,

    } = useMyTournaments('all');


    const user = session?.user as {
        id: string;
        email: string;
        name: string;
        image?: string | null;
        gameId?: string | null;
    } | undefined;

    const [open, setOpen] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<UpdateProfileInput>({
        resolver: zodResolver(updateProfileSchema),
        values: {
            name: user?.name ?? "",
            gameId: user?.gameId ?? "",
        },
    });

    useEffect(() => {
        if (open && user) {
            reset({
                name: user.name ?? "",
                gameId: user.gameId ?? "",
            });
        }
    }, [open, user, reset]);

    const onSubmit = async (values: UpdateProfileInput) => {
        const updatePayload: Record<string, any> = {};

        if (values.name.trim() !== (user?.name || "")) {
            updatePayload.name = values.name.trim();
        }

        const currentGameId = user?.gameId || "";
        const nextGameId = values.gameId?.trim() || "";
        if (nextGameId !== currentGameId) {
            updatePayload.gameId = nextGameId || null;
        }

        if (Object.keys(updatePayload).length === 0) {
            toast.info("No changes to save");
            return;
        }

        try {
            await authClient.updateUser(updatePayload, {
                onSuccess: async () => {
                    toast.success("Profile updated successfully");
                    await refetch();
                    setOpen(false);
                },
                onError: (ctx) => {
                    const errMsg = ctx.error.message || "Failed to update profile";
                    toast.error(errMsg);
                    setError("root", {
                        type: "server",
                        message: errMsg,
                    });
                }
            });
        } catch (err: any) {
            const errMsg = err?.message || "An unexpected error occurred";
            toast.error(errMsg);
            setError("root", {
                type: "server",
                message: errMsg,
            });
        }
    };

    return (
        <main className="min-h-screen py-24 ">
            <div className="container max-w-5xl mx-auto">
                <section className='flex items-center flex-col justify-center gap-4 pb-6 border-b'>
                    <div className='relative'>
                        <Avatar className="size-24 ring-transparent border border-white/40 ">
                            <AvatarImage
                                alt={"U"}
                                height={96}
                                src={user?.image ?? undefined}
                                width={96}
                            />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>

                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button variant={'outline'} size={'icon'} className='absolute bottom-0 right-0 rounded-full'>
                                    <PencilIcon className='size-4' />
                                </Button>
                            </DialogTrigger>

                            <DialogContent className='p-0'>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <DialogHeader className='px-5 py-4 border-b border-white/10'>
                                        <DialogTitle className='text-center'>Edit profile</DialogTitle>
                                        <DialogDescription className='text-center'>
                                            Update your public profile details.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className='flex flex-col gap-5 px-5 py-5'>
                                        <div className='flex flex-col items-center gap-2'>
                                            <p>Profile Image</p>
                                            <div className='relative w-fit'>
                                                <Avatar className="size-24 ring-transparent border border-white/40 ">
                                                    <AvatarImage
                                                        alt={"U"}
                                                        height={96}
                                                        src={user?.image ?? undefined}
                                                        width={96}
                                                    />
                                                    <AvatarFallback>U</AvatarFallback>
                                                </Avatar>
                                                <Button type="button" variant={'outline'} size={'icon'} className='absolute bottom-0 right-0 rounded-full'>
                                                    <PencilIcon className='size-4' />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                            <div>
                                                <Label htmlFor='name'>Name</Label>
                                                <Input
                                                    className='mt-2'
                                                    id='name'
                                                    {...register('name')}
                                                    placeholder='Enter Your Name'
                                                />
                                                {errors.name && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {errors.name.message}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <Label htmlFor='email'>Email</Label>
                                                <Input
                                                    className='mt-2'
                                                    id='email'
                                                    value={user?.email}
                                                    placeholder='Enter Your Email'
                                                    disabled
                                                />

                                            </div>

                                            <div className='md:col-span-2'>
                                                <Label htmlFor='gameId'>Game Id</Label>
                                                <Input
                                                    className='mt-2'
                                                    id='gameId'
                                                    {...register('gameId')}
                                                    placeholder='Enter Your Game ID'
                                                />
                                                {errors.gameId && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {errors.gameId.message}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {errors.root && (
                                            <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-500">
                                                {errors.root.message}
                                            </div>
                                        )}

                                        <DialogFooter className=''>
                                            <DialogClose asChild>
                                                <Button variant="outline" type="button">Cancel</Button>
                                            </DialogClose>
                                            <Button type="submit" disabled={isSubmitting}>
                                                {isSubmitting ? (
                                                    <>
                                                        <Spinner className="mr-2" />
                                                        Saving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className='size-4' />
                                                        Save changes
                                                    </>
                                                )}
                                            </Button>
                                        </DialogFooter>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className='text-center'>
                        <h2 className='text-2xl font-semibold'>
                            {user?.name}
                        </h2>
                        <p className='text-sm text-muted-foreground'>
                            {user?.email}
                        </p>
                    </div>
                </section>

                <section className="grid grid-cols-2 md:grid-cols-4 gap-4 overflow-auto px-4 py-10">
                    <div className="flex flex-col items-center justify-center bg-muted p-4 rounded-md">
                        <Award size={24} className="mb-2 text-primary" />
                        <h3 className="font-semibold font-sans text-center">
                            ₹ 0
                        </h3>
                        <p className="text-muted-foreground text-xs text-center">Total Winnings</p>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-muted p-4 rounded-md">
                        <Trophy size={24} className="mb-2 text-primary" />
                        <h3 className="font-semibold font-sans text-center">
                            {Mytournaments?.length}

                        </h3>
                        <p className="text-muted-foreground text-xs text-center">Tournaments Joined</p>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-muted p-4 rounded-md">
                        <Crown size={24} className="mb-2 text-primary" />
                        <h3 className=" font-semibold font-sans text-center">
                            0                        </h3>
                        <p className="text-muted-foreground text-xs text-center">Tournaments Won</p>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-muted p-4 rounded-md">
                        <Dumbbell size={24} className="mb-2 text-primary" />
                        <h3 className="font-semibold font-sans text-center">
                            0
                        </h3>
                        <p className="text-muted-foreground text-xs text-center">Matches Played</p>
                    </div>
                </section>
                <section className=" py-10">
                    <div className="flex justify-between items-center px-4 mb-6">

                        <h2 className="text-xl font-bold  ">
                            Upcoming Tournaments
                        </h2>
                        <Button className='' variant={'ghost'} size={'sm'} asChild>
                            <Link href="/my-tournaments">
                                View All
                                <ArrowRight size={16} className="ml-2" />
                            </Link>
                        </Button>
                    </div>
                    {isLoading ? (
                        <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 scrollbar-thin">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton
                                    key={i}
                                    className="h-[200px] w-[320px] sm:w-[350px] shrink-0 rounded-xl"
                                />
                            ))}
                        </div>
                    ) : isError ? (
                        <div className="text-red-500 text-sm">
                            Failed to load upcoming tournaments.
                        </div>
                    ) : tournaments && tournaments.length > 0 ? (
                        <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 pl-1 pr-4 scrollbar-thin snap-x snap-mandatory">
                            {tournaments.map((t: MyTournament) => (
                                <div key={t.id} className="w-[320px] sm:w-[350px] shrink-0 snap-start">
                                    <MyTournamentsCard tournament={t} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-sm">
                            You have no upcoming tournaments.
                        </p>
                    )}
                </section>
            </div>
        </main>
    )
}

export default MyProfile