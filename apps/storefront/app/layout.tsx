import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { CartProvider } from "@/components/cart/cart-context";
import { getCollections } from "@/data-access/invitations";
import { Header } from "../components/layout/header";
import { cn } from "../lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Digital Invitations Store",
  description: "Digital Invitations, your one-stop shop for all invitation needs.",
  openGraph: {
    title: "Digital Invitations Store",
    description: "Beautiful digital invitations for weddings, birthdays and events.",
    url: "https://digital-invitations-monorepo-storef.vercel.app/",
    siteName: "Digital Invitations",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Digital Invitations Store",
      },
    ],
    locale: "hr-HR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Invitations Store",
    description: "Beautiful digital invitations for weddings, birthdays and events.",
    images: ["/og-image.jpg"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const collections = await getCollections();

  return (
    <html lang="en">
      <body className={cn(geistSans.variable, geistMono.variable, "antialiased min-h-screen")}>
        <CartProvider>
          <NuqsAdapter>
            <main data-vaul-drawer-wrapper="true">
              <Header collections={collections} />
              {children}
            </main>
            <Toaster closeButton position="bottom-right" />
          </NuqsAdapter>
        </CartProvider>
      </body>
    </html>
  );
}
