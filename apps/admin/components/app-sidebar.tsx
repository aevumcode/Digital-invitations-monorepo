"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart3, Database, Users, Settings, Store } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { logoutAction } from "@/data-access/actions/auth";
import { Button } from "./ui/button";

const navItems = [
  { title: "Početna", href: "/", icon: Home },
  { title: "Gosti", href: "/guests", icon: Users },
  { title: "Postavke", href: "/settings", icon: Settings },
];

const storefrontLink = process.env.NEXT_PUBLIC_STOREFRONT_URL || "http://localhost:3001";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { isMobile, toggleSidebar } = useSidebar?.() ?? {
    isMobile: false,
    toggleSidebar: () => {},
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <div className="relative mb-6">
          <h1 className="pl-2 pt-2 text-xl font-bold">Dobrodošli</h1>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col justify-between h-[80vh] md:h-[80vh]">
              <div>
                {navItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        variant={active ? "purple" : "default"}
                        onClick={() => {
                          if (isMobile) toggleSidebar?.();
                        }}
                      >
                        <Link href={item.href} className="flex items-center gap-3">
                          <item.icon className="h-4 w-4" />
                          {item.title}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </div>
              <div className="flex flex-col gap-2">
                <SidebarMenuItem key="store">
                  <SidebarMenuButton
                    asChild
                    variant="purple"
                    onClick={() => {
                      if (isMobile) toggleSidebar?.();
                    }}
                  >
                    <Link href={storefrontLink} className="flex items-center gap-3 ">
                      <Store className="h-4 w-4" />
                      Kupi predloške
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem key="log-out">
                  <Button
                    className="cursor-pointer w-full"
                    variant="outline"
                    onClick={logoutAction}
                  >
                    Odjavi se
                  </Button>
                </SidebarMenuItem>
              </div>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
