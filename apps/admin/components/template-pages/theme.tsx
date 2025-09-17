// components/invitations/theme.tsx
"use client";
import * as React from "react";
import type { Theme } from "./types";

const ThemeCtx = React.createContext<Theme | null>(null);
export const useInvitationTheme = () => {
  const ctx = React.useContext(ThemeCtx);
  if (!ctx) throw new Error("useInvitationTheme must be used within <InvitationThemeProvider>");
  return ctx;
};

export function InvitationThemeProvider({
  theme,
  children,
}: {
  theme: Theme;
  children: React.ReactNode;
}) {
  const value = React.useMemo<Theme>(
    () => ({
      accentColor: theme.accentColor,
      headlineFont: theme.headlineFont,
      bodyFont: theme.bodyFont,
      rounded: theme.rounded ?? "rounded-xl",
    }),
    [theme],
  );

  return (
    <ThemeCtx.Provider value={value}>
      <div className="w-full h-screen" style={{ fontFamily: value.bodyFont }}>
        {children}
      </div>
    </ThemeCtx.Provider>
  );
}
