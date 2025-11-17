"use client";

import { useRef } from "react";
import { Input } from "@/components/ui/input";

type Props = {
  value: string | null | undefined;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
};

export function DateField({ value, onChange, placeholder, className }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOpenPicker = () => {
    inputRef.current?.showPicker?.();
  };

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        type="date"
        className={`${className} appearance-none pr-10`}
        value={value ?? ""}
        placeholder={placeholder || "Odaberite datum"}
        onChange={(e) => onChange(e.target.value)}
      />

      {/* Ikonica kalendara */}
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
          <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" />
        </svg>
      </button>
    </div>
  );
}
