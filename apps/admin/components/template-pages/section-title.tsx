import React from "react";
import { useInvitationTheme } from "./theme";

interface SectionTitleProps {
  children: React.ReactNode;
  titleAlign?: "left" | "center" | "right";
  className?: string;
}

const alignmentClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export function SectionTitle({ children, titleAlign = "left", className = "" }: SectionTitleProps) {
  const { headlineFont } = useInvitationTheme();

  return (
    <h2
      className={`mb-6 text-3xl font-semibold ${alignmentClasses[titleAlign]} ${headlineFont} ${className}`}
    >
      {children}
    </h2>
  );
}
