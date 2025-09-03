"use client";

import { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Sidebar */}
      <AppSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Sticky Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 p-6 bg-gray-50">{children}</main>
      </div>
    </>
  );
}
