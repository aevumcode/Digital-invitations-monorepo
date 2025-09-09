"use client";

import * as React from "react";
import { TemplateLite, TemplateCard } from "./template-card";

type Props = {
  templates: TemplateLite[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function TemplateSelectGrid({ templates, selectedId, onSelect }: Props) {
  return (
    <div className="grid grid-cols-1 mx-10 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {templates.map((tpl) => (
        <TemplateCard
          key={tpl.id}
          template={tpl}
          selected={tpl.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
