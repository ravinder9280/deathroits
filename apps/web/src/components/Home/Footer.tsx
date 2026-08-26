import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link'
import React from 'react'


const socialMedia = [


    {
        name: "Twitter",
        href: "https://x.com/Ravinder387573",
        icon: Twitter,
    },
    {
        name: "Linkedin",
        href: "https://www.linkedin.com/in/ravinder92809",
        icon: Linkedin,
    },
    {
        name: "Instagram",
        href: "https://www.instagram.com/ravindersync",
        icon: Instagram,
    }

];

const Footer = () => {
    return (
        <footer className='bg-primary/15 py-16 px-10  border-t border-[rgba(242,242,236,0.06)]'>
            <div className='container max-w-[1200px] mx-auto'>
                <div className='grid grid-cols-1 md:grid-cols-5 gap-10 mb-12'>

                    <div className='md:col-span-3'>
                        <div className='mb-4'>

                            <Link className="" href={'/'} >
                                <img alt="" height={24} src={"/logo.svg"} width={150} className="h-[24px] w-auto" />
                            </Link>
                        </div>

                        <p className='text-neutral-400 text-sm leading-relaxed max-w-sm'>
                            The ultimate esports tournament platform. Compete, win, and rise through the ranks — free to play, built for grinders.
                        </p>

                    </div>

                    <div className='grid grid-cols-3 md:col-span-2 gap-10 w-full'>

                        <div>
                            <h4 className='text-white/50 text-[11px] font-bold uppercase tracking-[0.12em] mb-5'>
                                Product
                            </h4>
                            <ul className='flex flex-col gap-3'>
                                {[
                                    { label: 'Home', href: '/' },
                                    { label: 'Tournaments', href: '/tournaments' },
                                    { label: 'Leaderboard', href: '/leaderboard' },
                                    { label: 'Organizer', href: '/organizer' },
                                    { label: 'Chat', href: '/chat' },
                                ].map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className='hover:underline text-neutral-300 transition-colors duration-300 ease-out hover:text-primary'
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className='text-white/50 text-[11px] font-bold uppercase tracking-[0.12em] mb-5'>
                                Support
                            </h4>
                            <ul className='flex flex-col gap-3'>
                                {socialMedia.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className='hover:underline  text-neutral-300 transition-colors duration-300 ease-out hover:text-primary'
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className='text-white/50 text-[11px] font-bold uppercase tracking-[0.12em] mb-5'>
                                Developers
                            </h4>
                            <ul className='flex flex-col gap-3'>
                                {[
                                    { label: 'llm.txt', href: '/llm.txt' },
                                    { label: 'robots.txt', href: '/robots.txt' },
                                    { label: 'sitemap.xml', href: '/sitemap.xml' },



                                ].map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className='hover:underline  text-neutral-300 transition-colors duration-300 ease-out hover:text-primary'
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </ul>
                        </div>
                    </div>


                </div>

                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pt-6 text-sm text-neutral-400 '>                    {/* Social Icons */}
                    <div className='flex flex-wrap items-center gap-x-3 gap-y-2'>

                        <p className=' text-white/50'>
                            Follow us on
                        </p>
                        {socialMedia.map((social) => (
                            <Link
                                key={social.name}
                                href={social.href}
                                target='_blank'
                                className='hover:underline  text-neutral-300 transition-colors duration-300 ease-out hover:text-primary  inline-flex items-center gap-2 leading-none'
                            >

                                <social.icon className='size-4' />
                                {social.name}
                            </Link>
                        ))}
                    </div>
                    <p className='  text-xs font-medium  text-neutral-500 tracking-wide'>
                        © 2026 Deathroit. All rights reserved.
                        Designed & Developed by <span className='text-primary font-semibold'>Ravinder</span>
                    </p>
                </div>


            </div>

        </footer>
    )
}

export default Footer