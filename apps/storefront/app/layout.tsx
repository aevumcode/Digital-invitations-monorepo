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
  description: "Digital Invitations, your one-stop shop for all invitations your needs.",
};

/**
 * Root Layout Component for ACME Store
 *
 * This is the main layout component that wraps the entire application.
 * It provides essential providers and global functionality including:
 * - Shopify e-commerce integration with cart management
 * - Font configuration with Geist Sans and Mono
 * - Toast notifications for user feedback
 * - URL state management with nuqs
 * - Development debugging tools
 * - v0 environment detection and setup
 */
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
