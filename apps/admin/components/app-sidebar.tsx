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

const navItems = [
  { title: "Home", href: "/", icon: Home },
  { title: "Templates", href: "/templates", icon: Database },
  { title: "Guests", href: "/guests", icon: Users },
  { title: "Settings", href: "/settings", icon: Settings },
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
          <h1 className="pl-2 pt-2 text-xl font-bold">Welcome</h1>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col justify-between h-[60vh]">
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
                          if (isMobile) toggleSidebar?.(); // close drawer on mobile
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
              <SidebarMenuItem key="store">
                <SidebarMenuButton
                  asChild
                  variant="purple"
                  onClick={() => {
                    if (isMobile) toggleSidebar?.(); // close drawer on mobile
                  }}
                >
                  <Link href={storefrontLink} className="flex items-center gap-3 ">
                    <Store className="h-4 w-4" />
                    Buy more templates
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
