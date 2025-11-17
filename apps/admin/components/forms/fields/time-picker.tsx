"use client";

import { useRef } from "react";
import { Input } from "@/components/ui/input";

type Props = {
  value: string | null | undefined;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
};

export function TimeField({ value, onChange, placeholder, className }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOpenPicker = () => {
    inputRef.current?.showPicker?.();
  };

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        type="time"
        className={`${className} appearance-none pr-10`}
        value={value ?? ""}
        placeholder={placeholder || "Odaberite vrijeme"}
        onChange={(e) => onChange(e.target.value)}
      />

      {/* Ikonica sata */}
      <button
        type="button"
        onClick={handleOpenPicker}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:cursor-pointer"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M12 6v6l4 2m6-2a10 10 0 1 1-20 0 10 10 0 0 1 20 0z" />
        </svg>
      </button>
    </div>
  );
}
