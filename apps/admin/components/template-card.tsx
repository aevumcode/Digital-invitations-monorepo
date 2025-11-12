"use client";

import * as React from "react";
import Image from "next/image";

export type TemplateForUI = {
  id: number;
  name: string;
  previewUrl: string;
  slug?: string | null;
  price?: number | null;
  fullPrice?: number | null;
};

export type TemplateCardProps = {
  template: TemplateForUI;
  selected?: boolean;
  onSelect?: () => void;
  aspect?: string; // e.g. "aspect-[3/4]"
  size?: "sm" | "md";
};

export function TemplateCard({
  template,
  selected = false,
  onSelect,
  aspect = "aspect-[3/4]",
  size = "md",
}: TemplateCardProps) {
  const { name, previewUrl, price, fullPrice } = template;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group w-full overflow-hidden rounded-xl border bg-white text-left transition
        ${selected ? "border-purple-500 ring-2 ring-purple-300" : "border-gray-200"}
      `}
      aria-pressed={selected}
    >
      <div className={`${aspect} relative w-full bg-gray-50`}>
        {previewUrl ? (
          <Image src={previewUrl} alt={name} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-sm text-gray-400">
            No preview
          </div>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">{name}</h3>
          {(price ?? fullPrice) != null && (
            <div className="text-xs text-gray-500">
              {price != null ? `CHF ${price}` : null}
              {price != null && fullPrice != null ? " · " : ""}
              {fullPrice != null ? `CHF ${fullPrice}` : null}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
