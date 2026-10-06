import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/shell/Header";
import { Footer } from "@/components/shell/Footer";
import { WhatsAppFab } from "@/components/shell/WhatsAppFab";
import { RouteTransitionWrappers } from "@/components/shell/RouteTransitionWrappers";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Voltra — Always on. Never out.",
    template: "%s · Voltra",
  },
  description:
    "Electronics that show up when you need them — direct-sourced, fair-priced, and stocked deep enough that “out of stock” is somebody else’s problem.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? process.env.URL ?? "http://localhost:3000",
  ),
  openGraph: {
    siteName: "Voltra",
    type: "website",
    locale: "en_NG",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Header />
        <RouteTransitionWrappers />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFab />
        <Toaster theme="dark" position="top-center" richColors />
      </body>
    </html>
  );
}
