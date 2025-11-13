"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-3 md:px-6">
      {/* Left: mobile menu button + brand */}
      <div className="flex items-center gap-3">
        {/* Sidebar toggle (mobile only) */}
        <SidebarTrigger className="md:hidden" aria-label="Open sidebar" />

        <div className="flex items-center gap-2">
          <Image
            src="/logos/logo-only-transp-black.png"
            // src="/logos/logo-1.png"
            alt="Logo"
            width={24}
            height={24}
            className="h-8 w-8"
          />
          <span className="font-semibold text-gray-900">Digital Invitations</span>
        </div>
      </div>

      {/* Right */}
      {/* <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>AE</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Alex Evans</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <form action={logoutAction}>
              <DropdownMenuItem asChild>
                <button type="submit" className="w-full text-left">
                  Sign out
                </button>
              </DropdownMenuItem>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div> */}
    </header>
  );
}
