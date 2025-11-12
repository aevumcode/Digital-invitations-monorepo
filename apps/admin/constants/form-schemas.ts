"use client";

import type { FormSchema } from "@/components/forms/dynamic-forms";
import { getTemplateById } from "@/constants/template-data";

/**
 * Minimalne sheme po tipu predloška.
 * Slobodno dodaj/miči polja. "required: true" će se validirati kroz Yup builder.
 */
const WEDDING_SCHEMA: FormSchema = {
  title: "Detalji vjenčanja",
  sections: [
    {
      title: "Osnovno",
      fields: [
        { name: "title", label: "Naziv projekta", type: "text", required: true, maxLength: 80 },
        { name: "heroImage", label: "URL naslovne slike", type: "url", placeholder: "https://…" },
      ],
    },
    {
      title: "Mladenci",
      fields: [
        { name: "groomName", label: "Ime mladoženje", type: "text", required: true, maxLength: 60 },
        { name: "brideName", label: "Ime mladenke", type: "text", required: true, maxLength: 60 },
      ],
    },
    {
      title: "Event",
      fields: [
        { name: "date", label: "Datum", type: "date", required: true },
        { name: "time", label: "Vrijeme", type: "time", required: true },
        { name: "venue", label: "Lokacija", type: "text", required: true, maxLength: 80 },
        { name: "city", label: "Grad", type: "text", required: true, maxLength: 60 },
      ],
    },
    {
      title: "Poruka",
      fields: [{ name: "message", label: "WhatsApp poruka", type: "textarea", maxLength: 500 }],
    },
  ],
};

const BIRTHDAY_SCHEMA: FormSchema = {
  title: "Detalji rođendana",
  sections: [
    {
      title: "Osnovno",
      fields: [
        { name: "title", label: "Naziv projekta", type: "text", required: true, maxLength: 80 },
        { name: "heroImage", label: "URL naslovne slike", type: "url", placeholder: "https://…" },
      ],
    },
    {
      title: "Slavljenik",
      fields: [
        { name: "name", label: "Ime slavljenika", type: "text", required: true, maxLength: 60 },
        { name: "age", label: "Godine", type: "number", min: 1, max: 120 },
      ],
    },
    {
      title: "Event",
      fields: [
        { name: "date", label: "Datum", type: "date", required: true },
        { name: "time", label: "Vrijeme", type: "time", required: true },
        { name: "address", label: "Adresa", type: "text", required: true, maxLength: 120 },
      ],
    },
    {
      title: "Poruka",
      fields: [{ name: "message", label: "WhatsApp poruka", type: "textarea", maxLength: 500 }],
    },
  ],
};

const EVENT_SCHEMA: FormSchema = {
  title: "Detalji eventa",
  sections: [
    {
      title: "Osnovno",
      fields: [
        { name: "title", label: "Naslov eventa", type: "text", required: true, maxLength: 80 },
        { name: "subtitle", label: "Podnaslov", type: "text", maxLength: 120 },
        { name: "heroImage", label: "URL naslovne slike", type: "url" },
      ],
    },
    {
      title: "Info",
      fields: [
        { name: "date", label: "Datum", type: "date", required: true },
        { name: "time", label: "Vrijeme", type: "time", required: true },
        { name: "venue", label: "Lokacija", type: "text", maxLength: 80 },
        { name: "address", label: "Adresa", type: "text", maxLength: 120 },
      ],
    },
    {
      title: "Poruka",
      fields: [{ name: "message", label: "WhatsApp poruka", type: "textarea", maxLength: 500 }],
    },
  ],
};

export function getFormSchemaForTemplate(templateId: number): FormSchema {
  const meta = getTemplateById(templateId);
  const slug = meta?.slug ?? "";

  if (slug.startsWith("wedding-")) return WEDDING_SCHEMA;
  if (slug.startsWith("birthday-")) return BIRTHDAY_SCHEMA;
  // "event-" i ostalo
  return EVENT_SCHEMA;
}

/** Opcionalno: helper koji wrapa sve polja u { v, template, fields } prije save-a  */
export function wrapFieldsForSave(templateId: number, fields: Record<string, unknown>) {
  const meta = getTemplateById(templateId);
  return {
    v: 1,
    templateId,
    template: meta?.slug ?? null,
    fields,
  };
}
