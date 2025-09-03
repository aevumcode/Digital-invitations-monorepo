"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { IconSearch } from "@tabler/icons-react";
import { useEffect } from "react";

type Props = {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  delay?: number;
  className?: string;
};

export function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
  delay = 300,
  className,
}: Props) {
  const [inner, setInner] = React.useState(value);

  useEffect(() => setInner(value), [value]);

  useEffect(() => {
    const t = setTimeout(() => onChange(inner), delay);
    return () => clearTimeout(t);
  }, [inner, delay, onChange]);

  return (
    <div className="relative">
      <IconSearch
        className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
        size={16}
      />
      <Input
        value={inner}
        onChange={(e) => setInner(e.target.value)}
        placeholder={placeholder}
        className={`pl-8 ${className ?? ""}`}
      />
    </div>
  );
}
