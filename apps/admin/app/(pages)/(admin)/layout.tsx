"use client";

import { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* Off-canvas / collapsible sidebar */}
        <AppSidebar />

        {/* Main content area shifts when sidebar opens */}
        <SidebarInset className="flex flex-1 flex-col">
          <Header />
          <main className="flex-1 bg-gray-50 p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
