import "@monorepo/ui/globals.css";
import { Toaster } from 'sonner';
import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import NextTopLoader from 'nextjs-toploader';
import { ThemeProvider } from "../providers/theme-provider";
import { QueryProvider } from "@/providers/query-provider";
const space_grotesk_display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--display-family",
  weight: ["700"],
});
const space_grotesk_body = Space_Grotesk({
  subsets: ["latin"],
  variable: "--body-family",
  weight: ["400"],
});
const jetbrains_mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400"],
});

const BASE_URL = 'https://deathroit.ravindertech.me';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Deathroit',
    template: '%s | Deathroit',
  },
  description:
    'Deathroit is a competitive esports tournament platform. Join custom tournaments, track live leaderboards, and prove your squad is the best — built for gamers, organizers, and growing esports communities.',
  keywords: [
    'esports tournament',
    'online gaming tournament',
    'BGMI tournament',
    'Free Fire tournament',
    'competitive gaming',
    'leaderboard',
    'esports platform India',
    'gaming community',
    'Deathroit',
  ],
  authors: [{ name: 'Deathroit', url: BASE_URL }],
  creator: 'Deathroit',
  publisher: 'Deathroit',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: BASE_URL,
    siteName: 'Deathroit',
    title: 'Deathroit',
    description:
      'Join custom esports tournaments, compete against top players, and track live leaderboards on Deathroit.',
    images: [
      {
        url: `${BASE_URL}/dashboard.webp`,
        width: 1200,
        height: 630,
        alt: 'Deathroit — Esports Tournament Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Deathroit — Where Champions Are Made, Legends Compete',
    description:
      'Join custom esports tournaments, compete against top players, and track live leaderboards on Deathroit.',
    images: [`${BASE_URL}/dashboard.webp`],
  },
  alternates: {
    canonical: BASE_URL,
  },
  icons: {
    icon: '/logo2.svg',
    shortcut: '/fevicon.jpg',
  },
};

export const viewport: Viewport = {
  themeColor: '#2563eb',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactNode {
  return (
    <html
      className={`${space_grotesk_display.variable} ${space_grotesk_body.variable} ${jetbrains_mono.variable}`}
      lang="en"
      suppressHydrationWarning
    >
      
      <link
        rel="preload"
        href="/bg.svg"
        as="image"
      />
      <Toaster richColors closeButton />
      <body className="font-body">
         <NextTopLoader 
         
          color="#2563eb"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #2563eb,0 0 5px #2563eb"
        />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem >
          <QueryProvider>
            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

