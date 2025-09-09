"use client";

import * as React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export type TemplateLite = {
  id: string;
  name: string;
  slug: string;
  previewUrl: string;
  priceCents: number;
};

type Props = {
  template: TemplateLite;
  selected?: boolean;
  onSelect?: (id: string) => void;
  aspect?: string; // e.g. "aspect-[4/3]" (default) or "aspect-[3/4]"
  size?: "sm" | "md" | "lg";
};

export function TemplateCard({
  template,
  selected,
  onSelect,
  aspect = "aspect-[4/3]",
  size,
}: Props) {
  // Cap ONLY on large screens, never on mobile.
  const cap =
    size === "sm"
      ? "lg:max-w-[420px]"
      : size === "md"
        ? "lg:max-w-[520px]"
        : size === "lg"
          ? "lg:max-w-[640px]"
          : "";

  return (
    <Card
      onClick={() => onSelect?.(template.id)}
      className={`block w-[90vw]  md:w-full max-w-full ${cap} cursor-pointer transition-shadow ${
        selected ? "ring-2 ring-purple-500" : "hover:shadow-md"
      }`}
    >
      <CardContent className="p-3 sm:p-4">
        {/* Full-bleed on mobile; small breathing room on >= sm */}
        <div className={`relative ${aspect} w-full overflow-hidden rounded-lg bg-muted`}>
          {template.previewUrl ? (
            <div className="absolute inset-0 sm:inset-y-2 sm:inset-x-3">
              <Image
                src={template.previewUrl}
                alt={template.name}
                fill
                className="object-contain rounded-md shadow-sm"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={false}
              />
            </div>
          ) : null}

          {selected && (
            <div className="absolute right-3 top-3 rounded bg-purple-600 px-2 py-1 text-xs text-white shadow-sm">
              Selected
            </div>
          )}
        </div>

        <div className="mt-3">
          <div className="font-medium">{template.name}</div>
          <div className="text-xs text-muted-foreground">#{template.slug}</div>
        </div>
      </CardContent>
    </Card>
  );
}
