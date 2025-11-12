import type { Prisma } from "@prisma/client";

export type Json = Prisma.JsonValue;

export type TemplateLiteDB = {
  id: number;
  name: string;
  price: number;
  fullPrice: number;
  previewUrl?: string | null;
  slug?: string | null;
  schemaJson?: Json | null;
};

export type PurchaseLiteDB = {
  id: string;
  templateId: number; // FK
  customData?: Json | null;
  publicSlug?: string | null;
  previewSlug?: string | null;
};
