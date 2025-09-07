"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface ResultsCountProps {
  count: number;
  className?: string;
}

export function ResultsCount({ count, className }: ResultsCountProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // render placeholder so server & client match initially
    return (
      <span className={cn("place-self-center text-sm text-foreground/50", className)}>
        0 results
      </span>
    );
  }

  return (
    <span className={cn("place-self-center text-sm text-foreground/50", className)}>
      {count} results
    </span>
  );
}
