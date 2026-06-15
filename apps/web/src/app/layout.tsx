import "@monorepo/ui/globals.css";
import Navbar from "@/components/Home/Navbar";
import { Toaster } from 'sonner';
import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";

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
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem >
          <Navbar />
          <QueryProvider>


            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
