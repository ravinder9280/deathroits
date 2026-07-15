import "@monorepo/ui/globals.css";
import { Toaster } from 'sonner';
import type { Metadata } from "next";
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

export const metadata: Metadata = {
  description: "Deathroit",
  title: "Deathroit",
  icons: {
    icon: "/logo2.svg"
  }
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

