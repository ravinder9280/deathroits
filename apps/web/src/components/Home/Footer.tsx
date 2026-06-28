import Link from 'next/link'
import React from 'react'

const Footer = () => {
    return (
        <footer className='bg-primary/15 pt-16 px-10 pb-10 border-t border-[rgba(242,242,236,0.06)]'>
            <div className='container max-w-[1200px] mx-auto'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-10 mb-12'>

                    <div className='md:col-span-2'>
                        <div className='mb-4'>

                            <Link className="" href={'/'} >
                                <img alt="" height={24} src={"/logo.svg"} width={150} className="h-[24px] w-auto" />
                            </Link>
                        </div>

                        <p className='text-white/50 text-[14px] leading-[1.7] max-w-[260px]'>
                            The ultimate esports tournament platform. Compete, win, and rise through the ranks — free to play, built for grinders.
                        </p>
                        <p className='text-white/30 text-[12px] mt-6'>
                            © 2026 Deathroit. All rights reserved.
                        </p>
                        <p className='text-white/30 text-[12px] mt-1'>
                            Designed & Developed by <span className='text-primary font-semibold'>Ravinder</span>
                        </p>
                    </div>

                    <div className='grid grid-cols-2 gap-10'>

                        <div>
                            <h4 className='text-white/50 text-[11px] font-bold uppercase tracking-[0.12em] mb-5'>
                                Platform
                            </h4>
                            <ul className='flex flex-col gap-3'>
                                {[
                                    { label: 'Tournaments', href: '/tournaments' },
                                    { label: 'Leaderboard', href: '/leaderboard' },
                                    { label: 'Live Matches', href: '/live' },
                                    { label: "Organizer", href: "/organizer" },
                                    { label: 'Download App', href: '/download' },
                                ].map((item) => (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className='text-white/70 text-[14px] hover:text-primary transition-colors duration-200'
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className='text-white/50 text-[11px] font-bold uppercase tracking-[0.12em] mb-5'>
                                Company
                            </h4>
                            <ul className='flex flex-col gap-3'>
                                {[
                                    { label: 'About', href: '/about' },
                                    { label: 'Blog', href: '/blog' },
                                    { label: 'FAQ', href: '/faq' },
                                    { label: 'Contact', href: '/contact' },
                                    { label: 'Privacy Policy', href: '/privacy' },
                                    { label: 'Terms of Service', href: '/terms' },
                                ].map((item) => (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className='text-white/70 text-[14px] hover:text-primary transition-colors duration-200'
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>


                </div>


            </div>

        </footer>
    )
}

export default Footer