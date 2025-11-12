// components/template-select-grid.tsx
"use client";

import * as React from "react";
import { TemplateCard } from "./template-card";
import type { PurchaseForGrid } from "@/types/_purchase";

export function TemplateSelectGrid({
  purchases,
  selectedId,
  onSelect,
}: {
  purchases: PurchaseForGrid[]; // narrow is fine
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {purchases.map((p) => (
        <TemplateCard
          key={p.id}
          template={p.template}
          selected={selectedId === p.id}
          onSelect={() => onSelect(p.id)}
          aspect="aspect-[3/4]"
        />
      ))}
    </div>
  );
}
